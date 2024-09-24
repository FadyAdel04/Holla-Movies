"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'; // Removed heart icons
import axios from 'axios';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs'; // Import Clerk user hook

export default function SeasonCard({ season, seriesId }) {
  const router = useRouter();
  const releaseYear = new Date(season.air_date).getFullYear();

  const handleClick = () => {
    router.push(`/series/${seriesId}/season/${season.season_number}`);
  };

  const getStars = () => {
    const rating = season.vote_average / 2; // Convert 10-point scale to 5-point scale
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {Array(fullStars).fill(<FaStar className="text-yellow-500" />)} {/* Full stars */}
        {halfStar === 1 && <FaStarHalfAlt className="text-yellow-500" />} {/* Half star */}
        {Array(emptyStars).fill(<FaRegStar className="text-yellow-500" />)} {/* Empty stars */}
      </>
    );
  };

  return (
    <motion.div
      className="movie-card relative bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
      style={{ height: '100%' }}
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${season.poster_path}`}
        alt={season.name}
        className="rounded-t-lg object-cover w-full h-64"
      />

      {/* Release Year in the Top Right */}
      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-bold">
        {releaseYear}
      </div>

      <div className="p-4 h-38 flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white truncate">
          {season.name}
        </h3>
        <p className="text-sm text-gray-400">Season {season.season_number}</p>
        <div className="flex items-center">
          {getStars()}
          <span className="ml-2 text-sm text-gray-400">({season.vote_average})</span>
        </div>
      </div>
    </motion.div>
  );
}
