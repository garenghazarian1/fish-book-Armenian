/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // still helpful in dev
  compress: true, // gzip/brotli compression
  images: {
    formats: ["image/avif", "image/webp"], // next-gen formats
    domains: ["localhost", "your-domain.com"], // add your domain here
  },
  modularizeImports: {
    // Optional: reduce JS bundle sizes (tree-shake massive libs like lodash)
    lodash: {
      transform: "lodash/{{member}}",
    },
    "date-fns": {
      transform: "date-fns/{{member}}",
    },
  },
};

export default nextConfig;
