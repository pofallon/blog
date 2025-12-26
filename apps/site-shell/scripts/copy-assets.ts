
import fs from 'fs';
import path from 'path';

const contentImagesDir = path.join(process.cwd(), '../../content/images');
const publicImagesDir = path.join(process.cwd(), 'public/content-images');

function copyDir(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            // Only copy if changed or doesn't exist
            if (!fs.existsSync(destPath) || fs.statSync(srcPath).mtime > fs.statSync(destPath).mtime) {
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${entry.name} to ${destPath}`);
            }
        }
    }
}

if (fs.existsSync(contentImagesDir)) {
    console.log(`Copying images from ${contentImagesDir} to ${publicImagesDir}`);
    copyDir(contentImagesDir, publicImagesDir);
} else {
    console.warn(`Source images directory not found at ${contentImagesDir}`);
}
