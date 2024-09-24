"use client";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/"); // Redirect to the home page after successful sign up
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>
      <SignUp 
        path="/sign-up" 
        routing="path" 
        signInUrl="/sign-in" // Optional: URL to redirect users to sign-in page
        afterSignUpUrl="/" // Optional: URL to redirect users after signing up
        onSuccess={handleSuccess} // Redirect on successful sign-up
        style={{
          container: { 
            background: "#fff", 
            borderRadius: "8px", 
            padding: "20px", 
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
          },
        }}
      />
    </div>
  );
}
