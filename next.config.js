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
    // 静的に書き出したゲームは public/games/<名前>/ にある。末尾なしの URL で index.html を返す
    return [
      { source: "/games/dopamine", destination: "/games/dopamine/index.html" },
      { source: "/games/shibuya-rush", destination: "/games/shibuya-rush/index.html" },
    ];
  },
  async redirects() {
    // ゲームは /games/ 配下に集約した。旧URLは新URLへ転送する
    return [
      { source: "/shibuya-rush/index.html", destination: "/games/shibuya-rush", permanent: true },
      { source: "/shibuya-rush/:path*", destination: "/games/shibuya-rush/:path*", permanent: true },
      { source: "/shibuya-rush", destination: "/games/shibuya-rush", permanent: true },
      { source: "/dopamine/:path*", destination: "/games/dopamine/:path*", permanent: true },
      { source: "/dopamine", destination: "/games/dopamine", permanent: true },
      { source: "/ito/:path*", destination: "/games/ito/:path*", permanent: true },
      { source: "/ito", destination: "/games/ito", permanent: true },
      { source: "/molkky/:path*", destination: "/games/molkky/:path*", permanent: true },
      { source: "/molkky", destination: "/games/molkky", permanent: true },
      { source: "/karuta/:path*", destination: "/games/karuta/:path*", permanent: true },
      { source: "/karuta", destination: "/games/karuta", permanent: true },
    ];
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
        source: "/games/shibuya-rush/Build/:file*.unityweb",
        headers: [{ key: "Content-Encoding", value: "gzip" }, { key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
      {
        source: "/games/shibuya-rush/Build/:file*.wasm.unityweb",
        headers: [{ key: "Content-Type", value: "application/wasm" }],
      },
      {
        source: "/games/shibuya-rush/Build/:file*.framework.js.unityweb",
        headers: [{ key: "Content-Type", value: "application/javascript" }],
      },
      {
        source: "/games/shibuya-rush/Build/:file*.data.unityweb",
        headers: [{ key: "Content-Type", value: "application/octet-stream" }],
      },
      {
        source: "/games/dopamine/(apple-icon|opengraph-image|twitter-image)",
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
