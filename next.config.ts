import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./sprites/**/*", "./schemas/**/*"],
  },
};

export default nextConfig;
