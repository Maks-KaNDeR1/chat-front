import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  output: "export",
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://oai.factfactor.ru/api/:path*",
      },
    ];
  },
};

export default nextConfig;
