"use client"
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Trailer({ movieId, type = 'movie' }) {
  const [youtubeTrailer, setYoutubeTrailer] = useState(null);
  const [error, setError] = useState(null);

  const API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${type}/${movieId}/videos?api_key=${API_KEY}`
        );

        // Filter the YouTube trailers
        const youtubeTrailers = response.data.results.filter(
          (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );

        // Set the first trailer if available
        if (youtubeTrailers.length > 0) {
          setYoutubeTrailer(youtubeTrailers[0]);
        } else {
          setError('No trailers available.');
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
        setError('Failed to load trailer.');
      }
    };

    fetchTrailer();
  }, [movieId, type]);

  return (
    <div>
      {youtubeTrailer ? (
        <iframe
          width="100%"
          height="450"
          src={`https://www.youtube.com/embed/${youtubeTrailer.key}`}
          frameBorder="0"
          allowFullScreen
          title="Trailer"
        ></iframe>
      ) : (
        <p>{error || 'No trailer available.'}</p>
      )}
    </div>
  );
}
