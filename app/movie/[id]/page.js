import MovieDetailsServer from '../../../components/MovieDetailsServer';

export default function MoviePage({ params }) {
  console.log("Movie ID:", params.id);  // Log the movie ID for debugging
  return (
    <div>
      {/* Server-side component that fetches movie details */}
      <MovieDetailsServer params={params} />
    </div>
  );
}
