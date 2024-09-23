'use client';
import Image from 'next/image';
import { useRef } from 'react';
import backgroundImage from '../assets/2.jpg';

export default function LandingPage() {
  const contentRef = useRef(null);

  const scrollToContent = () => {
    contentRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      {/* Landing Section */}
      <section className="relative h-screen bg-cover bg-center">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60">
          <Image
            className="relative h-full w-full object-cover"
            src={backgroundImage}
            alt="Background Image"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-netflixRed font-bold mb-4 sm:mb-6">
            Holla Movies
          </h1>

          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl max-w-md sm:max-w-xl md:max-w-2xl mb-4 sm:mb-6">
            Explore the best movies, series, and animations in one place. Watch your favorites
            anytime, anywhere.
          </p>

          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-sm sm:text-lg transition duration-300"
            onClick={scrollToContent}
          >
            Explore
          </button>
        </div>
      </section>

      {/* Main Content Section */}
<section
  ref={contentRef}
  className="py-12 text-white  bg-cover bg-center"
  style={{ backgroundImage: "url('/assets/background.jpg')" }}
>
  <div className="container mx-auto text-center px-4">
    <h2 className="text-2xl sm:text-3xl md:text-4xl text-netflixRed font-bold mb-4 sm:mb-6">
      Start Watching Now
    </h2>
    <p className="text-sm sm:text-lg md:text-xl max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mb-6 sm:mb-8">
      Discover thousands of movies, series, and animations from around the world. Dive in and
      start watching.
    </p>
  </div>
</section>
    </div>
  );
}
