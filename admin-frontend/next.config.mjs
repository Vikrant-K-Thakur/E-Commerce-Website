/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      net: false,
      tls: false,
      fs: false,
      dns: false,
      child_process: false,
    }
    return config
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Add this to help with deployment
  output: 'standalone',
}

export default nextConfig
