import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Ativa source maps de produção apenas durante análise de bundle
  productionBrowserSourceMaps: process.env.ANALYZE === "true",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: '*.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '*.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'behold.pictures',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
