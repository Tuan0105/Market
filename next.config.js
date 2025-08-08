/** @type {import('next').NextConfig} */

const repo = 'Market' // <-- THAY BẰNG TÊN REPO CỦA BẠN
const assetPrefix = `/${repo}/`
const basePath = `/${repo}`

const nextConfig = {
  output: 'export', // <-- Quan trọng: Bật tính năng xuất tĩnh
  assetPrefix: assetPrefix,
  basePath: basePath,
};

module.exports = nextConfig;
