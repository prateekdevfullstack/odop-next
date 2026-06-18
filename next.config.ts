import type { NextConfig } from "next";

function imageRemotePatterns() {
  const hostnames = new Set(["udyamsarthi.co.in", "odopapi.samadhandigitech.com"]);

  for (const base of [
    process.env.NEXT_PUBLIC_NEW_BASE_URL,
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ]) {
    if (!base) continue;
    try {
      hostnames.add(new URL(base).hostname);
    } catch {
      /* ignore invalid env URLs */
    }
  }

  return [...hostnames].flatMap((hostname) => [
    { protocol: "https" as const, hostname },
    { protocol: "http" as const, hostname },
  ]);
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns(),
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 192, 256, 384, 512],
    qualities: [25, 50, 60, 75, 90, 100],
    minimumCacheTTL: 2678400,
    maximumDiskCacheSize: 500_000_000,
  },
  async redirects() {
    return [
      { source: "/cfcs", destination: "/resources/cfc-list", permanent: true },
      { source: "/cfc", destination: "/resources/cfc-list", permanent: true },
      {
        source: "/cfc/:id(\\d+)/events/:eventId",
        destination: "/resources/cfc-list/gallery/:eventId",
        permanent: true,
      },
      {
        source: "/cfc/:id(\\d+)",
        destination: "/resources/cfc-list/:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
