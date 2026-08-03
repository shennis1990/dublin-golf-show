import sharp from "sharp";
import { mkdirSync, unlinkSync } from "fs";

mkdirSync("public/images/stories", { recursive: true });

const W = 1080;
const H = 1350; // 4:5 portrait stories

async function portraitCrop(src, out, box) {
  await sharp(src)
    .extract(box)
    .resize(W, H, { fit: "cover", position: "centre" })
    .modulate({ brightness: 1.02, saturation: 0.9 })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
  console.log("wrote", out);
}

// TRY — club fitting human story (keep hall-3 centre couple)
await portraitCrop("public/images/hall-3.png", "public/images/stories/try.jpg", {
  left: 480,
  top: 50,
  width: 900,
  height: 770,
});

// WATCH — masterclass: speaker + engaged audience (hall-2)
await portraitCrop("public/images/hall-2.png", "public/images/stories/watch.jpg", {
  left: 520,
  top: 60,
  width: 880,
  height: 760,
});

// DISCOVER — visitors exploring premium stands & product (hall-3 right)
await portraitCrop("public/images/hall-3.png", "public/images/stories/discover.jpg", {
  left: 980,
  top: 50,
  width: 860,
  height: 770,
});

for (const stale of ["try-v2.jpg", "watch-v2.jpg", "discover-alt.jpg", "discover-v2.jpg"]) {
  try {
    unlinkSync(`public/images/stories/${stale}`);
  } catch {
    // ignore
  }
}

console.log("Story crops ready.");
