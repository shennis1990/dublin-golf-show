import sharp from "sharp";
import { copyFileSync, mkdirSync } from "fs";
import { join } from "path";

const root = process.cwd();
const publicDir = join(root, "public");
const iconsDir = join(publicDir, "icons");
const appDir = join(root, "app");
const imagesDir = join(publicDir, "images");

mkdirSync(iconsDir, { recursive: true });
mkdirSync(imagesDir, { recursive: true });

const source =
  process.env.LOGO_SOURCE ||
  "C:/Users/Shane Ennis/Dropbox/DGS/DGS - Logo - Stacked - No Contour - Square.png";

const logoSquare = join(imagesDir, "logo-stacked-square.png");
copyFileSync(source, logoSquare);

const bg = { r: 10, g: 17, b: 28, alpha: 1 };

async function iconFromLogo(size, file, paddingRatio = 0.08) {
  const pad = Math.round(size * paddingRatio);
  const inner = Math.max(1, size - pad * 2);
  const resized = await sharp(logoSquare)
    .resize(inner, inner, { fit: "contain", background: bg })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: bg,
    },
  })
    .composite([{ input: resized, gravity: "centre" }])
    .png()
    .toFile(file);

  console.log("wrote", file);
}

// Favicons / app icons from brand logo
await iconFromLogo(16, join(iconsDir, "favicon-16x16.png"), 0.05);
await iconFromLogo(32, join(iconsDir, "favicon-32x32.png"), 0.05);
await iconFromLogo(180, join(iconsDir, "apple-touch-icon.png"), 0.06);
await iconFromLogo(192, join(iconsDir, "android-chrome-192x192.png"), 0.06);
await iconFromLogo(512, join(iconsDir, "android-chrome-512x512.png"), 0.06);
await iconFromLogo(32, join(appDir, "icon.png"), 0.05);
await iconFromLogo(32, join(publicDir, "favicon.ico"), 0.05);
await iconFromLogo(180, join(appDir, "apple-icon.png"), 0.06);

// Open Graph / WhatsApp / social — 1200x630 with logo centered on brand background
const logoForOg = await sharp(logoSquare)
  .resize(560, 560, { fit: "contain", background: bg })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 3,
    background: { r: 10, g: 17, b: 28 },
  },
})
  .composite([{ input: logoForOg, gravity: "centre" }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(publicDir, "og.jpg"));

// Also keep a square OG variant for platforms that prefer 1:1
await sharp(logoSquare)
  .resize(1200, 1200, { fit: "cover" })
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(join(publicDir, "og-square.jpg"));

console.log("Brand logo applied to favicons and Open Graph images.");
