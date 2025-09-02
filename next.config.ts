/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during production build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
