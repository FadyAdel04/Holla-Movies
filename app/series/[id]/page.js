import axios from "axios";
import SeriesDetailsClient from "../../../components/SeriesDetailsClient";

const TMDB_API_KEY = '9f36ddb9ac01ad234be50dc7429b040b';

export async function generateMetadata({ params }) {
  return {
    title: `Series Details | ${params.id}`,
  };
}

export default async function SeriesDetailsPage({ params }) {
  const { id } = params;

  try {
    // Fetch series details
    const seriesResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=external_ids`);

    // Fetch credits (cast and crew)
    const creditsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${TMDB_API_KEY}`);

    // Fetch seasons
    const seasonsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${TMDB_API_KEY}&append_to_response=seasons`);

    // Fetch videos (e.g., trailers)
    const videosResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${TMDB_API_KEY}`);

    // Fetch reviews
    const reviewsResponse = await axios.get(`https://api.themoviedb.org/3/tv/${id}/reviews?api_key=${TMDB_API_KEY}`);
    
    // Render SeriesDetailsClient component with the fetched data
    return (
      <SeriesDetailsClient
        series={seriesResponse.data}
        credits={creditsResponse.data} // Pass credits (cast & crew) here
        seasons={seasonsResponse.data.seasons} // Pass seasons
        videos={videosResponse.data.results} // Pass video data
        reviews={reviewsResponse.data.results} // Pass reviews
        externalIds={seriesResponse.data.external_ids} // Pass external IDs
      />
    );
  } catch (error) {
    console.error("Error fetching series details:", error);
    return <p>Error loading series details. Please try again later.</p>;
  }
}
