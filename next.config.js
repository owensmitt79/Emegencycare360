const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['sequelize', 'mysql2'],
  webpack: (config) => {
    config.resolve.alias['react-router-dom'] = path.resolve(__dirname, 'src/lib/router-compat.jsx');
    config.resolve.alias['react'] = path.resolve(__dirname, 'node_modules/react');
    config.resolve.alias['react-dom'] = path.resolve(__dirname, 'node_modules/react-dom');
    return config;
  },
  turbopack: {
    root: __dirname,
    resolveAlias: {
      'react-router-dom': './src/lib/router-compat.jsx',
      'react': './node_modules/react',
      'react-dom': './node_modules/react-dom',
    },
  },
};

module.exports = nextConfig;
