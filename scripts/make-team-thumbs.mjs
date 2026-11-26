// Small copies of the partner photos for the 48-52px avatars (public/team/<name>-sm.webp, 156px wide = 3x).
// The full-size photos stay in use for the larger portraits. Run: node scripts/make-team-thumbs.mjs
import sharp from 'sharp';

for (const name of ['tait', 'saima-2511b', 'tom']) {
  const out = await sharp(`public/team/${name}.webp`).resize({ width: 156 }).webp({ quality: 82 }).toFile(`public/team/${name}-sm.webp`);
  console.log(`${name}-sm.webp  ${out.width}x${out.height}  ${out.size} bytes`);
}
