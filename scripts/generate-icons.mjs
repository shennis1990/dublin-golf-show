import sharp from "sharp";
import { copyFileSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

const root = process.cwd();
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");
const appDir = join(root, "app");
const imagesDir = join(publicDir, "images");

mkdirSync(iconsDir, { recursive: true });
mkdirSync(imagesDir, { recursive: true });

const stackedSquare =
  process.env.LOGO_SOURCE ||
  "C:/Users/Shane Ennis/Dropbox/DGS/DGS - Logo - Stacked - No Contour - Square.png";

const stackedTransparent =
  process.env.LOGO_TRANSPARENT ||
  "C:/Users/Shane Ennis/Dropbox/DGS/DGS - Logo - Stacked - Transparent White - Square.png";

const logoSquare = join(imagesDir, "logo-stacked-square.png");
copyFileSync(stackedSquare, logoSquare);

const bg = { r: 10, g: 17, b: 28, alpha: 1 };
const bgSolid = { r: 10, g: 17, b: 28 };

async function fullLogoIcon(size, file, paddingRatio = 0.08) {
  const pad = Math.round(size * paddingRatio);
  const inner = Math.max(1, size - pad * 2);
  const resized = await sharp(logoSquare)
    .resize(inner, inner, { fit: "contain", background: bg })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toFile(file);

  console.log("wrote", file);
}

/**
 * Golf-ball mark from the stacked logo — readable at 16–32px tab sizes.
 * Ball sits at the end of the accent line (lower-right of the artwork).
 */
async function ballMarkBuffer(size) {
  const sourceSize = 128;
  const ball = await sharp(stackedTransparent)
    .flatten({ background: bgSolid })
    .extract({ left: 905, top: 726, width: 96, height: 96 })
    .resize(sourceSize, sourceSize, { fit: "cover" })
    .png()
    .toBuffer();

  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sourceSize}" height="${sourceSize}">
      <circle cx="${sourceSize / 2}" cy="${sourceSize / 2}" r="${sourceSize * 0.46}" fill="#fff"/>
    </svg>`,
  );

  const masked = await sharp(ball)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const markSize = Math.round(size * 0.84);
  const resized = await sharp(masked)
    .resize(markSize, markSize)
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

async function markIcon(size, file) {
  await sharp(await ballMarkBuffer(size)).toFile(file);
  console.log("wrote", file);
}

async function stackedLogoPng(size, paddingRatio = 0.06) {
  const pad = Math.round(size * paddingRatio);
  const inner = Math.max(1, size - pad * 2);
  const resized = await sharp(logoSquare)
    .resize(inner, inner, { fit: "contain", background: bg })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background: bg },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toBuffer();
}

function pngsToIco(images) {
  const count = images.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const entries = images.map((img) => {
    const entry = { ...img, offset, bytes: img.png.length };
    offset += img.png.length;
    return entry;
  });

  const buf = Buffer.alloc(offset);
  buf.writeUInt16LE(0, 0);
  buf.writeUInt16LE(1, 2);
  buf.writeUInt16LE(count, 4);

  let entryOffset = 6;
  for (const entry of entries) {
    buf[entryOffset] = entry.width >= 256 ? 0 : entry.width;
    buf[entryOffset + 1] = entry.height >= 256 ? 0 : entry.height;
    buf[entryOffset + 2] = 0;
    buf[entryOffset + 3] = 0;
    buf.writeUInt16LE(1, entryOffset + 4);
    buf.writeUInt16LE(32, entryOffset + 6);
    buf.writeUInt32LE(entry.bytes, entryOffset + 8);
    buf.writeUInt32LE(entry.offset, entryOffset + 12);
    entryOffset += 16;
  }

  for (const entry of entries) {
    entry.png.copy(buf, entry.offset);
  }

  return buf;
}

// Tiny / tab favicons — golf ball mark (legacy files; not used as the primary Google icon)
await markIcon(16, join(iconsDir, "favicon-16x16-v2.png"));
await markIcon(32, join(iconsDir, "favicon-32x32-v2.png"));
await markIcon(48, join(iconsDir, "favicon-48x48-v2.png"));

// Google Search / browser favicon — existing stacked square DGS logo
const favicon48 = await stackedLogoPng(48);
const faviconIco = pngsToIco([
  { width: 16, height: 16, png: await stackedLogoPng(16) },
  { width: 32, height: 32, png: await stackedLogoPng(32) },
  { width: 48, height: 48, png: favicon48 },
  { width: 256, height: 256, png: await stackedLogoPng(256) },
]);

await sharp(favicon48).toFile(join(iconsDir, "favicon-48x48.png"));
console.log("wrote", join(iconsDir, "favicon-48x48.png"));
await fullLogoIcon(192, join(appDir, "icon.png"), 0.06);
writeFileSync(join(publicDir, "favicon.ico"), faviconIco);
console.log("wrote", join(publicDir, "favicon.ico"));

// Remove unversioned tiny favicons so stale CDN/browser caches cannot keep serving them
for (const stale of ["favicon-16x16.png", "favicon-32x32.png"]) {
  try {
    unlinkSync(join(iconsDir, stale));
  } catch {
    // ignore
  }
}

// Larger brand icons — full stacked logo
await fullLogoIcon(180, join(iconsDir, "apple-touch-icon.png"), 0.06);
await fullLogoIcon(192, join(iconsDir, "android-chrome-192x192.png"), 0.06);
await fullLogoIcon(512, join(iconsDir, "android-chrome-512x512.png"), 0.06);
await fullLogoIcon(180, join(appDir, "apple-icon.png"), 0.06);

// Open Graph / WhatsApp — 1200x630 with logo centered
const logoForOg = await sharp(logoSquare)
  .resize(560, 560, { fit: "contain", background: bg })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: bgSolid,
  },
})
  .composite([{ input: logoForOg, gravity: "centre" }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(publicDir, "og.jpg"));

await sharp(logoSquare)
  .resize(1200, 1200, { fit: "cover" })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(publicDir, "og-square.jpg"));

// Remove probe artifacts if present
for (const name of [
  "_crop-a.png",
  "_crop-b.png",
  "_crop-c.png",
  "_crop-d.png",
  "_crop-e.png",
  "_crop-ball.png",
  "_strip.png",
  "_mid.png",
  "_full-sm.png",
  "_line-area.png",
  "_ball-area.png",
  "_under2027.png",
  "_year.png",
  "_year-tight.png",
  "_year-mark.png",
  "_tw.png",
  "_ball-try.png",
  "_ball-try2.png",
  "_ball-try3.png",
  "_contour-sm.png",
  "_svg-ball-16.png",
  "_svg-ball-32.png",
  "_svg-ball-48.png",
  "_svg-ball-180.png",
  "_svg-ball-192.png",
  "_svg-ball-512.png",
  "_t-880-480.png",
  "_t-850-470.png",
  "_t-900-500.png",
  "_t-920-510.png",
  "_t-870-490.png",
]) {
  try {
    unlinkSync(join(iconsDir, name));
  } catch {
    // ignore
  }
}

console.log("Brand logo applied to favicons and Open Graph images.");
