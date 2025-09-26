import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  }, typescript: {
    ignoreBuildErrors: true,
  }


};

module.exports = nextConfig;

export default nextConfig;
