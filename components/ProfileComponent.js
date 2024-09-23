// components/ProfileComponent.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, provider } from '../app/firebase';
import { UserCircleIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function ProfileComponent() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in: ', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="bg-black py-4 px-6">
      <div className="flex justify-between items-center">
        <div className="flex-shrink-0">
          <h1
            onClick={() => router.push('/')}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-netflixRed cursor-pointer"
          >
            Holla Movies
          </h1>
        </div>
        <div className="flex-shrink-0">
          {user ? (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center text-white">
                  <UserCircleIcon className="h-8 w-8 text-white" />
                </Menu.Button>
              </div>
              <Transition as={Fragment}>
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 text-sm text-gray-700"
                      >
                        Sign Out
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (            <button
              onClick={handleSignIn}
              className="bg-netflixRed text-white px-4 py-2 rounded"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
