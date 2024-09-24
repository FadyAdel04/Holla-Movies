"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, useSignIn } from "@clerk/nextjs";
import { SignOutButton } from "@clerk/nextjs"; // Import SignOutButton
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { signIn } = useSignIn();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    // Load the profile image URL from local storage
    const storedProfileImageUrl = localStorage.getItem("profileImageUrl");
    console.log("Stored Profile Image URL:", storedProfileImageUrl); // Debug log
    if (storedProfileImageUrl) {
      setProfileImageUrl(storedProfileImageUrl);
    } else if (user?.profileImageUrl) {
      setProfileImageUrl(user.profileImageUrl); // Fallback to Clerk image if not found
    }
  }, [user]);

  const handleSignIn = async () => {
    try {
      await signIn(); // This will open the sign-in modal
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <header className="bg-black py-3 px-4 sticky top-0 transition-transform duration-300 z-50">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <h1
            onClick={() => router.push("/")}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-netflixRed cursor-pointer"
          >
            Holla Movies
          </h1>
        </div>

        {/* Search Bar - Visible for larger screens */}
        <div className="hidden md:flex flex-grow justify-center max-w-lg">
          <SearchBar />
        </div>

        {/* User Profile or Sign In Button */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="text-white bg-gray-700 px-3 py-2 rounded-full"
            >
              {isSearchVisible ? "Close" : "🔍"}
            </button>
          </div>

          {/* User Profile or Sign In */}
          {isSignedIn ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center bg-gray-700 text-white px-4 py-2 rounded-lg">
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl}
                      alt="User Profile"
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <span className="h-6 w-6 text-white bg-gray-500 rounded-full flex items-center justify-center">
                      {user.firstName[0].toUpperCase()}
                    </span>
                  )}
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {/* Profile Button */}
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => router.push("/profile")}
                          className={`${
                            active ? "bg-red-600" : "bg-gray-700"
                          } block w-full text-left px-4 py-2 text-sm text-white rounded transition-colors duration-200`}
                        >
                          Profile
                        </button>
                      )}
                    </Menu.Item>

                    {/* Sign Out Button */}
                    <Menu.Item>
                      {({ active }) => (
                        <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                          <button
                            className={`${
                              active ? "bg-gray-600" : "bg-gray-700"
                            } block w-full text-left px-4 py-2 text-sm text-white rounded transition-colors duration-200`}
                          >
                            Sign Out
                          </button>
                        </SignOutButton>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <button
              onClick={handleSignIn}
              className="text-white bg-gray-700 px-4 py-2 rounded-md font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar - Toggled by button */}
      {isSearchVisible && (
        <div className="md:hidden mt-4">
          <SearchBar />
        </div>
      )}
    </header>
  );
}
