/**
 * generateIcons.ts
 *
 * Generates all required PWA + Android icon sizes as PNG files
 * using only the Canvas API via the `canvas` npm package.
 *
 * Run:  npx tsx scripts/generateIcons.ts
 *
 * If canvas isn't installed:  npm install canvas --save-dev
 * (optional — you can also use any online PWA icon generator with the SVG)
 */

import fs   from 'fs';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = path.join(process.cwd(), 'public', 'icons');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Try to use canvas if available, otherwise write an SVG placeholder
async function run() {
  try {
    // Dynamic import so the script doesn't crash if canvas isn't installed
    const { createCanvas } = await import('canvas' as any);

    for (const size of sizes) {
      const canvas = createCanvas(size, size);
      const ctx    = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#070b14';
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, size * 0.18);
      ctx.fill();

      // Gradient fill for text
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#00e6a0');
      grad.addColorStop(1, '#00b8d9');

      ctx.fillStyle = grad;
      ctx.font      = `bold ${Math.round(size * 0.55)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('$', size / 2, size / 2);

      const buf = canvas.toBuffer('image/png');
      const out = path.join(outDir, `icon-${size}x${size}.png`);
      fs.writeFileSync(out, buf);
      console.log(`✅ ${out}`);
    }

    console.log('\n✅ All icons generated successfully in public/icons/');
  } catch {
    console.log('⚠️  canvas package not found — copying SVG as placeholder PNG names.');
    console.log('   Install canvas with: npm install canvas --save-dev');
    console.log('   OR upload public/icons/icon.svg to https://realfavicongenerator.net\n');

    // Write a plain note file so users know what to do
    const note = sizes.map(s => `icon-${s}x${s}.png`).join('\n');
    fs.writeFileSync(
      path.join(outDir, 'README.txt'),
      `Generate these PNG files from icon.svg:\n${note}\n\nUse: https://realfavicongenerator.net\n`
    );
    console.log('📄 public/icons/README.txt written with instructions.');
  }
}

run();
