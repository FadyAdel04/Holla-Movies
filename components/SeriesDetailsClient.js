"use client";
import SeasonCard from './SeasonCard'; // Adjust the import path as necessary
import React, { useState, useEffect, useRef } from "react";
import { UserCircleIcon } from "@heroicons/react/solid";
import { Parallax } from "react-parallax";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ActorCard from "./ActorCard";
import RelatedSeries from "./RelatedSeries";
import VideoPlayer from "./VideoPlayer";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomArrow from './CustomArrow'; // Import the CustomArrow component
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const API_KEY = "9f36ddb9ac01ad234be50dc7429b040b"; // Replace with your actual API key

export default function SeriesDetailsClient({ series, credits, seasons, externalIds, reviews, videos = [] }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [reviewsList, setReviewsList] = useState([]);
  const [activeTab, setActiveTab] = useState("Cast");
  const [activeSeasonTab, setActiveSeasonTab] = useState('All Seasons');
  const [selectedVideo, setSelectedVideo] = useState(videos.length > 0 ? videos[0] : null);
  const videoPlayerRef = useRef(null);
  const { user } = useUser();
  
  useEffect(() => {
    // Fetch the current favorite and watchlist status for this series
    const fetchStatus = async () => {
      if (user) {
        try {
          const [favResponse, watchlistResponse] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/account/${user.id}/favorite/tv`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
            axios.get(`https://api.themoviedb.org/3/account/${user.id}/watchlist/tv`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
          ]);

          // Check if the series is in the user's favorite or watchlist
          const isFav = favResponse.data.results.some((item) => item.id === series.id);
          const isWatchlist = watchlistResponse.data.results.some((item) => item.id === series.id);

          setIsFavorite(isFav);
          setIsInWatchlist(isWatchlist);
        } catch (error) {
          console.error("Error fetching favorite or watchlist status", error);
        }
      }
    };

    fetchStatus();
  }, [user, series.id]);

  const handleToggleFavorite = async () => {
    try {
      await axios.post(
        `https://api.themoviedb.org/3/account/${user.id}/favorite`,
        {
          media_type: "tv",
          media_id: series.id,
          favorite: !isFavorite, // Toggle favorite status
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsFavorite(!isFavorite); // Update state after success
  
      // Change toast messages based on the action
      if (isFavorite) {
        toast.info(`Removed ${series.name} from favorites!`); // Info toast for removal with series name
      } else {
        toast.success(`Added ${series.name} to favorites!`); // Success toast for addition with series name
      }
    } catch (error) {
      console.error("Error toggling favorite", error);
      toast.error("Failed to update favorites.");
    }
  };
  
  const handleToggleWatchlist = async () => {
    try {
      await axios.post(
        `https://api.themoviedb.org/3/account/${user.id}/watchlist`,
        {
          media_type: "tv",
          media_id: series.id,
          watchlist: !isInWatchlist, // Toggle watchlist status
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsInWatchlist(!isInWatchlist); // Update state after success
  
      // Change toast messages based on the action
      if (isInWatchlist) {
        toast.info(`Removed ${series.name} from watchlist!`); // Info toast for removal with series name
      } else {
        toast.success(`Added ${series.name} to watchlist!`); // Success toast for addition with series name
      }
    } catch (error) {
      console.error("Error toggling watchlist", error);
      toast.error("Failed to update watchlist.");
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="text-white">
      {/* Backdrop and Poster Section */}
      <Parallax
      bgImage={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
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
            {/* Series Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500/${series.poster_path}`}
              alt={series.name}
              className="rounded-lg shadow-lg object-cover w-2/3 lg:w-1/3 mb-6 lg:mb-0"
            />

            {/* Series Details */}
            <div className="lg:w-3/4 text-white">
              <div className="flex items-center justify-between">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                  {series.name} <span className="text-gray-400">{series.first_air_date.slice(0, 4)}</span>
                </h1>
                <div className="flex items-center space-x-3">
                <div className="text-red-500 cursor-pointer" onClick={handleToggleFavorite}>
                {isFavorite ? <FaHeart size={28} className="text-red-500" /> : <FaRegHeart size={28} className="text-white" />}
              </div>
              <div className="text-yellow-500 cursor-pointer" onClick={handleToggleWatchlist}>
              {isInWatchlist ? <FaBookmark size={28} className="text-yellow-500" /> : <FaRegBookmark size={28} className="text-white" />}

              </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center text-gray-300 mb-4">
                <p className="text-sm mr-5">First Air Date: {series.first_air_date}</p>
              </div>

              {/* Genres */}
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-semibold">Genres:</h3>
                <div className="flex flex-wrap ml-2">
                  {series.genres.map((genre) => (
                    <span key={genre.id} className="px-2 py-1 bg-red-600 rounded-md text-sm mx-1">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* User Rating */}
              <div className="flex space-x-8 text-gray-300 mb-6">
                <div className="flex items-center">
                  <h3 className="font-semibold mr-2">User Rating:</h3>
                  <div className="w-12 h-12">
                    <CircularProgressbar
                      value={Math.round(series.vote_average * 10)}
                      text={`${Math.round(series.vote_average * 10)}%`}
                      styles={buildStyles({
                        textColor: '#fff',
                        pathColor: '#4caf50',
                        trailColor: '#555',
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Overview */}
              <h2 className="text-2xl font-bold mb-4">Overview:</h2>
              <p className="text-lg mb-6">{series.overview}</p>

              {/* Producer and Director with Images */}
      <div className="flex space-x-6 mt-4">
      <div>
        <h3 className="font-semibold">Produced by</h3>
        <div className="flex items-center space-x-2">
          {credits.crew
            .filter((member) => member.job === 'Producer' || member.department === 'Production')[0] && (
              <div className="flex items-center space-x-2">
                {credits.crew
                  .filter((member) => member.job === 'Producer' || member.department === 'Production')[0].profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w45${credits.crew
                      .filter((member) => member.job === 'Producer' || member.department === 'Production')[0].profile_path}`}
                    alt={credits.crew.filter((member) => member.job === 'Producer' || member.department === 'Production')[0].name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <p className="text-sm text-gray-300">
                  {credits.crew.filter((member) => member.job === 'Producer' || member.department === 'Production')[0].name}
                </p>
              </div>
            )}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Directed by</h3>
        <div className="flex items-center space-x-2">
          {credits.crew
            .filter((member) => member.job === 'Director' || member.department === 'Directing')[0] && (
              <div className="flex items-center space-x-2">
                {credits.crew
                  .filter((member) => member.job === 'Director' || member.department === 'Directing')[0].profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w45${credits.crew
                      .filter((member) => member.job === 'Director' || member.department === 'Directing')[0].profile_path}`}
                    alt={credits.crew.filter((member) => member.job === 'Director' || member.department === 'Directing')[0].name}
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <p className="text-sm text-gray-300">
                  {credits.crew.filter((member) => member.job === 'Director' || member.department === 'Directing')[0].name}
                </p>
              </div>
            )}
        </div>
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
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://www.themoviedb.org/tv/${series.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-125"
                  >
                    <FaFacebook size={32} />
                  </a>
                )}
                {externalIds.twitter_id && (
                  <a
                    href={`https://twitter.com/intent/tweet?text=${series.title}&url=https://www.themoviedb.org/tv/${series.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-400 hover:text-blue-600 transition-transform transform hover:scale-125"
                  >
                    <FaTwitter size={32} />
                  </a>
                )}
                {externalIds.instagram_id && (
                  <a
                    href={`https://www.instagram.com/?url=https://www.themoviedb.org/tv/${series.id}`}
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
</Parallax>


      {/* Layout Container */}
<div className="container mx-auto px-4 mt-4 grid grid-cols-12 gap-4">
{/* Main Content (Cast, Crew, Trailer, Videos) */}
<div className="col-span-12 lg:col-span-8">
  {/* Tabs for Cast, Crew, Trailer, Videos */}
  <div className="flex flex-wrap justify-around mb-4 border bg-gray-800 rounded p-2 border-gray-700">
    {['Cast', 'Crew', 'Trailer', 'All Videos'].map((tab) => (
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
  {activeTab === 'Cast' && (
    <div className="overflow-x-auto flex space-x-2 py-4 scrollbar-hide">
      <div className="flex space-x-2 w-max">
        {credits.cast.map((actor) => (
          <div key={actor.id} className="flex-shrink-0">
            <ActorCard actor={actor} />
          </div>
        ))}
      </div>
    </div>
  )}

  {activeTab === 'Crew' && (
    <div className="overflow-x-auto flex space-x-2 py-4 scrollbar-hide">
      <div className="flex space-x-0.5 w-max">
        {credits.crew.map((member) => (
          <div key={member.id} className="flex-shrink-0 h-55">
            <ActorCard
              actor={{
                id: member.id,
                name: member.name,
                profile_path: member.profile_path,
                job: member.job,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )}

  {activeTab === 'Trailer' && (
    <div className="mt-8">
      <VideoPlayer
        url={videos.find(video => video.type === 'Trailer') ? `https://www.youtube.com/watch?v=${videos.find(video => video.type === 'Trailer').key}` : null}
        title={videos.find(video => video.type === 'Trailer') ? videos.find(video => video.type === 'Trailer').name : 'Select a trailer'}
      />
    </div>
  )}

  {activeTab === 'All Videos' && (
    <>
      <div ref={videoPlayerRef} className="mt-8">
        <VideoPlayer
          url={selectedVideo ? `https://www.youtube.com/watch?v=${selectedVideo.key}` : null}
          title={selectedVideo ? selectedVideo.name : "Select a video"}
        />
      </div>
      
      <div className="overflow-x-auto flex py-4 scrollbar-hide">
        {videos.map((video) => (
          <div
            key={video.id}
            className="inline-block cursor-pointer flex-shrink-0 mx-2"
            onClick={() => handleVideoClick(video)}
          >
            <img
              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
              alt={video.name}
              className="rounded-lg shadow-lg w-40 h-24 object-cover"
            />
            <p className="mt-2 text-center text-sm text-white">{video.name}</p>
          </div>
        ))}
      </div>
    </>
  )}

  {/* Seasons Tabs */}
  <div className="flex flex-wrap justify-around mt-4 mb-4 border bg-gray-800 rounded p-2 border-gray-700">
    {['All Seasons', 'Last Season'].map((tab) => (
      <button
        key={tab}
        className={`py-2 px-4 text-white bg-gray-600 rounded-md ${
          activeSeasonTab === tab ? 'border-b-2 border-red-500' : 'hover:bg-gray-700'
        }`}
        onClick={() => setActiveSeasonTab(tab)}
      >
        {tab}
      </button>
    ))}
  </div>

  {activeSeasonTab === 'All Seasons' && (
    <div className="overflow-x-auto flex space-x-2 py-4 scrollbar-hide">
      <div className="flex space-x-2 w-max">
        {seasons.map((season) => (
          <SeasonCard
            key={season.id}
            season={season}
            seriesId={series.id}
          />
        ))}
      </div>
    </div>
  )}

  {activeSeasonTab === 'Last Season' && seasons.length > 0 && (
    <div className="p-4 bg-gray-800 text-white rounded-lg border mt-4 flex flex-col md:flex-row">
      <div className="flex-none w-full md:w-64">
        {/* Find the last fully aired season */}
        {seasons
          .filter(season => season.air_date)
          .reduce((latest, current) => {
            const latestDate = new Date(latest.air_date);
            const currentDate = new Date(current.air_date);
            return currentDate > latestDate ? current : latest;
          }, seasons[0]) && (
          <SeasonCard
            season={seasons
              .filter(season => season.air_date)
              .reduce((latest, current) => {
                const latestDate = new Date(latest.air_date);
                const currentDate = new Date(current.air_date);
                return currentDate > latestDate ? current : latest;
              }, seasons[0])}
            seriesId={series.id}
          />
        )}
      </div>
      <div className="flex-1 mt-4 md:mt-0 md:ml-4">
        {/* Display details of the last fully aired season */}
        {seasons
          .filter(season => season.air_date)
          .reduce((latest, current) => {
            const latestDate = new Date(latest.air_date);
            const currentDate = new Date(current.air_date);
            return currentDate > latestDate ? current : latest;
          }, seasons[0]) && (
          <>
            <h2 className="text-xl font-bold mb-2">Last Season Details</h2>
            <p className="text-white">
              <strong>Season Number:</strong> {seasons
                .filter(season => season.air_date)
                .reduce((latest, current) => {
                  const latestDate = new Date(latest.air_date);
                  const currentDate = new Date(current.air_date);
                  return currentDate > latestDate ? current : latest;
                }, seasons[0]).season_number}
            </p>
            <p className="mt-4 text-white">
              <strong>Episodes:</strong> {seasons
                .filter(season => season.air_date)
                .reduce((latest, current) => {
                  const latestDate = new Date(latest.air_date);
                  const currentDate = new Date(current.air_date);
                  return currentDate > latestDate ? current : latest;
                }, seasons[0]).episode_count}
            </p>
            <p className="mt-4 text-white">
              <strong>Rating:</strong> {seasons
                .filter(season => season.air_date)
                .reduce((latest, current) => {
                  const latestDate = new Date(latest.air_date);
                  const currentDate = new Date(current.air_date);
                  return currentDate > latestDate ? current : latest;
                }, seasons[0]).vote_average}
            </p>
            <p className="mt-4 text-white">
              <strong>Release Date:</strong> {seasons
                .filter(season => season.air_date)
                .reduce((latest, current) => {
                  const latestDate = new Date(latest.air_date);
                  const currentDate = new Date(current.air_date);
                  return currentDate > latestDate ? current : latest;
                }, seasons[0]).air_date}
            </p>
          </>
        )}
      </div>
    </div>
  )}
</div>

{/* Information Section */}
<div className="col-span-12 lg:col-span-4 bg-gray-800 p-4 rounded-lg border">
  <h2 className="text-xl font-bold mb-2 text-white">Information</h2>

  <p className="text-white">
    <strong>Status:</strong>
  </p>
  <p className="p-2 bg-white text-black rounded w-20">{series.status}</p>

  <p className="mt-4 text-white">
    <strong>Network:</strong>
  </p>
  <div className="p-2 bg-white text-black rounded w-40">
    {series.networks.map(network => network.name).join(", ")}
  </div>

  <p className="mt-4 text-white">
    <strong>Production Companies:</strong>
  </p>
  <div className="grid grid-cols-2 gap-2 mt-2">
    {series.production_companies
      .filter(company => company.logo_path)
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
    {series.production_countries.map(country => country.name).join(", ")}
  </div>

  <p className="mt-2 text-white">
    <strong>Spoken Languages:</strong>
  </p>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
    {series.spoken_languages.map((lang, index) => (
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

      {/* Related Series Section */}
      <div className="container mx-auto px-4 mt-8">
        <RelatedSeries seriesId={series.id} />
      </div>

      {/* ToastContainer */}
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
