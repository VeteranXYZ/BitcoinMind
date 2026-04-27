// Generates a 256x256 grayscale PNG of random noise.
// Replaces the runtime canvas in the original index.html.
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Buffer } from 'node:buffer';

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(__dirname, '..', 'public', 'grain.png');

const SIZE = 256;

// Build raw scanlines: 1 filter byte + SIZE pixels per row, 8-bit grayscale.
const raw = Buffer.alloc(SIZE * (SIZE + 1));
for (let y = 0; y < SIZE; y++) {
  raw[y * (SIZE + 1)] = 0; // filter: None
  for (let x = 0; x < SIZE; x++) {
    raw[y * (SIZE + 1) + 1 + x] = Math.floor(Math.random() * 256);
  }
}

// CRC-32 table (used for chunk integrity)
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crcBuf]);
}

const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);   // width
ihdr.writeUInt32BE(SIZE, 4);   // height
ihdr[8]  = 8;  // bit depth
ihdr[9]  = 0;  // color type: grayscale
ihdr[10] = 0;  // compression
ihdr[11] = 0;  // filter
ihdr[12] = 0;  // interlace

const idat = deflateSync(raw);
const png = Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);

writeFileSync(target, png);
console.log(`[generate-grain] wrote ${target} (${png.length} bytes)`);
