// app/callback/page.js
import { useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { auth } from '../firebase';

export default function Callback() {
  const router = useRouter();
  const { firebaseId, approved_request_token } = router.query;

  useEffect(() => {
    if (approved_request_token) {
      const createSession = async () => {
        try {
          const { data } = await axios.post(`https://api.themoviedb.org/3/authentication/session/new?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`, {
            request_token: approved_request_token
          });
          if (data.success) {
            localStorage.setItem('session_id', data.session_id);
            // Redirect to profile
            router.push('/profile');
          }
        } catch (error) {
          console.error('Failed to create session:', error);
        }
      };
      createSession();
    }
  }, [approved_request_token, router]);

  return <div>Loading...</div>;
}
