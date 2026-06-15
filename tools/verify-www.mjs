import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'www', 'index.html');
const requiredFiles = [
  indexPath,
  path.join(root, 'www', 'manifest.webmanifest'),
  path.join(root, 'www', 'vendor', 'react.production.min.js'),
  path.join(root, 'www', 'vendor', 'react-dom.production.min.js'),
  path.join(root, 'www', 'vendor', 'babel.min.js'),
  path.join(root, 'www', 'icons', 'icon-192.png'),
  path.join(root, 'www', 'icons', 'icon-512.png')
];

const missing = requiredFiles.filter(file => !fs.existsSync(file));
if (missing.length) {
  console.error('Missing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const html = fs.readFileSync(indexPath, 'utf8');
const blocked = [
  /cdnjs\.cloudflare\.com/i,
  /<script\s+src=["']https?:\/\//i
];

const failures = blocked.filter(pattern => pattern.test(html));
if (failures.length) {
  console.error('The bundled app still loads external scripts. Keep JS local for Android packaging.');
  process.exit(1);
}

console.log('Daniel Fast www bundle looks ready for Capacitor sync.');
