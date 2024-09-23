"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md'; // Import bookmark icons
import axios from 'axios';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import Firebase Auth

export default function SeriesCard({ series, onFavoriteChange, onWatchlistChange }) {
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

  // Fetch favorite and watchlist status when the component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [favResponse, watchlistResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/account/{account_id}/favorite/tv`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }),
          axios.get(`https://api.themoviedb.org/3/account/{account_id}/watchlist/tv`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }),
        ]);

        const isFav = favResponse.data.results.some(favoriteSeries => favoriteSeries.id === series.id);
        const isWatchlisted = watchlistResponse.data.results.some(watchlistedSeries => watchlistedSeries.id === series.id);

        setIsFavorite(isFav);
        setInWatchlist(isWatchlisted);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, [series.id]);

  const handleClick = () => {
    router.push(`/series/${series.id}`);
  };

  const getStars = () => {
    const rating = series.vote_average / 2; // Convert 10-point scale to 5-point scale
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
            media_id: series.id,
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
          toast.success(`${series.name} added to favorites!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`${series.name} removed from favorites.`, {
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
            media_id: series.id,
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
          toast.success(`${series.name} added to watchlist!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`${series.name} removed from watchlist.`, {
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

  const releaseYear = new Date(series.first_air_date).getFullYear();

  return (
    <motion.div
      className="movie-card relative bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
      style={{ height: '100%' }}
      onClick={handleClick}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
        alt={series.name}
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

      <div className="p-4 h-32 flex flex-col justify-between">
        <h3 className="text-lg font-bold text-white truncate">
          {series.name}
        </h3>

        <div className="flex items-center">
          {getStars()}
          <span className="ml-2 text-sm text-gray-400">({series.vote_average})</span>
        </div>
      </div>
    </motion.div>
  );
}
