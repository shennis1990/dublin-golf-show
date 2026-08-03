import { mkdirSync, unlinkSync, copyFileSync, existsSync } from "fs";

mkdirSync("public/images/stories", { recursive: true });

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

// DISCOVER — supplied exhibition-floor portrait
copyEditorial(
  process.env.DISCOVER_STORY_SOURCE ||
    "C:/Users/Shane Ennis/.cursor/projects/c-Projects-dublin-golf-show/assets/c__Users_Shane_Ennis_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-8497c15a-75ee-4abb-8f52-070541c32a70.png",
  "public/images/stories/discover.jpg",
  "DISCOVER",
);

// CONNECT — supplied Fairway Club lounge portrait
copyEditorial(
  process.env.CONNECT_STORY_SOURCE ||
    "C:/Users/Shane Ennis/.cursor/projects/c-Projects-dublin-golf-show/assets/c__Users_Shane_Ennis_AppData_Roaming_Cursor_User_workspaceStorage_empty-window_images_image-966b229d-24ff-4173-98cd-107c40e9bfe9.png",
  "public/images/stories/connect.jpg",
  "CONNECT",
);

for (const stale of ["try-v2.jpg", "watch-v2.jpg", "discover-alt.jpg", "discover-v2.jpg"]) {
  try {
    unlinkSync(`public/images/stories/${stale}`);
  } catch {
    // ignore
  }
}

console.log("Story images ready.");
