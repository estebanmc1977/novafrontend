/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite que Next.js transpile paquetes de Clerk correctamente
  // en lugar de tratarlos como externos en el bundle del servidor.
  // Esto resuelve el error "__webpack_modules__[moduleId] is not a function"
  // que ocurre cuando el RSC runtime trata de cargar módulos de Clerk
  // con IDs que no coinciden entre server y client bundles.
  transpilePackages: ["@clerk/nextjs", "@clerk/localizations"],

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
