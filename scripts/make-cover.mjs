// Builds 16:9 game covers from vertical key art.
// The text-free top of the art sits in the centre; the sides are a blurred,
// darkened copy of the same art, with a light grade and vignette on top.
//
//   node scripts/make-cover.mjs <source.png> <out-dir> [artHeight]
//
// artHeight: how many pixels from the top of the source are free of text (default 940).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const [src, outDir, artHeightArg] = process.argv.slice(2);
if (!src || !outDir) {
  console.error('Usage: node scripts/make-cover.mjs <source.png> <out-dir> [artHeight]');
  process.exit(1);
}
await mkdir(outDir, { recursive: true });

const W = 1600;
const H = 900;
const meta = await sharp(src).metadata();
const artHeight = Number(artHeightArg ?? 940);
const art = await sharp(src).extract({ left: 0, top: 0, width: meta.width, height: artHeight }).toBuffer();

// Background: the same art, stretched to fill, blurred and darkened.
const background = await sharp(art)
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .blur(40)
  .modulate({ brightness: 0.3, saturation: 0.95 })
  .toBuffer();

// Foreground: the whole text-free art at full height, edges fading into the background.
const fgHeight = H;
const fgWidth = Math.round((meta.width / artHeight) * fgHeight);
const fade = Math.round(fgWidth * 0.24);
const edgeMask = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${fgWidth}" height="${fgHeight}">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset="${fade / fgWidth}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="${1 - fade / fgWidth}" stop-color="#fff" stop-opacity="1"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`);
const foreground = await sharp(art)
  .resize(fgWidth, fgHeight)
  .ensureAlpha()
  .composite([{ input: edgeMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

// Grade: soft vignette plus a warm glow from below, matching the site's fire palette.
const overlay = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <radialGradient id="v" cx="50%" cy="45%" r="75%">
        <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.6"/>
      </radialGradient>
      <linearGradient id="s" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#0a0706" stop-opacity="0.7"/>
        <stop offset="0.25" stop-color="#0a0706" stop-opacity="0"/>
        <stop offset="0.75" stop-color="#0a0706" stop-opacity="0"/>
        <stop offset="1" stop-color="#0a0706" stop-opacity="0.7"/>
      </linearGradient>
      <linearGradient id="w" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0.6" stop-color="#ff5a00" stop-opacity="0"/>
        <stop offset="1" stop-color="#ff5a00" stop-opacity="0.18"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#s)"/>
    <rect width="100%" height="100%" fill="url(#w)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`);

const composed = await sharp(background)
  .composite([
    { input: foreground, left: Math.round((W - fgWidth) / 2), top: 0 },
    { input: overlay, left: 0, top: 0 },
  ])
  .toBuffer();

const graded = sharp(composed).modulate({ saturation: 1.08 }).linear(1.06, -6);

await graded.clone().resize(1280, 720).webp({ quality: 84 }).toFile(`${outDir}/card.webp`);
await graded.clone().resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 84, mozjpeg: true }).toFile(`${outDir}/og.jpg`);
console.log(`covers written to ${outDir} (foreground ${fgWidth}x${fgHeight})`);
