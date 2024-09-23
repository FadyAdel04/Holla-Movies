"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function ActorCard({ actor }) {
  const router = useRouter();

  const { id, name, profile_path, job, character } = actor;

  const handleClick = () => {
    router.push(`/actor/${id}`);
  };

  if (!profile_path) return null; // Ensure the card is not rendered if there is no image

  return (
    <motion.div 
      className="movie-card bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
      whileHover={{ scale: 1.1 }}
      onClick={handleClick}
    >
      <img 
        src={`https://image.tmdb.org/t/p/w500/${profile_path}`} 
        alt={name} 
        className="rounded-t-lg object-cover w-full h-64"
      />
      <div className="p-4">
        <h3 className="text-center text-lg text-white whitespace-nowrap overflow-hidden text-ellipsis">{name}</h3>
        {character && (
          <p className="mt-2 text-center text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
            {character} {/* Display the role/character if available */}
          </p>
        )}
        {job && (
          <p className="mt-2 text-center text-sm text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
            {job} {/* Display the job if available */}
          </p>
        )}
      </div>
    </motion.div>
  );
}
