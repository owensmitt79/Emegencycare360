const path = require('path');
const fs = require('fs');

// Auto-synchronize image assets into the project folder on startup
const targetDir = path.resolve(__dirname, 'Public/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sources = {
  'logo.png': 'C:\\Users\\user_pc\\.gemini\\antigravity-ide\\brain\\7747e852-7b10-44b8-a9aa-b02dcc04ae2e\\media__1781706262734.png',
  'hero-image.png': 'C:\\Users\\user_pc\\.gemini\\antigravity-ide\\brain\\54e2199f-d4ce-452e-b03b-cad8eb474413\\medical_hero_image_1780311578400.png',
  'dr-jane.png': path.resolve(__dirname, 'Public/dr jane (1).png')
};

for (const [filename, sourcePath] of Object.entries(sources)) {
  const destPath = path.join(targetDir, filename);
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`[AssetSync] Successfully synchronized ${filename}`);
    } catch (err) {
      console.error(`[AssetSync] Failed to synchronize ${filename}:`, err);
    }
  } else {
    console.warn(`[AssetSync] Source path does not exist for ${filename}`);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['sequelize', 'pg'],
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
