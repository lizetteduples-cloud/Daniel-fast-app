import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = path.join(root, 'assets', 'app-icon.svg');
const iconsDir = path.join(root, 'www', 'icons');

await fs.mkdir(iconsDir, { recursive: true });

for (const size of [48, 72, 96, 128, 192, 384, 512]) {
  await sharp(source)
    .resize(size, size)
    .png()
    .toFile(path.join(iconsDir, `icon-${size}.png`));
}

console.log(`Generated FastingFlow icons in ${iconsDir}`);
