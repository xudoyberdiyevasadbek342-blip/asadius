"""AI ovoz (edge-tts) va AI rasmlar (Pollinations) tayyorlaydi.

reels/*.json ichida "scenes" bo'lgan har bir video uchun public/gen/<nomi>/
papkasiga ovoz, rasm va props.json yozadi. Oldin yaratilgan fayllar qayta
yaratilmaydi, shuning uchun matnni o'zgartirsangiz o'sha sahna fayllarini o'chiring
(yoki sahna matni o'zgarganini skript o'zi aniqlaydi).
"""

import asyncio
import hashlib
import json
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

import edge_tts

DEFAULT_VOICE = "uz-UZ-SardorNeural"
DEFAULT_STYLE = (
    "cinematic epic historical digital painting, dramatic lighting, "
    "highly detailed, 14th century Central Asia, film still, vertical composition"
)
SCENE_PADDING = 0.35  # sahnalar orasidagi pauza (soniya)


def fingerprint(*parts: str) -> str:
    return hashlib.sha1("|".join(parts).encode()).hexdigest()[:10]


def audio_seconds(path: Path) -> float:
    out = subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nw=1:nk=1", str(path)]
    )
    return float(out)


async def make_voice(text: str, voice: str, rate: str, mp3: Path, words_file: Path):
    if mp3.exists() and words_file.exists():
        return
    words = []
    with mp3.open("wb") as f:
        stream = edge_tts.Communicate(text, voice, rate=rate, boundary="WordBoundary").stream()
        async for chunk in stream:
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "text": chunk["text"],
                    "start": chunk["offset"] / 1e7,
                    "end": (chunk["offset"] + chunk["duration"]) / 1e7,
                })
    words_file.write_text(json.dumps(words, ensure_ascii=False))


def make_image(prompt: str, seed: int, path: Path) -> bool:
    if path.exists():
        return True
    query = urllib.parse.urlencode(
        {"width": 1080, "height": 1920, "seed": seed, "nologo": "true", "model": "flux"}
    )
    url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?{query}"
    for attempt in range(5):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "asadius-reels"})
            with urllib.request.urlopen(req, timeout=180) as resp:
                data = resp.read()
            if len(data) > 10_000:
                path.write_bytes(data)
                return True
        except Exception as e:  # noqa: BLE001
            print(f"   rasm xatosi ({attempt + 1}/5): {e}")
        time.sleep(15 * (attempt + 1))
    return False


async def prepare(reel_file: Path):
    reel = json.loads(reel_file.read_text())
    if "scenes" not in reel:
        return
    name = reel_file.stem
    out_dir = Path("public/gen") / name
    out_dir.mkdir(parents=True, exist_ok=True)
    voice = reel.get("voice", DEFAULT_VOICE)
    rate = reel.get("rate", "+0%")
    style = reel.get("style", DEFAULT_STYLE)
    print(f"▶ {name}")

    scenes = []
    for i, scene in enumerate(reel["scenes"]):
        key = fingerprint(scene["text"], voice, rate)
        mp3 = out_dir / f"s{i}-{key}.mp3"
        words_file = out_dir / f"s{i}-{key}.json"
        await make_voice(scene["text"], voice, rate, mp3, words_file)

        img_key = fingerprint(scene["image"], style)
        img = out_dir / f"s{i}-{img_key}.jpg"
        has_image = make_image(f"{scene['image']}, {style}", 1000 + i, img)
        print(f"   sahna {i + 1}: ovoz ✅  rasm {'✅' if has_image else '❌'}")

        scenes.append({
            "text": scene["text"],
            "audio": str(mp3.relative_to("public")),
            "image": str(img.relative_to("public")) if has_image else None,
            "words": json.loads(words_file.read_text()),
            "seconds": round(audio_seconds(mp3) + SCENE_PADDING, 2),
        })

    # Eski (endi ishlatilmaydigan) fayllarni tozalash
    used = {Path(s["audio"]).name for s in scenes} | {Path(s["audio"]).with_suffix(".json").name for s in scenes}
    used |= {Path(s["image"]).name for s in scenes if s["image"]}
    for f in out_dir.iterdir():
        if f.name not in used and f.name != "props.json":
            f.unlink()

    props = {k: v for k, v in reel.items() if k not in ("scenes", "voice", "rate", "style")}
    props["scenes"] = scenes
    (out_dir / "props.json").write_text(json.dumps(props, ensure_ascii=False, indent=2))


async def main():
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for f in sorted(Path("reels").glob("*.json")):
        if only and f.stem != only:
            continue
        await prepare(f)


asyncio.run(main())
