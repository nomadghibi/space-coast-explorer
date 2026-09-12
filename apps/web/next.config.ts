import type { NextConfig } from "next";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }]
  },
  outputFileTracingRoot: repoRoot,
  transpilePackages: ["@space-coast-explorer/ui"]
};

export default nextConfig;
