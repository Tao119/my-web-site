/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["firebasestorage.googleapis.com", "storage.googleapis.com"],
  },
  webpack(config) {
    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
  async rewrites() {
    // dopamine は静的に書き出して public/dopamine に置いてある
    return [{ source: "/dopamine", destination: "/dopamine/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/Build/:path*",
        headers: [
          {
            key: "Content-Encoding",
            value: "gzip",
          },
        ],
      },
      {
        source: "/shibuya-rush/Build/:file*.unityweb",
        headers: [{ key: "Content-Encoding", value: "gzip" }, { key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/shibuya-rush/Build/:file*.wasm.unityweb",
        headers: [{ key: "Content-Type", value: "application/wasm" }],
      },
      {
        source: "/shibuya-rush/Build/:file*.framework.js.unityweb",
        headers: [{ key: "Content-Type", value: "application/javascript" }],
      },
      {
        source: "/shibuya-rush/Build/:file*.data.unityweb",
        headers: [{ key: "Content-Type", value: "application/octet-stream" }],
      },
      {
        source: "/dopamine/(apple-icon|opengraph-image|twitter-image)",
        headers: [{ key: "Content-Type", value: "image/png" }],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
