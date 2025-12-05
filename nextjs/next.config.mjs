const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SAILS_URL: process.env.NEXT_PUBLIC_SAILS_URL,
    NEXT_PUBLIC_GITHUB_ISSUES_URL: process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL,
    NEXT_PUBLIC_GITHUB_SUPPORT_URL: process.env.NEXT_PUBLIC_GITHUB_SUPPORT_URL,
    NEXT_PUBLIC_BRAND_ICON_URL: process.env.NEXT_PUBLIC_BRAND_ICON_URL,
  },
  async rewrites() {
    if (!process.env.NEXT_PUBLIC_SAILS_URL) return []
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_SAILS_URL}/api/:path*`,
      },
    ]
  },
  images: {
    domains: process.env.NEXT_PUBLIC_SAILS_URL
      ? [new URL(process.env.NEXT_PUBLIC_SAILS_URL).hostname]
      : [],
  },
}

export default nextConfig
