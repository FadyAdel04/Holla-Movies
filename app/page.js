"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import LandingPage from '../components/LandingPage';
import PopularActors from '../components/PopularActors';
import CustomArrow from '../components/CustomArrow';
import MovieGenreSection from '../components/MovieGenreSection';
import { useUser } from '@clerk/nextjs'; // Import useUser from Clerk
import { useRouter } from 'next/navigation';

const API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingSeries, setTrendingSeries] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularActors, setPopularActors] = useState([]);
  const router = useRouter();
  const { user } = useUser(); // Get user from Clerk

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingMoviesResponse = await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
        const trendingSeriesResponse = await axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}`);
        const topRated = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`);
        const actors = await axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`);

        setTrendingMovies(trendingMoviesResponse.data.results);
        setTrendingSeries(trendingSeriesResponse.data.results);
        setTopRatedMovies(topRated.data.results);
        setPopularActors(actors.data.results);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!user) {
      router.push('/sign-up'); // Redirect to sign-up if user is not authenticated
    }
  }, [user, router]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="right" />,
    prevArrow: <CustomArrow direction="left" />,
    responsive: [
      {
        breakpoint: 1280, 
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          arrows: false,
          centerMode: true,
          centerPadding: '20px',
        },
      },
    ],
  };

  return (
    <>
      <LandingPage />
      <div className="container px-4 mx-auto space-y-12">
        {/* Movie Genre Section */}
        <section className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Browse by Genre</h2>
          <MovieGenreSection />
        </section>

        {/* Trending Movies */}
        <section className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Trending Movies</h2>
          <Slider {...sliderSettings} className="relative">
            {trendingMovies.map((movie) => (
              <div className="p-2" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </section>

        {/* Trending Series */}
        <section className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Trending Series</h2>
          <Slider {...sliderSettings} className="relative">
            {trendingSeries.map((series) => (
              <div className="p-2" key={series.id}>
                <SeriesCard series={series} />
              </div>
            ))}
          </Slider>
        </section>

        {/* Top Rated Movies */}
        <section className="mt-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Top Rated Movies</h2>
          <Slider {...sliderSettings} className="relative">
            {topRatedMovies.map((movie) => (
              <div className="p-2" key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </Slider>
        </section>

        {/* Popular Actors */}
        <section className="mt-8">
          <PopularActors actors={popularActors} />
        </section>
      </div>

      {/* Toast Container */}
      <ToastContainer
        theme="dark"
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
