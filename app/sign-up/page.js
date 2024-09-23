"use client";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import backgroundImage from "../../assets/1.jpg"; // Path to your background image
import axios from "axios";
import { auth, storage } from "../firebase"; // Firebase auth and storage objects
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Link from "next/link"; // Import Link from Next.js for navigation

export default function SignUp() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/profile"); // Redirect after successful sign-up
      }
    });
  }, [router]);

  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const userId = result.user.uid;

        // TMDB token request
        const { data: tokenResponse } = await axios.get(
          `https://api.themoviedb.org/3/authentication/token/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        );
        const requestToken = tokenResponse.request_token;

        // Redirect to TMDB authentication
        window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=http://localhost:3000/callback?firebaseId=${userId}`;

        // Set default username and profile picture
        setUsername(result.user.displayName || "New User");
        setProfilePic(result.user.photoURL || "/default-avatar.jpg");
        await updateUserProfile(result.user); // Update profile in Firebase
      }
    } catch (error) {
      toast.error("Failed to sign up");
      console.error("Error during Google Sign-Up:", error);
    }
  };

  const updateUserProfile = async (user) => {
    try {
      if (profilePic) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        const profilePicUrl = await getDownloadURL(storageRef);
        await updateProfile(user, {
          displayName: username,
          photoURL: profilePicUrl,
        });
      } else {
        await updateProfile(user, {
          displayName: username,
          photoURL: null,
        });
      }
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error creating profile: " + error.message);
    }
  };

  return (
    <section className="relative h-screen bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-60">
        <Image className="relative h-full w-full object-cover opacity-60" src={backgroundImage} alt="Background Image" priority />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-gray-700 bg-opacity-90 shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
          <h1 className="text-3xl text-center font-bold text-netflixRed mb-2">Create Your Holla Movies Account</h1>
          <p className="text-center text-white mb-4">Sign up to start your movie adventure.</p>
          <button onClick={handleGoogleSignUp} className="flex items-center justify-center bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md w-full transition ease-in-out duration-300">
            <FcGoogle className="mr-2 text-2xl" />
            Sign up with Google
          </button>
          {/* Correct usage of Next.js Link without the <a> tag */}
          <p className="text-center text-white">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-netflixRed hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
