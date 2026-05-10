import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@ecom/core-ui', '@ecom/contracts', '@ecom/shared'],
}

export default nextConfig
