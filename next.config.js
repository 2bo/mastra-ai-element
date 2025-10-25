/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@mastra/core', '@mastra/memory', '@mastra/libsql'],
};

export default nextConfig;
