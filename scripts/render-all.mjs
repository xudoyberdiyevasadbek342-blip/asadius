// reels/ papkasidagi har bir .json fayldan out/ papkasiga .mp4 video yasaydi.
// AI ovozli videolar ("scenes") uchun avval: python scripts/prepare.py
// Faqat bittasini yasash: npm run render -- 02-temur-boyazid-suhbat
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, mkdirSync } from "node:fs";
import { basename } from "node:path";

const only = process.argv[2];
const extra = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];
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
  let props = `reels/${file}`;
  if (JSON.parse(readFileSync(props, "utf8")).scenes) {
    props = `public/gen/${name}/props.json`;
    if (!existsSync(props)) {
      console.error(`❌ ${name}: avval "python scripts/prepare.py" ni ishga tushiring`);
      process.exit(1);
    }
  }
  console.log(`\n▶ ${name} yasalmoqda...`);
  execFileSync(
    "npx",
    ["remotion", "render", "src/index.ts", "Reel", `out/${name}.mp4`, `--props=${props}`, ...extra],
    { stdio: "inherit" },
  );
}
console.log("\n✅ Tayyor! Videolar out/ papkasida.");
