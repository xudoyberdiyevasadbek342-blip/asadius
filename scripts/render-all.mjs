// reels/ papkasidagi har bir .json fayldan out/ papkasiga .mp4 video yasaydi.
// Faqat bittasini yasash: npm run render -- 01-namuna
import { execFileSync } from "node:child_process";
import { readdirSync, mkdirSync } from "node:fs";
import { basename } from "node:path";

const only = process.argv[2];
const files = readdirSync("reels")
  .filter((f) => f.endsWith(".json"))
  .filter((f) => !only || basename(f, ".json") === only);

if (files.length === 0) {
  console.error("reels/ papkasida mos .json fayl topilmadi");
  process.exit(1);
}

mkdirSync("out", { recursive: true });
for (const file of files) {
  const name = basename(file, ".json");
  console.log(`\n▶ ${name} yasalmoqda...`);
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Reel", `out/${name}.mp4`, `--props=reels/${file}`],
    { stdio: "inherit" },
  );
}
console.log("\n✅ Tayyor! Videolar out/ papkasida.");
