import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => [
    // Root will be used for a possible landing page
    { source: "/", destination: "/game", permanent: true },
  ],
};

export default nextConfig;
