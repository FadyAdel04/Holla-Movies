import axios from 'axios';
import ActorMovies from '../../../components/ActorMovies'; // Import the ActorMovies component

export default async function ActorDetails({ params }) {
  const API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';

  // Fetch actor, movie, and series data from the API
  const actorResponse = await axios.get(`https://api.themoviedb.org/3/person/${params.id}?api_key=${API_KEY}`);
  const moviesResponse = await axios.get(`https://api.themoviedb.org/3/person/${params.id}/movie_credits?api_key=${API_KEY}`);
  const seriesResponse = await axios.get(`https://api.themoviedb.org/3/person/${params.id}/tv_credits?api_key=${API_KEY}`);

  const actor = actorResponse.data;
  const movies = moviesResponse.data.cast.map(movie => ({ ...movie, media_type: 'movie' }));
  const series = seriesResponse.data.cast.map(tv => ({ ...tv, media_type: 'series' }));

  const imageUrl = actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : '/fallback-image.png'; // Fallback image

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 text-white">
      {/* Main layout: Two columns for actor details and bio */}
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Left Section: Actor Image and Basic Information */}
        <div className="lg:w-1/3 space-y-4">
          {/* Actor image */}
          <img
            src={imageUrl}
            alt={`${actor.name} profile`}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />

          {/* Actor details */}
          <div className="space-y-2 text-lg">
            <div className="font-bold">
              <span className="text-gray-400">Birthday:</span> {actor.birthday || 'N/A'}{' '}
              {actor.birthday ? `(${new Date().getFullYear() - new Date(actor.birthday).getFullYear()} years old)` : ''}
            </div>
            <div className="font-bold">
              <span className="text-gray-400">Place of Birth:</span> {actor.place_of_birth || 'N/A'}
            </div>
            <div className="font-bold">
              <span className="text-gray-400">Known For:</span> {actor.known_for_department || 'N/A'}
            </div>
            <div className="font-bold">
              <span className="text-gray-400">Popularity:</span> {actor.popularity || 'N/A'}
            </div>
            <div>
              <a href={`https://www.imdb.com/name/${actor.imdb_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 no-underline">
                <span className="font-bold text-lg text-gray-400">IMDb:</span> {/* IMDb text */}
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/69/IMDB_Logo_2016.svg" alt="IMDb" className="w-8 h-8" /> {/* IMDb logo */}
              </a>
            </div>
          </div>
        </div>

        {/* Right Section: Name, Biography, and Known For */}
        <div className="lg:w-2/3 space-y-8">
          {/* Actor name and bio */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold mb-2">Biography</h2>
              <p className="text-gray-400 leading-relaxed">
                {actor.biography || 'No biography available.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actor Movies and Series section */}
      <ActorMovies movies={movies} series={series} />
    </div>
  );
}
