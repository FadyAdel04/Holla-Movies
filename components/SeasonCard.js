"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'; // Import bookmark icons
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

export default function SeasonCard({ season, seriesId, onFavoriteChange, onWatchlistChange }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [user, setUser] = useState(null); // User state to check if user is logged in

  const auth = getAuth();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set user if logged in
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAuthCheck = async (action) => {
    if (!user) {
      toast.warning("Please sign in to add to favorites or watchlist.");
      router.push('/sign-in'); // Redirect to sign-in page
    } else {
      action(); // If user is authenticated, perform the action
    }
  };

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

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    handleAuthCheck(async () => {
      try {
        const isAdding = !isFavorite;

        await axios.post(
          'https://api.themoviedb.org/3/account/{account_id}/favorite',
          {
            media_type: 'tv',
            media_id: season.id,
            favorite: isAdding,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }
        );

        setIsFavorite(isAdding);
        if (isAdding) {
          toast.success(`Season ${season.season_number} added to favorites!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`Season ${season.season_number} removed from favorites.`, {
            position: "bottom-right",
            theme: "dark",
          });
        }

        if (onFavoriteChange) onFavoriteChange(); // Notify parent component
      } catch (error) {
        console.error('Error updating favorites:', error);
        toast.error('An error occurred. Please try again.');
      }
    });
  };

  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    handleAuthCheck(async () => {
      try {
        const isAdding = !inWatchlist;

        await axios.post(
          'https://api.themoviedb.org/3/account/{account_id}/watchlist',
          {
            media_type: 'tv',
            media_id: season.id,
            watchlist: isAdding,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }
        );

        setInWatchlist(isAdding);
        if (isAdding) {
          toast.success(`Season ${season.season_number} added to watchlist!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`Season ${season.season_number} removed from watchlist.`, {
            position: "bottom-right",
            theme: "dark",
          });
        }

        if (onWatchlistChange) onWatchlistChange(); // Notify parent component
      } catch (error) {
        console.error('Error updating watchlist:', error);
        toast.error('An error occurred. Please try again.');
      }
    });
  };

  const releaseYear = new Date(season.air_date).getFullYear();

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

      {/* Icons for favorite and watchlist */}
      <div className="absolute top-2 left-2 flex space-x-2">
        <div className="text-red-500 cursor-pointer" onClick={toggleFavorite}>
          {isFavorite ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
        </div>
        <div className="text-yellow-500 cursor-pointer" onClick={toggleWatchlist}>
          {inWatchlist ? <MdBookmark size={24} /> : <MdBookmarkBorder size={24} />}
        </div>
      </div>

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
