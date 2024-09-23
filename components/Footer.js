"use client"
import { useEffect, useRef, useState } from 'react';

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // This hook will track when the footer is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null, // relative to the viewport
        threshold: 0.1, // trigger when 10% of the footer is in view
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className={`bg-netflixGray text-white py-8 mt-8 transform transition-transform duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      <div className="mx-auto px-4">
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} MovieApp. All Rights Reserved. Developed by <a href="https://fadyadel-fady-adels-projects.vercel.app/" className="text-gray-700 hover:underline text-red-500">Fady</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
