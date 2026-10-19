# asadius — Instagram Reels yasash fabrikasi 🎬

Bu loyiha oddiy matn fayldan **Instagram Reels** videosini (1080×1920, vertikal) avtomatik yasaydi.
Dasturlashni bilish shart emas: siz faqat matn yozasiz, video GitHub'ning o'zida tayyorlanadi.

## Qanday ishlaydi?

1. `reels/` papkasida har bir video uchun bitta `.json` fayl bor.
2. Siz faylga **ovoz matnini** va har bir sahna uchun **rasm tavsifini** yozasiz.
3. GitHub avtomatik ravishda:
   - 🎙️ matnni **AI o'zbekcha ovoz** bilan o'qitadi (Microsoft Edge TTS, bepul);
   - 🎨 har bir sahna uchun **AI rasm** chizadi (Pollinations, bepul);
   - 🎬 rasmlarni kinematik harakat, so'zma-so'z sariq subtitr va ovoz bilan videoga yig'adi.
4. 3–6 daqiqadan keyin tayyor `.mp4` faylni yuklab olasiz.

## Yangi video yasash (brauzerda)

1. GitHub'da `reels` papkasini oching → **Add file → Create new file**.
2. Fayl nomi: masalan `05-ulugbek.json`
3. Ichiga yozing:

```json
{
  "title": "Ulug'bek osmonni qanday o'lchagan?",
  "handle": "@asadius_",
  "voice": "uz-UZ-SardorNeural",
  "rate": "+5%",
  "caption": "Instagram uchun izoh va #hashtaglar",
  "scenes": [
    {
      "text": "Ovoz o'qiydigan birinchi gap.",
      "image": "rasm tavsifi inglizcha, masalan: medieval observatory in Samarkand at night, stars"
    },
    {
      "text": "Ikkinchi gap.",
      "image": "keyingi rasm tavsifi"
    }
  ]
}
```

4. **Commit changes** ni bosing.

**Maslahat:** rasm tavsifini (`image`) **inglizcha** yozing, AI uni yaxshiroq tushunadi. Yozib berishni Claude'dan so'rashingiz ham mumkin.

**Ovozlar:** `uz-UZ-SardorNeural` (erkak), `uz-UZ-MadinaNeural` (ayol). `rate` tezlikni belgilaydi: `"+10%"` bo'lsa tezroq, `"-10%"` bo'lsa sekinroq.

**Rasm yoqmadimi?** Sahnaning `image` tavsifini biroz o'zgartiring. Faqat o'sha rasm qaytadan chiziladi.
Tayyor ovoz va rasmlar `public/gen/` papkasida saqlanadi.

## Tayyor videoni yuklab olish

1. Repozitoriyning yuqorisidagi **Actions** bo'limiga o'ting.
2. Eng yuqoridagi **"Reels yasash"** ishini oching (yashil ✅ belgisini kuting).
3. Sahifaning pastidagi **Artifacts** qismida **reels-videolar** ni bosing. ZIP fayl yuklanadi, ichida videolar bo'ladi.
4. Videoni telefoningizga o'tkazib, Instagram'ga Reels qilib joylang.

## Sozlamalar

| Maydon | Nima qiladi | Misol |
|---|---|---|
| `title` | Boshida yuqorida chiqadigan sarlavha | `Temur nega kuldi?` |
| `voice` | AI ovoz | `uz-UZ-SardorNeural` |
| `scenes` | Sahnalar: `text` (ovoz) + `image` (rasm tavsifi) | — |
| `theme` | Fon rangi (faqat oddiy `slides` videolar uchun) | `binafsha`, `kok`, `olov`, `yashil`, `tun` |
| `handle` | Pastdagi yozuv | `@asadius_` |
| `music` | Fon musiqasi (ixtiyoriy) | `musiqa.mp3` |
| `slides` | Oddiy matnli ekranlar (ovozsiz, eski format) | — |
| `emoji` | Katta emoji (ixtiyoriy) | `🔥` |
| `text` | Ekrandagi matn | `Bilasizmi?` |
| `seconds` | Necha soniya turadi | `3` |

**Musiqa qo'shish:** `.mp3` faylni `public/` papkasiga yuklang (**Add file → Upload files**) va JSON faylga
`"music": "fayl-nomi.mp3"` qatorini qo'shing. Mualliflik huquqi bilan himoyalanmagan musiqadan foydalaning.

## Maslahatlar

- **Birinchi 1–2 soniya** eng muhimi: savol yoki qiziq gap bilan boshlang ("Bilasizmi?", "Buni hech kim aytmaydi...").
- Reels uchun **7–15 soniya** eng yaxshi uzunlik.
- Oxirida chaqiriq qo'ying: "Obuna bo'ling", "Saqlab qo'ying", "Do'stingizga yuboring".
- Matnlarni Claude yoki boshqa AI yordamida yozdiring: *"Menga 5 ta qiziqarli fakt yoz, Reels uchun qisqa"*.

## Kompyuterda ishlatish (ixtiyoriy, dasturchilar uchun)

```bash
npm install
pip install -r scripts/requirements.txt
python scripts/prepare.py   # AI ovoz va rasmlar
npm run studio          # brauzerda jonli ko'rish va tahrirlash
npm run render          # reels/ dagi hamma videolarni out/ papkasiga yasash
npm run render -- 02-temur-boyazid-suhbat   # faqat bittasini
```

Loyiha [Remotion](https://www.remotion.dev) asosida qurilgan (shaxsiy foydalanish uchun bepul).
Shrift: Montserrat (SIL Open Font License, `public/fonts/OFL-LICENSE.txt`).
