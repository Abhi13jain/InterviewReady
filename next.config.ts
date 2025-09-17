import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      root: './', // or relative path to your project root
    },
  },
};

module.exports = nextConfig;

export default nextConfig;
