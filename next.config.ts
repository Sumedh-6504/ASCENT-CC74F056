import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Increase body size limit for PDF/DOCX uploads (default is 4MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  output: "standalone",
};

export default nextConfig;
