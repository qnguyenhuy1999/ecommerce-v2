import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@ecom/core-ui', '@ecom/contracts', '@ecom/shared'],
  turbopack: {
    resolveAlias: {
      'tw-animate-css': './node_modules/tw-animate-css/dist/tw-animate.css',
      'shadcn/tailwind.css': './node_modules/shadcn/dist/tailwind.css',
    },
  },
}

export default nextConfig
