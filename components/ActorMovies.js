'use client';
import Link from 'next/link'; // Assuming you're using Next.js for navigation

export default function ActorMovies({ movies }) {
  // Sort movies and series by release date, newest first
  const sortedMovies = [...movies].sort((a, b) => {
    const dateA = new Date(a.release_date || a.first_air_date).getTime();
    const dateB = new Date(b.release_date || b.first_air_date).getTime();
    return dateB - dateA; // Sort in descending order (newest first)
  });

  return (
    <section className="px-4 py-6 md:px-8 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">All Movies and Series</h2>

      {/* Container with vertical scroll for movies/series list */}
      <div className="overflow-y-auto max-h-[600px]"> {/* Set a maximum height and enable vertical scrolling */}
        <table className="min-w-full bg-gray-800 text-white rounded">
          <tbody>
          {sortedMovies.map((item, index) => {
            // Determine if the item is a movie or TV show
            const isTVShow = item.episode_count !== undefined;
        
            return (
              <tr
                key={item.id}
                className={`border-b border-gray-700 even:bg-slate-800 odd:bg-gray-900 ${
                  isTVShow ? 'whitespace-nowrap' : ''
                }`} // Ensures TV shows are in one line
              >
                {/* Row Number */}
                <td className="px-4 py-2">{index + 1}</td>
        
                {/* Movie or Series Title with Link */}
                <td className="px-4 py-2">
                  <Link
                    href={isTVShow ? `/series/${item.id}` : `/movie/${item.id}`}
                    className="no-underline text-white text-bold hover:text-red-500"
                  >
                    <div className="flex items-center space-x-2">
                      {item.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="hover:text-red-500">{item.title || item.name}</span>
                    </div>
                  </Link>
                </td>
        
                {/* Role */}
                <td className="px-4 py-2">{item.character || 'N/A'}</td>
        
                {/* Movie or TV Series */}
                <td className="px-4 py-2">{isTVShow ? 'TV Show' : 'Movie'}</td>
        
                {/* Original Language */}
                <td className="px-4 py-2">{item.original_language?.toUpperCase() || 'N/A'}</td>
        
                {/* Release Year */}
                <td className="px-4 py-2">{(item.release_date || item.first_air_date || '').slice(0, 4)}</td>
        
                {/* Rating */}
                <td className="px-4 py-2">
                  <span className="flex items-center">
                    <span className="mr-1">
                      {item.vote_average ? item.vote_average.toFixed(1) : '0.0'}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927a1 1 0 011.902 0l1.173 3.621h3.798a1 1 0 01.593 1.805l-3.072 2.23 1.173 3.62a1 1 0 01-1.538 1.109l-3.072-2.23-3.072 2.23a1 1 0 01-1.538-1.109l1.173-3.62-3.072-2.23a1 1 0 01.593-1.805h3.798l1.173-3.62z" />
                    </svg>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </section>
  );
}
