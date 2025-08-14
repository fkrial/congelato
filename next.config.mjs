// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Agrega esta línea
  output: 'standalone',

  // El resto de tu configuración
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig