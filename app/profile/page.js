"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, clerkClient } from "@clerk/nextjs"; // Import clerkClient
import axios from "axios";
import MovieSlider from "../../components/MovieSlider";
import SeriesSlider from "../../components/SeriesSlider";
import MovieCard from "../../components/MovieCard";
import SeriesCard from "../../components/SeriesCard";
import { toast, ToastContainer } from "react-toastify";
import Image from "next/image";
import backgroundImage from "../../assets/3.jpg"; // Adjust the path as necessary
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user, isLoaded, isSignedIn } = useUser(); // Clerk user hook
  const [profile, setProfile] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [favoriteSeries, setFavoriteSeries] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistSeries, setWatchlistSeries] = useState([]);
  const [activeTab, setActiveTab] = useState("Watchlist");
  const [username, setUsername] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState("/assets/user.png"); // Default image path
  const [memberSince, setMemberSince] = useState(null); // Store the member since date
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfilePic = localStorage.getItem("profilePicUrl");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedProfilePic) {
      setProfilePicUrl(storedProfilePic);
    }

    if (user) {
      // Set the profile pic URL to default if not set
      setProfilePicUrl(storedProfilePic || user.profileImageUrl || "/assets/user.png");
      // Format the "Member Since" date
      const createdAtDate = new Date(user.createdAt);
      setMemberSince(createdAtDate.toLocaleDateString());
    }
  }, [isSignedIn, user, router]);

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

      // Create a URL for the newly selected image to preview it
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setProfilePicUrl(imageUrl); // Immediately show the selected image
    }
  };

  // Handle profile update (username and profile picture)
  const handleProfileUpdate = async () => {
    try {
      if (!isLoaded || !isSignedIn) {
        toast.error("User is not signed in.");
        return;
      }

      // Save the username and profile picture URL in local storage
      localStorage.setItem("username", username);
      localStorage.setItem("profilePicUrl", profilePicUrl);

      // Notify user of successful update
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
        {/* Background Image */}
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
            {isSignedIn && user ? (
              <>
                <img
                  src={profilePicUrl}
                  alt={user.emailAddresses[0].emailAddress}
                  className="rounded-full shadow-lg object-cover h-24 w-24 lg:h-32 lg:w-32"
                />
                <div className="lg:w-2/3">
                  <h1 className="text-4xl font-bold text-white">{username || user.emailAddresses[0].emailAddress}</h1>
                  <p className="text-lg text-white">
                    <strong>Email:</strong> {user.emailAddresses[0].emailAddress}
                  </p>
                  <p className="text-lg text-white">
                    <strong>User ID:</strong> {user.id}
                  </p>
                  <p className="text-lg text-white">
                    <strong>Member Since:</strong> {memberSince}
                  </p>
                </div>
              </>
            ) : (
              <h1 className="text-4xl font-bold text-white">Welcome, Guest!</h1>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-4">
        <div className="flex justify-around mb-4 border bg-gray-800 rounded p-2 border-gray-700">
          {["Watchlist", "Favorites", "Edit Profile"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 rounded-md ${activeTab === tab ? "bg-red-500" : "bg-gray-600 hover:bg-gray-700"}`}
              onClick={() => setActiveTab(tab)}
              disabled={activeTab === tab}
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
              renderEmptyState("movies")
            )}
            <h2 className="text-2xl font-bold text-white mb-4">Watchlist Series</h2>
            {watchlistSeries.length > 0 ? (
              watchlistSeries.length >= 6 ? (
                <SeriesSlider series={watchlistSeries} />
              ) : (
                renderSeriesCards(watchlistSeries)
              )
            ) : (
              renderEmptyState("series")
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
              renderEmptyState("movies")
            )}
            <h2 className="text-2xl font-bold text-white mb-4">Favorite Series</h2>
            {favoriteSeries.length > 0 ? (
              favoriteSeries.length >= 6 ? (
                <SeriesSlider series={favoriteSeries} />
              ) : (
                renderSeriesCards(favoriteSeries)
              )
            ) : (
              renderEmptyState("series")
            )}
          </>
        )}

        {activeTab === "Edit Profile" && (
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-white mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded w-full"
                placeholder="Enter new username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="bg-gray-700 text-white px-3 py-2 rounded w-full"
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
      <ToastContainer />
    </div>
  );
}
