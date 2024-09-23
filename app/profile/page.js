"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase";
import axios from "axios";
import MovieSlider from "../../components/MovieSlider";
import SeriesSlider from "../../components/SeriesSlider";
import MovieCard from "../../components/MovieCard";
import SeriesCard from "../../components/SeriesCard";
import { toast, ToastContainer } from "react-toastify";
import { Parallax } from "react-parallax";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase imports for image upload
import { updateProfile } from "firebase/auth";
import { storage } from "../firebase"; // Firebase storage instance
import Image from 'next/image'; // If you're using Next.js for image optimization
import backgroundImage from '../../assets/3.jpg'; // Adjust the path as necessary

export default function Profile() {
  const [user, setUser] = useState(null);
  const [tmdbSessionId, setTmdbSessionId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [activeTab, setActiveTab] = useState("Watchlist");
  const [username, setUsername] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null); // Store the profile picture URL
  const router = useRouter();

  useEffect(() => {
    // Fetch the Firebase authenticated user data
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUsername(firebaseUser.displayName || "");
        setProfilePicUrl(firebaseUser.photoURL || "../../assets/user.png"); // Set default image if no profile pic
      } else {
        router.push("/sign-in");
      }
    });
    setTmdbSessionId(localStorage.getItem("session_id"));
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://api.themoviedb.org/3/account", {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    const fetchFavoritesAndWatchlist = async () => {
      if (profile) {
        try {
          const [favMoviesRes, favSeriesRes, watchMoviesRes, watchSeriesRes] = await Promise.all([
            axios.get(`https://api.themoviedb.org/3/account/${profile.id}/favorite/movies`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
            axios.get(`https://api.themoviedb.org/3/account/${profile.id}/favorite/tv`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
            axios.get(`https://api.themoviedb.org/3/account/${profile.id}/watchlist/movies`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
            axios.get(`https://api.themoviedb.org/3/account/${profile.id}/watchlist/tv`, {
              headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}` },
            }),
          ]);

          setFavoriteMovies(favMoviesRes.data.results);
          setFavoriteSeries(favSeriesRes.data.results);
          setWatchlistMovies(watchMoviesRes.data.results);
          setWatchlistSeries(watchSeriesRes.data.results);
        } catch (error) {
          console.error("Error fetching favorites or watchlist:", error);
        }
      }
    };

    fetchProfile();
    fetchFavoritesAndWatchlist();
  }, [profile]);

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  // Handle profile update (username and profile picture)
  const handleProfileUpdate = async () => {
    try {
      let profilePicUrlUpdated = profilePicUrl;
  
      // If the user uploaded a new profile picture, upload it to Firebase storage
      if (newProfilePic) {
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
  
        // Upload the file and get its download URL
        const snapshot = await uploadBytes(storageRef, newProfilePic);
  
        // Ensure we can retrieve the download URL of the uploaded file
        profilePicUrlUpdated = await getDownloadURL(snapshot.ref);
        setProfilePicUrl(profilePicUrlUpdated); // Update the state with the new profile pic URL
      }
  
      // Update the user's profile in Firebase Auth
      await updateProfile(user, {
        displayName: username,
        photoURL: profilePicUrlUpdated,
      });
  
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
    }
  };

  const renderMovieCards = (movies) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );

  const renderSeriesCards = (series) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {series.map((series) => (
        <SeriesCard key={series.id} series={series} />
      ))}
    </div>
  );

  const renderEmptyState = (type) => (
    <div className="text-center">
      <p className="text-lg text-gray-300 mb-4">No {type} found.</p>
      <button
        onClick={() => router.push("/")}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Add some...
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
    <section className="relative bg-cover bg-center w-full min-h-[45vh]">
    {/* Background Image */}0
    <Image
      className="absolute inset-0 h-full w-full object-cover"
      src={backgroundImage}
      alt="Background Image"
      layout="fill"
      priority // Ensures the image loads quickly
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black opacity-40"></div>

    {/* Content */}
    <div className="relative z-10 w-full max-w-6xl mx-auto py-12">
      <div className="flex flex-col lg:flex-row lg:space-x-8 items-center">
        {user && (
          <>
            <img
              src={profilePicUrl}
              alt={user.email}
              className="rounded-full shadow-lg object-cover h-24 w-24 lg:h-32 lg:w-32"
            />
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold text-white">{username || user.email}</h1>
              <p className="text-lg text-white">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-lg text-white">
                <strong>User ID:</strong> {user.uid}
              </p>
            </div>
          </>
        )}
        {tmdbSessionId && (
          <div>
            <p className="text-lg text-white">
              <strong>TMDB Session ID:</strong> {tmdbSessionId}
            </p>
          </div>
        )}
      </div>
    </div>
  </section>

      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-around mb-4 border bg-gray-800 rounded p-2 border-gray-700">
          {["Watchlist", "Favorites", "Edit Profile"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded-md ${
                activeTab === tab ? "bg-red-500" : "bg-gray-600 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Watchlist" && (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Watchlist Movies</h2>
            {watchlistMovies.length > 0 ? (
              watchlistMovies.length >= 6 ? (
                <MovieSlider movies={watchlistMovies} />
              ) : (
                renderMovieCards(watchlistMovies)
              )
            ) : (
              renderEmptyState("watchlist movies")
            )}

            <h2 className="text-2xl font-bold text-white mb-4">Watchlist Series</h2>
            {watchlistSeries.length > 0 ? (
              watchlistSeries.length >= 6 ? (
                <SeriesSlider series={watchlistSeries} />
              ) : (
                renderSeriesCards(watchlistSeries)
              )
            ) : (
              renderEmptyState("watchlist series")
            )}
          </>
        )}

        {activeTab === "Favorites" && (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Favorite Movies</h2>
            {favoriteMovies.length > 0 ? (
              favoriteMovies.length >= 6 ? (
                <MovieSlider movies={favoriteMovies} />
              ) : (
                renderMovieCards(favoriteMovies)
              )
            ) : (
              renderEmptyState("favorite movies")
            )}

            <h2 className="text-2xl font-bold text-white mb-4">Favorite Series</h2>
            {favoriteSeries.length > 0 ? (
              favoriteSeries.length >= 6 ? (
                <SeriesSlider series={favoriteSeries} />
              ) : (
                renderSeriesCards(favoriteSeries)
              )
            ) : (
              renderEmptyState("favorite series")
            )}
          </>
        )}

        {activeTab === "Edit Profile" && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-2 block w-full bg-gray-700 border-gray-600 text-white rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profilePic" className="block text-sm font-medium text-gray-300">
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePic"
                onChange={handleProfilePicChange}
                className="mt-1 block w-full text-gray-400"
              />
            </div>

            <button
              onClick={handleProfileUpdate}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Update Profile
            </button>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}
