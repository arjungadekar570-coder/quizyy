/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Allow file uploads up to 20MB via Server Actions (PDF/DOCX support)
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
