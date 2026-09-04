import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.dirname(__dirname);
const distDir = path.join(rootDir, 'dist');
const docsDir = path.join(rootDir, 'docs');

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Create .nojekyll files (prevents GitHub Pages from breaking asset paths)
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');
fs.writeFileSync(path.join(rootDir, '.nojekyll'), '');
console.log('[POSTBUILD] Created .nojekyll');

// 2. Copy dist/index.html to root 404.html and dist/404.html (for client-side routing fallback)
const builtHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
fs.writeFileSync(path.join(distDir, '404.html'), builtHtml, 'utf-8');
fs.writeFileSync(path.join(rootDir, '404.html'), builtHtml, 'utf-8');

// 3. Copy dist/assets to root assets directory
const distAssetsDir = path.join(distDir, 'assets');
const rootAssetsDir = path.join(rootDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
  copyDirRecursive(distAssetsDir, rootAssetsDir);
  console.log('[POSTBUILD] Copied assets to root ./assets');
}

// 4. Overwrite root index.html with the compiled production index.html
fs.writeFileSync(path.join(rootDir, 'index.html'), builtHtml, 'utf-8');
console.log('[POSTBUILD] Replaced root index.html with compiled production bundle');

// 5. Copy everything to docs/ for users who select /docs in GitHub Pages settings
copyDirRecursive(distDir, docsDir);
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
console.log('[POSTBUILD] Replicated full build to ./docs');

console.log('[POSTBUILD] Done! Ready for GitHub Pages root, /docs, or GitHub Actions deployment.');
