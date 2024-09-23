"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import SeriesSlider from "./SeriesSlider"; // Import SeriesSlider component

export default function RelatedSeries({ seriesId }) {
  const [relatedSeries, setRelatedSeries] = useState([]);

  useEffect(() => {
    async function fetchRelatedSeries() {
      const API_KEY = "9f36ddb9ac01ad234be50dc7429b040b";
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${seriesId}/recommendations?api_key=${API_KEY}`
      );
      setRelatedSeries(response.data.results);
    }

    fetchRelatedSeries();
  }, [seriesId]);

  if (relatedSeries.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Related Series</h2>
      {/* Use SeriesSlider to display related series */}
      <SeriesSlider series={relatedSeries} />
    </div>
  );
}
