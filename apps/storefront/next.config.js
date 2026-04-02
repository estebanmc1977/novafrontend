/** @type {import('next').NextConfig} */
const nextConfig = {
  // Clerk v6 ships with proper ESM — transpilePackages is NOT needed and
  // causes Edge Runtime errors because webpack bundles Node.js-only modules
  // (crypto, safe-node-apis) into the middleware Edge Function.
  //
  // serverExternalPackages tells Next.js to keep @clerk/backend as a true
  // Node.js external (require()) in server/API-route contexts so it can use
  // Node built-ins, while the Edge middleware uses Clerk's own Edge-safe build.
  serverExternalPackages: ["@clerk/backend"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

module.exports = nextConfig;
