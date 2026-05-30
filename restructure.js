import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function moveDirectory(src, dest) {
    try {
        await fs.rename(src, dest);
        console.log(`Moved ${src} to ${dest}`);
    } catch (error) {
        if (error.code === 'EXDEV') {
            // Fallback for cross-device or special cases
            await fs.cp(src, dest, { recursive: true });
            await fs.rm(src, { recursive: true, force: true });
            console.log(`Copied and removed ${src} to ${dest}`);
        } else if (error.code === 'ENOENT') {
            console.log(`Source ${src} does not exist, skipping.`);
        } else {
            console.error(`Error moving ${src} to ${dest}:`, error);
        }
    }
}

async function restructure() {
    console.log('Starting restructure...');
    
    const root = __dirname;
    const appsDir = path.join(root, 'apps');
    const webDir = path.join(appsDir, 'web');
    const apiDir = path.join(appsDir, 'api');
    const pbDir = path.join(appsDir, 'pocketbase');
    
    const clientDir = path.join(root, 'client');
    const serverDir = path.join(root, 'server');
    const serverPbDir = path.join(serverDir, 'pb');

    // 1. Move apps/web to client
    await moveDirectory(webDir, clientDir);
    
    // 2. Move apps/api to server
    await moveDirectory(apiDir, serverDir);
    
    // 3. Move apps/pocketbase to server/pb
    await fs.mkdir(serverDir, { recursive: true });
    await moveDirectory(pbDir, serverPbDir);
    
    // 4. Try to remove the apps directory
    try {
        await fs.rmdir(appsDir);
        console.log('Removed empty apps directory.');
    } catch (e) {
        console.log('apps directory is not empty or cannot be removed yet.', e.message);
    }

    console.log('Restructure complete! Please update your package.json at the root if necessary.');
}

restructure();
