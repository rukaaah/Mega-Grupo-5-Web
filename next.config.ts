import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
};
module.exports = {
  experimental: {
    serverComponentsExternalPackages: ['pg'], // Se estiver usando PostgreSQL
  },
  // Garante compatibilidade com async/await
  webpack: (config: any) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    return config
  }
}

export default nextConfig;
