"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
import { Parallax } from "react-parallax";
import axios from "axios";
import { useUser } from "@clerk/nextjs";  // Clerk useUser hook
import { useRouter } from "next/navigation";  // Import Next.js router
import { FaHeart, FaRegHeart, FaBookmark, FaGlobe, FaImdb, FaRegBookmark, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import { MdBookmark, MdBookmarkBorder } from 'react-icons/md';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ActorCard from "./ActorCard";
import Trailer from "./Trailer";
import RelatedMovies from "./RelatedMovies";
import { ToastContainer, toast } from "react-toastify";
import VideoPlayer from "./VideoPlayer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomArrow from './CustomArrow';

const API_KEY = "9f36ddb9ac01ad234be50dc7429b040b"; // Replace with your actual API key

export default function MovieDetailsClient({ movie, credits, productionCompanies, externalIds }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [activeTab, setActiveTab] = useState("Cast");
  const videoPlayerRef = useRef(null);
  
  const { user } = useUser();  // Get user from Clerk
  const router = useRouter();  // Next.js router

  const handleAuthCheck = (action) => {
    if (!user) {
      toast.warning("Please sign in to add to favorites or watchlist.");
      router.push('/sign-in'); // Redirect to sign-in page
    } else {
      action(); // Perform the action if the user is authenticated
    }
  };

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
          { params: { api_key: API_KEY } }
        );
        const movieVideos = response.data.results;
        setVideos(movieVideos);
        if (movieVideos.length > 0) {
          setSelectedVideo(movieVideos[0]);
        }
      } catch (error) {
        console.error("Error fetching movie videos:", error);
      }
    }

    async function fetchReviews() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}/reviews`,
          {
            params: { api_key: API_KEY, language: "en-US", page: 1 },
          }
        );
        setReviewsList(response.data.results);
      } catch (error) {
        console.error("Error fetching movie reviews:", error);
      }
    }

    fetchVideos();
    fetchReviews();
  }, [movie.id]);

  // Fetch favorite and watchlist status when the component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const [favResponse, watchlistResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/account/{account_id}/favorite/movies`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }),
          axios.get(`https://api.themoviedb.org/3/account/{account_id}/watchlist/movies`, {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            },
          }),
        ]);

        const isFav = favResponse.data.results.some(favoriteMovie => favoriteMovie.id === movie.id);
        const isWatchlisted = watchlistResponse.data.results.some(watchlistedMovie => watchlistedMovie.id === movie.id);

        setIsFavorite(isFav);
        setInWatchlist(isWatchlisted);
      } catch (error) {
        console.error('Error fetching status:', error);
      }
    };

    fetchStatus();
  }, [movie.id]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    handleAuthCheck(async () => {
      try {
        const isAdding = !isFavorite;
        
        await axios.post(
          "https://api.themoviedb.org/3/account/{account_id}/favorite",
          {
            media_type: "movie",
            media_id: movie.id,
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
          toast.success(`${movie.title} added to favorites!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`${movie.title} removed from favorites.`, {
            position: "bottom-right",
            theme: "dark",
          });
        }
      } catch (error) {
        console.error('Error updating favorites:', error);
      }
    });
  };
  
  const toggleWatchlist = async (e) => {
    e.stopPropagation();
    handleAuthCheck(async () => {
      try {
        const isAdding = !inWatchlist;
  
        await axios.post(
          "https://api.themoviedb.org/3/account/{account_id}/watchlist",
          {
            media_type: "movie",
            media_id: movie.id,
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
          toast.success(`${movie.title} added to watchlist!`, {
            position: "bottom-right",
            theme: "dark",
          });
        } else {
          toast.info(`${movie.title} removed from watchlist.`, {
            position: "bottom-right",
            theme: "dark",
          });
        }
      } catch (error) {
        console.error('Error updating watchlist:', error);
      }
    });
  };

  return (
    <div className="text-white">
      {/* Backdrop and Poster Section */}
      <Parallax
        bgImage={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        bgImageStyle={{
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        strength={300}
      >
        <div className="relative bg-cover w-full min-h-[85vh]">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>

          {/* Content container */}
          <div className="relative z-10 w-full max-w-6xl mx-auto py-8 px-6">
            <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Movie Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg object-cover w-2/3 lg:w-1/3 mb-6 lg:mb-0" // Adjusted width and height for responsiveness
            />

              {/* Movie Details */}
              <div className="lg:w-3/4 text-white">
                <div className="flex items-center justify-between">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">{movie.title} <span className="text-gray-400">{movie.release_date.slice(0, 4)}</span></h1>
                  <div className="flex items-center space-x-3">
                    <div className="text-red-500 cursor-pointer" onClick={toggleFavorite}>
                      {isFavorite ? <FaHeart size={28} /> : <FaRegHeart size={28} className="text-white" />}
                    </div>
                    <div className="text-yellow-500 cursor-pointer" onClick={toggleWatchlist}>
                      {inWatchlist ? <MdBookmark size={28} /> : <MdBookmarkBorder size={28} className="text-white" />}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center text-gray-300 mb-4">
                  <p className="text-sm mr-5">Release Date: {movie.release_date}</p>
                  <p className="text-sm">Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                </div>

                <div className="flex items-center mb-4">
                  <h3 className="text-xl font-semibold">Genres:</h3>
                  <div className="flex flex-wrap ml-2">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="px-2 py-1 bg-red-600 rounded-md text-sm mx-1">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Budget, Revenue, User Score */}
                <div className="flex space-x-8 text-gray-300 mb-6">
                  <div>
                    <h3 className="font-semibold">Budget:</h3>
                    <p>${movie.budget ? movie.budget.toLocaleString() : 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Revenue:</h3>
                    <p>${movie.revenue ? movie.revenue.toLocaleString() : 'N/A'}</p>
                  </div>
                  <div className="flex items-center">
                    <h3 className="font-semibold mr-2">User Score:</h3>
                    <div className="w-12 h-12">
                      <CircularProgressbar
                      value={Math.round(movie.vote_average * 10)}
                      text={`${Math.round(movie.vote_average * 10)}%`}
                      styles={buildStyles({
                        textColor: '#fff',
                        pathColor: '#4caf50', // green like in the image
                        trailColor: '#555',
                      })}
                    />
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <h2 className="text-2xl font-bold mb-4">Overview:</h2>
                <p className="text-lg mb-6">{movie.overview}</p>

                {/* Director and Composer */}
                <div className="flex space-x-6">
                  <div>
                    <h3 className="font-semibold">Directed by</h3>
                    <div className="flex items-center space-x-2">
                      {credits.crew.find((member) => member.job === 'Director')?.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w45${credits.crew.find((member) => member.job === 'Director').profile_path}`}
                          alt="Director"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <p>{credits.crew.find((member) => member.job === 'Director')?.name || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold">Composed by</h3>
                    <div className="flex items-center space-x-2">
                      {credits.crew.find((member) => member.job === 'Original Music Composer')?.profile_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w45${credits.crew.find((member) => member.job === 'Original Music Composer').profile_path}`}
                          alt="Composer"
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <p>{credits.crew.find((member) => member.job === 'Original Music Composer')?.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Share With Section */}
                  <div>
                    <h2 className="text-2xl font-bold">Share With</h2>
                    <div className="flex space-x-4 mt-2">
                      {externalIds && (
                        <>
                          {externalIds.facebook_id && (
                            <a
                              href={`https://www.facebook.com/sharer/sharer.php?u=https://www.themoviedb.org/movie/${movie.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-125"
                            >
                              <FaFacebook size={32} />
                            </a>
                          )}
                          {externalIds.twitter_id && (
                            <a
                              href={`https://twitter.com/intent/tweet?text=${movie.title}&url=https://www.themoviedb.org/movie/${movie.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-125"
                            >
                              <FaTwitter size={32} />
                            </a>
                          )}
                          {externalIds.instagram_id && (
                            <a
                              href={`https://www.instagram.com/?url=https://www.themoviedb.org/movie/${movie.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-purple-600 hover:text-purple-800 transition-transform transform hover:scale-125"
                            >
                              <FaInstagram size={32} />
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Parallax>


      {/* Layout Container */}
<div className="container mx-auto px-4 mt-4 grid grid-cols-12 gap-4 p-4">
  {/* Main Content (Cast, Crew, Trailers, Videos) */}
  <div className="col-span-12 lg:col-span-8">
    {/* Tabs for Cast, Crew, Trailers, All Videos */}
    <div className="flex justify-around mb-4 border bg-gray-800 rounded p-2 border-gray-700">
      {['Cast', 'Crew', 'Trailers', 'All Videos'].map((tab) => (
        <button
          key={tab}
          className={`py-2 px-4 text-white bg-gray-600 rounded-md ${
            activeTab === tab ? 'border-b-2 border-red-500' : 'hover:bg-gray-700'
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>

    {/* Content Based on Active Tab */}
    {activeTab === "Cast" && (
      <div className="overflow-x-auto flex space-x-4 py-4 scrollbar-hide">
        <div className="flex space-x-4 w-max">
          {credits.cast.map((actor) => (
            <div key={actor.id} className="flex-shrink-0">
              <ActorCard actor={actor} />
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === "Crew" && (
      <div className="overflow-x-auto flex space-x-4 py-4 scrollbar-hide">
        <div className="flex space-x-4 w-max">
          {credits.crew.map((crew) => (
            <div key={crew.id} className="flex-shrink-0 h-55">
              <ActorCard actor={crew} />
            </div>
          ))}
        </div>
      </div>
    )}

    {activeTab === "Trailers" && <Trailer movieId={movie.id} />}

    {activeTab === "All Videos" && (
      <>
        <div ref={videoPlayerRef} className="mt-8">
          <VideoPlayer
            url={
              selectedVideo
                ? `https://www.youtube.com/watch?v=${selectedVideo.key}`
                : null
            }
            title={selectedVideo ? selectedVideo.name : "Select a video"}
          />
        </div>

        <div className="overflow-x-auto whitespace-nowrap space-x-4 flex py-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="inline-block cursor-pointer flex-shrink-0"
              onClick={() => handleVideoClick(video)}
            >
              <img
                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                alt={video.name}
                className="rounded-lg shadow-lg w-40 h-24 object-cover"
              />
              <p className="mt-2 text-center text-sm">{video.name}</p>
            </div>
          ))}
        </div>
      </>
    )}
  </div>

  {/* Information Section */}
  <div className="col-span-12 lg:col-span-4 bg-gray-800 p-4 rounded-lg border">
    <h2 className="text-xl font-bold mb-2 text-white">Information</h2>
    <p className="text-white">
      <strong>Status:</strong> 
    </p>
    <p className="p-2 bg-white text-black rounded w-20">{movie.status}</p>
    
    <p className="mt-4 text-white">
      <strong>Production Companies:</strong>
    </p>
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
      {productionCompanies
        .filter(company => company.logo_path) // Filter out companies without logo_path
        .map(company => (
          <a key={company.id} href={company.homepage} target="_blank" rel="noopener noreferrer" className="flex justify-center p-2 bg-white rounded">
            <img
              src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
              alt={company.name}
              className="h-12"
            />
          </a>
        ))}
    </div>

    <p className="mt-4 text-white">
      <strong>Production Countries:</strong> 
    </p>
    <div className="flex p-2 bg-white text-black rounded min-w-28">
      {movie.production_countries[0]?.name}
    </div>

    <p className="mt-2 text-white">
      <strong>Spoken Languages:</strong> 
    </p>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
      {movie.spoken_languages.map((lang, index) => (
        <div key={index} className="p-2 bg-white text-black rounded flex justify-center">
          {lang.english_name}
        </div>
      ))}
    </div>
  </div>
</div>


      {/* Reviews Section */}
      <h2 className="container px-4 text-2xl font-bold mt-6">Reviews</h2>
      {reviewsList.length > 0 ? (
        <div className="container px-4 mt-4">
          <div className="overflow-x-auto flex space-x-4 py-4 scrollbar-hide">
            <div className="flex space-x-4">
              {reviewsList.map((review) => (
              <div
                key={review.id}
                className="p-4 gap-2 bg-gray-700 border border-gray-700 rounded-lg shadow-lg text-white h-64 w-80 overflow-hidden"
              >
                  <div className="flex items-center mb-3 mx-2">
                    {review.author_details.avatar_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`}
                        alt={review.author}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    ) : (
                      <UserCircleIcon className="h-10 w-10 text-white mr-3" />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-red-500">
                        {review.author}
                      </h3>
                      <div className="text-yellow-400">
                        Rating: {review.author_details.rating ? `${review.author_details.rating}/10` : 'N/A'}
                      </div>
                    </div>
                  </div>
                  <p className="mb-1 overflow-hidden text-ellipsis line-clamp-5">
                    {review.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="container px-4 text-gray-400">No reviews available for this movie.</p>
      )}

      {/* Related Movies Section */}
      <div className="container px-4 mt-5">
        <RelatedMovies movieId={movie.id} />
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
