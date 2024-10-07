/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",

    // @see : https://posthog.com/docs/advanced/proxy/nextjs
    async rewrites() {
        return [
            {
                source: "/ingest/static/:path*",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_ASSET_HOST}/static/:path*`,
            },
            {
                source: "/ingest/:path*",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
            },
            {
                source: "/ingest/decide",
                destination: `${process.env.NEXT_PUBLIC_POSTHOG_HOST}/decide`,
            },
        ];
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true, 
};

export default nextConfig;
