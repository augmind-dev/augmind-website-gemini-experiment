// One-off: build public/apple-touch-icon.png (180x180) from your real public/favicon.svg.
// Run from the repo root:  npm i -D sharp && node scripts/make-apple-touch-icon.mjs
import sharp from 'sharp';
await sharp('public/favicon.svg', { density: 512 })
  .resize(140, 140, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .extend({ top: 20, bottom: 20, left: 20, right: 20, background: '#0A192B' })
  .flatten({ background: '#0A192B' })
  .png()
  .toFile('public/apple-touch-icon.png');
console.log('wrote public/apple-touch-icon.png');
