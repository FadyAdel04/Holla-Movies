"use client";

import React, { useRef, useState } from "react";
import { Parallax } from "react-parallax";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

export default function SeasonDetailsClient({ season, episodes, credits, videos, watchProviders }) {
  const episodePlayerRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(videos?.results?.[0] || null);

  const userRating = season.vote_average * 10;

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    episodePlayerRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="text-white">
      {/* Backdrop and Poster Section */}
      <Parallax
        bgImage={`https://image.tmdb.org/t/p/w1280${season.poster_path || season.backdrop_path}`}
        strength={300}
      >
        <div className="relative bg-cover bg-center w-full min-h-75vh">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <div className="relative z-10 w-full max-w-6xl mx-auto py-12 flex flex-col lg:flex-row lg:space-x-8">
            <img
              src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
              alt={season.name}
              className="rounded-lg shadow-lg object-cover w-full lg:w-1/3"
            />
            <div className="lg:w-2/3 mt-4 lg:mt-0">
              <h1 className="text-3xl md:text-4xl font-bold">{season.name || `Season ${season.season_number}`}</h1>
              <p className="text-lg mt-2">{season.overview || "No overview available."}</p>
              <p className="text-sm text-gray-400 mt-2">
                Air Date: {new Date(season.air_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-gray-400">Episodes: {episodes.length}</p>

              <div className="mt-4">
                <h3 className="font-semibold">User Rating</h3>
                <div style={{ width: 60, height: 60 }}>
                  <CircularProgressbar
                    value={userRating}
                    text={`${userRating}%`}
                    styles={buildStyles({
                      textColor: "white",
                      pathColor: "red",
                      trailColor: "gray",
                    })}
                  />
                </div>
              </div>

              <div className="flex flex-col mt-4">
                <div>
                  <h3 className="font-semibold">Created by</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {credits.crew.filter((member) => member.job === 'Creator' || member.department === 'Writing').map((creator, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {creator.profile_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w45${creator.profile_path}`}
                            alt={creator.name}
                            className="w-15 h-15 rounded-full"
                          />
                        )}
                        <p className="text-sm text-gray-300">{creator.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold">Composed by</h3>
                  <div className="flex items-center space-x-2">
                    {credits.crew.find((member) => member.job === 'Original Music Composer')?.profile_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w45${credits.crew.find((member) => member.job === 'Original Music Composer').profile_path}`}
                        alt="Composer"
                        className="w-15 h-15 rounded-full"
                      />
                    )}
                    <p className="text-sm text-gray-300">
                      {credits.crew.find((member) => member.job === 'Original Music Composer')?.name || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Parallax>

      {/* Videos Section */}
      {videos && videos.results?.length > 0 ? (
        <div className="container px-4">
          <h2 className="text-2xl font-bold mb-4 mt-8">Top Season Videos</h2>
          <p className="text-lg text-center mt-4">{selectedVideo?.name}</p>
          <div ref={episodePlayerRef} className="mb-4">
            {selectedVideo ? (
              <iframe
                width="100%"
                height="500"
                src={`https://www.youtube.com/embed/${selectedVideo.key}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.name}
                className="rounded-lg shadow-lg w-full"
              ></iframe>
            ) : (
              <p>No video selected.</p>
            )}
          </div>

          <div className="overflow-x-auto whitespace-nowrap py-4">
            {videos.results.map((video) => (
              <div
                key={video.id}
                className="inline-block cursor-pointer flex-shrink-0 mx-2"
                onClick={() => handleVideoClick(video)}
              >
                <img
                  src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                  alt={video.name}
                  className="rounded-lg shadow-lg w-60 h-40 object-cover"
                />
                <p className="mt-2 text-center text-sm text-white w-60 whitespace-nowrap overflow-hidden text-ellipsis">
                  {video.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-8">No videos available for this season.</p>
      )}

      {/* Episodes Section */}
      {episodes && episodes.length > 0 && (
        <div className="container px-4 mt-10">
          <h2 className="text-2xl font-bold mb-4">Episodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {episodes.map((episode) => (
              <div
                key={episode.id}
                className="flex space-x-4 p-4 bg-gray-800 rounded-lg shadow-lg"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  className="w-48 h-28 object-cover rounded-lg"
                />
                <div className="flex flex-col justify-between w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">{episode.name}</h3>
                    <span className="text-red-500 text-2xl font-bold">{episode.episode_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">⭐ {episode.vote_average}</span>
                    <span className="text-gray-400">
                      {new Date(episode.air_date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-gray-400">{episode.runtime} min</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{episode.overview}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
