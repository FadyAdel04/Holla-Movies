// components/SearchBar.js
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w92';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) {
        let response;
        if (searchType === 'movie') {
          response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        } else if (searchType === 'actor') {
          response = await axios.get(`https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&query=${query}`);
        } else if (searchType === 'series') {
          response = await axios.get(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`);
        }
        setSuggestions(response.data.results.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, searchType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, searchType);
  };

  const handleSuggestionClick = (id) => {
    setSuggestions([]);
    router.push(`/${searchType === 'movie' ? 'movie' : searchType === 'series' ? 'series' : 'actor'}/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        Math.min(prevIndex + 1, suggestions.length - 1)
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        Math.max(prevIndex - 1, 0)
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSuggestionClick(suggestions[highlightedIndex].id);
      }
    }
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  return (
    <div className="relative w-full">
  <form onSubmit={handleSubmit} className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
      className="bg-gray-700 text-white px-4 py-2 rounded w-full sm:w-auto"
      placeholder="Movies, Series, or Actors..."
    />
    <select
      value={searchType}
      onChange={(e) => setSearchType(e.target.value)}
      className="bg-gray-700 text-white px-4 py-2 rounded w-full sm:w-auto"
    >
      <option value="movie">Movies</option>
      <option value="series">Series</option>
      <option value="actor">Actors</option>
    </select>
    <button type="submit" className="bg-netflixRed px-4 py-2 rounded text-white w-full sm:w-auto">
      Search
    </button>
  </form>

  {suggestions.length > 0 && (
    <ul
      className="absolute top-full z-50 left-0 w-full bg-gray-800 text-white mt-2 rounded shadow-lg sm:max-w-md"
      ref={suggestionsRef}
    >
      {suggestions.map((item, index) => (
        <li
          key={item.id}
          className={`p-2 hover:bg-gray-700 flex items-center space-x-4 cursor-pointer ${highlightedIndex === index ? 'bg-gray-700' : ''}`}
          onClick={() => handleSuggestionClick(item.id)}
          onMouseEnter={() => setHighlightedIndex(index)}
        >
          <img
            src={
              item.poster_path
                ? `${IMAGE_BASE_URL}${item.poster_path}`
                : item.profile_path
                ? `${IMAGE_BASE_URL}${item.profile_path}`
                : '/no-image.png'
            }
            alt={searchType === 'movie' || searchType === 'series' ? item.title || item.name : item.name}
            className="w-12 h-auto rounded"
          />
          <span className="text-white text-sm sm:text-base">
            {searchType === 'movie' || searchType === 'series' ? item.title || item.name : item.name}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>
  );
}
