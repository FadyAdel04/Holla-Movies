/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
      return [
        {
          source: '/login',
          destination: '/sign-in',
          permanent: true,
        },
        {
          source: '/register',
          destination: '/sign-up',
          permanent: true,
        },
      ];
    },
  };
  
  export default nextConfig;
  