import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // 禁用服务端功能以支持静态导出
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
