import sharp from "sharp";
import { mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");
const appDir = join(root, "app");

mkdirSync(iconsDir, { recursive: true });

const bg = "#0A111C";
const accent = "#009A6D";

function svgIcon(size) {
  const r = Math.round(size * 0.18);
  const font = Math.round(size * 0.28);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="${bg}"/>
  <circle cx="${size / 2}" cy="${size * 0.38}" r="${size * 0.07}" fill="${accent}"/>
  <text x="50%" y="${size * 0.72}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="${font}" font-weight="700" fill="#ffffff">DGS</text>
</svg>`);
}

async function png(size, file) {
  await sharp(svgIcon(size)).png().toFile(file);
  console.log("wrote", file);
}

await png(16, join(iconsDir, "favicon-16x16.png"));
await png(32, join(iconsDir, "favicon-32x32.png"));
await png(180, join(iconsDir, "apple-touch-icon.png"));
await png(192, join(iconsDir, "android-chrome-192x192.png"));
await png(512, join(iconsDir, "android-chrome-512x512.png"));

await sharp(svgIcon(32)).png().toFile(join(appDir, "icon.png"));
await sharp(svgIcon(32)).png().toFile(join(publicDir, "favicon.ico"));
await sharp(svgIcon(180)).png().toFile(join(appDir, "apple-icon.png"));

await sharp(join(publicDir, "images", "hero-hall.png"))
  .resize(1200, 630, { fit: "cover", position: "centre" })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(publicDir, "og.jpg"));

console.log("Favicons and OG image generated.");
