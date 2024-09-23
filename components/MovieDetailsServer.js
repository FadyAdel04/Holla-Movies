import axios from 'axios';
import MovieDetailsClient from './MovieDetailsClient'; // Client-side component

export default async function MovieDetailsServer({ params }) {
  const MOVIE_DB_API_KEY = '9f36ddb9ac01ad234be50dc7429b040b'; // Replace with your TMDB API key

  try {
    // Fetch movie details from TMDB
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}?api_key=${MOVIE_DB_API_KEY}`
    );
    const movie = movieResponse.data;

    if (!movie) {
      console.error('Movie data is missing');
      return <div>Error: Movie details not found.</div>;
    }

    // Fetch movie credits (cast) from TMDB
    const creditsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}/credits?api_key=${MOVIE_DB_API_KEY}`
    );
    const credits = creditsResponse.data;

    // Fetch movie reviews from TMDB
    const reviewsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}/reviews?api_key=${MOVIE_DB_API_KEY}`
    );
    const reviews = reviewsResponse.data.results;

    // Add this after fetching movie details
    const externalIdsResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}/external_ids?api_key=${MOVIE_DB_API_KEY}`
    );
    const externalIds = externalIdsResponse.data;

    // Fetch production company details
    const productionCompaniesPromises = movie.production_companies.map(company =>
      axios.get(`https://api.themoviedb.org/3/company/${company.id}?api_key=${MOVIE_DB_API_KEY}`)
    );
    const productionCompaniesResponses = await Promise.all(productionCompaniesPromises);
    const productionCompanies = productionCompaniesResponses.map(response => response.data);

    // Pass the movie, credits, reviews, and production company details to the client-side component
    return (
      <MovieDetailsClient
        movie={movie}
        credits={credits}
        reviews={reviews}
        productionCompanies={productionCompanies}
        externalIds={externalIds}
      />
    );
  } catch (error) {
    console.error('Error fetching movie details or reviews:', error);
    return <div>Error fetching movie details.</div>;
  }
}
