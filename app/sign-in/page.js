"use client";
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa"; // Facebook Icon
import backgroundImage from "../../assets/1.jpg"; // Path to your background image
import axios from "axios";
import { auth } from "../firebase"; // Firebase auth object
import { storage } from "../firebase"; // Import Firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports for image upload
import { updateProfile } from "firebase/auth"; // Import updateProfile

export default function SignIn() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        router.push("/profile"); // Redirect after successful login
      }
    });
  }, [router]);

  // Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handlePostSignIn(result);
    } catch (error) {
      toast.error("Failed to sign in with Google");
      console.error("Error during Google Sign-In:", error);
    }
  };

  // Facebook sign-in handler
  const handleFacebookSignIn = async () => {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handlePostSignIn(result);
    } catch (error) {
      toast.error("Failed to sign in with Facebook");
      console.error("Error during Facebook Sign-In:", error);
    }
  };

  // Shared post-sign-in handler
  const handlePostSignIn = async (result) => {
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
  };

  // Function to update user profile
  const updateUserProfile = async (user) => {
    try {
      if (profilePic) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, profilePic);
        const profilePicUrl = await getDownloadURL(storageRef);
        await updateProfile(user, { displayName: username, photoURL: profilePicUrl });
      } else {
        await updateProfile(user, { displayName: username, photoURL: null });
      }
      toast.success("Profile created successfully!");
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast.error("Error creating profile: " + error.message);
    }
  };

    // Navigate to sign-up page
    const goToSignUp = () => {
      router.push("/sign-up");
    };

  return (
    <section className="relative h-screen bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-60">
        <Image className="relative h-full w-full object-cover opacity-60" src={backgroundImage} alt="Background Image" priority />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="bg-gray-700 bg-opacity-90 shadow-lg rounded-lg p-8 max-w-md w-full space-y-6">
          <h1 className="text-3xl text-center font-bold text-netflixRed mb-2">Join Us at Holla Movies</h1>
          <p className="text-center text-white mb-4">Enjoy unlimited access to movies and more. Sign in to continue.</p>
          
          {/* Google Sign-In Button */}
          <button onClick={handleGoogleSignIn} className="flex items-center justify-center bg-gray-100 border border-gray-300 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md w-full transition ease-in-out duration-300">
            <FcGoogle className="mr-2 text-2xl" />
            Sign in with Google
          </button>

          {/* Facebook Sign-In Button */}
          <button onClick={handleFacebookSignIn} className="flex items-center justify-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md w-full transition ease-in-out duration-300 hover:bg-blue-700">
            <FaFacebook className="mr-2 text-2xl" />
            Sign in with Facebook
          </button>

          {/* Create New Account Button */}
          <button onClick={goToSignUp} className="w-full bg-netflixRed hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 transition ease-in-out duration-300">
            Create New Account
          </button>
        </div>
      </div>
    </section>
  );
}
