import React from 'react';
import ReactPlayer from 'react-player';

export default function VideoPlayer({ url, title }) {
  if (!url) {
    return <div>No valid video URL found.</div>;
  }

  return (
    <div className="video-player-container">
      <h2 className="text-3xl font-bold mb-4">Now Watching: {title}</h2>
      <div className="video-player-wrapper">
        <ReactPlayer
          url={url}
          controls
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}
