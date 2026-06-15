/**
 * generateIcons.mjs
 * Generates valid PNG icon placeholders for all required PWA/Android sizes.
 * Uses only Node.js built-ins — no canvas, no external dependencies.
 *
 * Run: node scripts/generateIcons.mjs
 *
 * Each icon is a solid #070b14 background with a green $ symbol drawn
 * as a simple pixel grid (no fonts needed).
 */

import { createWriteStream } from 'fs';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, '..', 'public', 'icons');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

// ── Minimal PNG encoder (no dependencies) ───────────────────────────────────

function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcInput));
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function encodePNG(width, height, pixels) {
  // pixels: Uint8Array of RGBA values, row by row
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Build raw scanlines with filter byte 0
  const rows = [];
  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 3); // RGB
    row[0] = 0; // filter none
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      row[1 + x * 3]     = pixels[i];
      row[1 + x * 3 + 1] = pixels[i + 1];
      row[1 + x * 3 + 2] = pixels[i + 2];
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows);
  const compressed = zlib.deflateSync(raw, { level: 9 });

  const iend = Buffer.alloc(0);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', iend),
  ]);
}

// ── Draw a simple icon: dark bg + $ letter approximation ────────────────────

function makeIcon(size) {
  const pixels = new Uint8Array(size * size * 4);

  const bg  = [7,  11, 20,  255]; // #070b14
  const fg  = [0,  230, 160, 255]; // #00e6a0

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i*4]   = bg[0]; pixels[i*4+1] = bg[1];
    pixels[i*4+2] = bg[2]; pixels[i*4+3] = bg[3];
  }

  // Draw rounded rect border (2px)
  const r = Math.round(size * 0.15);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Rounded corners: outside the rounded rect = use bg already done
      // Inside: keep bg; we just draw the $ symbol
      if (
        (x < r && y < r && Math.hypot(x - r, y - r) > r) ||
        (x > size-1-r && y < r && Math.hypot(x-(size-1-r), y-r) > r) ||
        (x < r && y > size-1-r && Math.hypot(x-r, y-(size-1-r)) > r) ||
        (x > size-1-r && y > size-1-r && Math.hypot(x-(size-1-r),y-(size-1-r)) > r)
      ) {
        // outside rounded corner — darken to near-black (transparent in PNG terms)
        const idx = (y * size + x) * 4;
        pixels[idx] = 0; pixels[idx+1] = 0; pixels[idx+2] = 0;
      }
    }
  }

  // Draw a crude "$" symbol in the center using a scaled pixel grid
  // 5×9 pixel template for "$"
  const dollarTemplate = [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,0],
    [0,1,1,1,0],
    [0,0,0,0,1],
    [0,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,1,0,0], // vertical bar continues
  ];

  const scale   = Math.max(1, Math.round(size / 9));
  const gridW   = 5 * scale;
  const gridH   = 9 * scale;
  const startX  = Math.round((size - gridW) / 2);
  const startY  = Math.round((size - gridH) / 2);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 5; col++) {
      if (!dollarTemplate[row][col]) continue;
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px = startX + col * scale + dx;
          const py = startY + row * scale + dy;
          if (px < 0 || py < 0 || px >= size || py >= size) continue;
          const idx = (py * size + px) * 4;
          pixels[idx]   = fg[0]; pixels[idx+1] = fg[1];
          pixels[idx+2] = fg[2]; pixels[idx+3] = fg[3];
        }
      }
    }
  }

  // Draw vertical bar through "$"
  const barX = startX + Math.round(gridW / 2) - Math.round(scale / 2);
  for (let py = startY - scale; py < startY + gridH + scale; py++) {
    for (let bx = 0; bx < scale; bx++) {
      const px = barX + bx;
      if (px < 0 || py < 0 || px >= size || py >= size) continue;
      const idx = (py * size + px) * 4;
      pixels[idx]   = fg[0]; pixels[idx+1] = fg[1];
      pixels[idx+2] = fg[2]; pixels[idx+3] = fg[3];
    }
  }

  return pixels;
}

// ── Generate all sizes ───────────────────────────────────────────────────────

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const size of sizes) {
  const pixels = makeIcon(size);
  const png    = encodePNG(size, size, pixels);
  const file   = join(outDir, `icon-${size}x${size}.png`);
  createWriteStream(file).end(png);
  console.log(`✅  icon-${size}x${size}.png`);
}

console.log('\n✅  All icons generated → public/icons/');
console.log('   Run: npm run build  to rebuild with icons included');
