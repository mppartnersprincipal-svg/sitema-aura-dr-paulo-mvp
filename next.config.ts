import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Há um package-lock.json solto em C:\Users\User; fixa a raiz no próprio projeto.
  turbopack: { root: __dirname },
};

export default nextConfig;
