import axios from "axios";
import SeasonDetailsClient from "../../../../../components/SeasonDetailsClient"; 

// Store the API key in an environment variable for security
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; 

export async function generateMetadata({ params }) {
  const { id, seasonNumber } = params;
  return {
    title: `Season ${seasonNumber} Details | Series ${id}`,
  };
}

export default async function SeasonDetailsPage({ params }) {
  const { id, seasonNumber } = params;

  try {
    // Fetch season details, episodes, credits, translations, videos, and watch providers
    const seasonResponse = await axios.get(
      `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&append_to_response=credits,translations,videos,watch/providers,episodes`
    );

    const seasonData = seasonResponse.data;
    const episodes = seasonData.episodes || [];  // Handle episodes data
    const credits = seasonData.credits || {};    // Handle credits data
    const translations = seasonData.translations || {};  // Handle translations data
    const videos = seasonData.videos || {};      // Handle videos data
    const watchProviders = seasonData["watch/providers"] || {};  // Handle watch providers data

    return (
      <SeasonDetailsClient
        season={seasonData}
        episodes={episodes}
        credits={credits}
        translations={translations}
        videos={videos}
        watchProviders={watchProviders}
      />
    );
  } catch (error) {
    console.error("Error fetching season details:", error);

    // Render an error message or custom error component
    return <p>Error loading season details. Please try again later.</p>;
  }
}
