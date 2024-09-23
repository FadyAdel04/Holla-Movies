import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilm, FaTheaterMasks, FaHeart, FaChild, FaLaugh, FaFistRaised, FaUserFriends, FaTv } from 'react-icons/fa';
import CustomArrow from './CustomArrow';
import Slider from 'react-slick';
import MovieCard from './MovieCard';
import SeriesCard from './SeriesCard'; // Import the SeriesCard component
import { motion, AnimatePresence } from 'framer-motion';

// MovieGenreSection component
export default function MovieGenreSection() {
  const [selectedGenre, setSelectedGenre] = useState(28); // Default genre ID for "Action"
  const [selectedCategory, setSelectedCategory] = useState('movie'); // State for selected category
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]); // State for series
  const [genres, setGenres] = useState([]);
  const [seriesGenres, setSeriesGenres] = useState([]); // State for series genres
  const [loading, setLoading] = useState(false); // Add loading state

  const API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';

  // Fetch genres for movies
  useEffect(() => {
    async function fetchGenres() {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
      setGenres(response.data.genres);
    }

    fetchGenres();
  }, []);

  // Fetch genres for series
  useEffect(() => {
    async function fetchSeriesGenres() {
      const response = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`);
      setSeriesGenres(response.data.genres);
    }

    fetchSeriesGenres();
  }, []);

  // Fetch movies or series based on selected genre and category
  useEffect(() => {
    async function fetchContent() {
      setLoading(true); // Set loading to true before fetching
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/${selectedCategory}?api_key=${API_KEY}&with_genres=${selectedGenre}`
      );

      if (selectedCategory === 'movie') {
        setMovies(response.data.results);
      } else {
        setSeries(response.data.results);
      }
      setLoading(false); // Set loading to false after fetching
    }

    fetchContent();
  }, [selectedGenre, selectedCategory]);

  // Mapping icons to genre names
  const genreIcons = {
    action: FaFistRaised,
    comedy: FaLaugh,
    drama: FaTheaterMasks,
    family: FaChild,
    fantasy: FaUserFriends,
    documentary: FaFilm,
    romance: FaHeart,
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of visible slides
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-6 sm:space-y-0">
      {/* Content Section (Left) */}
      <div className="w-full sm:w-2/3 lg:w-3/4 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Movies or Series Slider */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                {selectedCategory === 'movie' ? 'Movies' : 'Series'}
              </h3>
              <AnimatePresence>
                {selectedCategory === 'movie' ? (
                  movies.length > 0 ? (
                    <Slider {...settings}>
                      {movies.map((movie) => (
                        <div key={movie.id} className="p-2">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <MovieCard movie={movie} />
                          </motion.div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <p className="text-white text-center">No movies found</p>
                  )
                ) : (
                  series.length > 0 ? (
                    <Slider {...settings}>
                      {series.map((serie) => (
                        <div key={serie.id} className="p-2">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <SeriesCard series={serie} />
                          </motion.div>
                        </div>
                      ))}
                    </Slider>
                  ) : (
                    <p className="text-white text-center">No series found</p>
                  )
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Genre Selector Section (Right) */}
      <div className="w-full sm:w-1/3 lg:w-1/4 p-4 bg-gray-900 rounded-md">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Categories</h3>
        <div className="flex flex-col mb-4">
          <button
            onClick={() => setSelectedCategory('movie')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors text-center 
            ${selectedCategory === 'movie' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'}`}
          >
            <FaFilm className="text-xl mr-2" />
            <span>Movies</span>
          </button>
          <button
            onClick={() => setSelectedCategory('tv')}
            className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors text-center 
            ${selectedCategory === 'tv' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'}`}
          >
            <FaTv className="text-xl mr-2" />
            <span>Series</span>
          </button>
        </div>
        {selectedCategory === 'movie' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {genres.map((genre) => {
              const Icon = genreIcons[genre.name.toLowerCase()] || FaFilm;
              const isSelected = selectedGenre === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors text-center 
                  ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'}`}
                >
                  <Icon className="text-xl mr-2" />
                  <span>{genre.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {seriesGenres.map((genre) => {
              const Icon = genreIcons[genre.name.toLowerCase()] || FaFilm;
              const isSelected = selectedGenre === genre.id;
              return (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors text-center 
                  ${isSelected ? 'bg-red-600 text-white' : 'bg-gray-800 text-white hover:bg-gray-600'}`}
                >
                  <Icon className="text-xl mr-2" />
                  <span>{genre.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
