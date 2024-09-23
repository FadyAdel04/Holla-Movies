// components/RelatedMovies.js
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import MovieSlider from "./MovieSlider"; // Import MovieSlider component

export default function RelatedMovies({ movieId }) {
  const [relatedMovies, setRelatedMovies] = useState([]);

  useEffect(() => {
    async function fetchRelatedMovies() {
      const API_KEY = "9f36ddb9ac01ad234be50dc7429b040b";
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${API_KEY}`
      );
      setRelatedMovies(response.data.results);
    }

    fetchRelatedMovies();
  }, [movieId]);

  if (relatedMovies.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Movies</h2>
      {/* Use MovieSlider to display related movies */}
      <MovieSlider movies={relatedMovies} />
    </div>
  );
}
