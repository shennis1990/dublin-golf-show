import sharp from "sharp";
import { mkdirSync, unlinkSync, copyFileSync, existsSync } from "fs";

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

function copyEditorial(src, dest, label) {
  if (!existsSync(src)) {
    console.warn(`${label} source missing — leaving existing file untouched`);
    return;
  }
  copyFileSync(src, dest);
  console.log(`copied ${dest} from supplied editorial source (no recompression)`);
}

// TRY — supplied editorial portrait
copyEditorial(
  process.env.TRY_STORY_SOURCE ||
    "C:/Users/Shane Ennis/.cursor/projects/c-Projects-dublin-golf-show/assets/c__Users_Shane_Ennis_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-32365c2d-1e79-46df-aacf-f77e5370281a.png",
  "public/images/stories/try.jpg",
  "TRY",
);

// WATCH — supplied main-stage conversation
copyEditorial(
  process.env.WATCH_STORY_SOURCE ||
    "C:/Users/Shane Ennis/.cursor/projects/c-Projects-dublin-golf-show/assets/c__Users_Shane_Ennis_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-cbe4e33d-b352-4b05-8c7f-c12001a19662.png",
  "public/images/stories/watch.jpg",
  "WATCH",
);

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
