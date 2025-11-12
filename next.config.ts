/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'znvxcgcdigtbpoahydxd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Redirect www to non-www
  async redirects() {
    return [
      {
        source: '/:path((?!www\\.).*)',
        has: [{ type: 'host', value: 'www.veyra.co.in' }],
        destination: 'https://veyra.co.in/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
