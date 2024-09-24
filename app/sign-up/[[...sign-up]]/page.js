"use client";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Importing the Image component
import backgroundImage from "../../../assets/2.jpg"; // Import your background image

export default function SignUpComponent() {
  const router = useRouter();

  const handleSignUp = async (event) => {
    event.preventDefault();
    router.push("/"); // Redirect after signing up
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src={backgroundImage}
        alt="Background Image"
        layout="fill" // Make the image fill the parent div
        className="object-cover"
        priority // Load this image quickly
      />
      <div className="relative max-w-md mx-auto p-8 rounded-lg shadow-lg bg-opacity-90">
        <SignUp
          path="/sign-up" // Path for routing
          routing="path" // Routing method
          redirectUrl="/" // URL to redirect after sign-up
          onSignUpSuccess={handleSignUp} // Callback for successful sign-up
        />
      </div>
    </div>
  );
}
