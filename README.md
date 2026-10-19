# asadius — Instagram Reels yasash fabrikasi 🎬

Bu loyiha oddiy matn fayldan **Instagram Reels** videosini (1080×1920, vertikal) avtomatik yasaydi.
Dasturlashni bilish shart emas: siz faqat matn yozasiz, video GitHub'ning o'zida tayyorlanadi.

## Qanday ishlaydi?

1. `reels/` papkasida har bir video uchun bitta `.json` fayl bor.
2. Siz faylni yaratasiz yoki o'zgartirasiz va **Commit changes** tugmasini bosasiz.
3. GitHub avtomatik ravishda videoni yasaydi (2–4 daqiqa).
4. Tayyor `.mp4` faylni yuklab olib, Instagram'ga joylaysiz.

## Yangi video yasash (brauzerda, qadamma-qadam)

1. GitHub'da `reels` papkasini oching.
2. **Add file → Create new file** tugmasini bosing.
3. Fayl nomini yozing, masalan: `02-motivatsiya.json`
4. Ichiga quyidagini qo'ying va matnlarni o'zgartiring:

```json
{
  "theme": "olov",
  "handle": "@asadius_",
  "slides": [
    { "emoji": "🔥", "text": "Bugun boshlang!", "seconds": 2 },
    { "emoji": "💪", "text": "Har kuni 1% yaxshilaning", "seconds": 3 },
    { "emoji": "🚀", "text": "1 yilda 37 barobar kuchli bo'lasiz", "seconds": 3 },
    { "emoji": "👉", "text": "Saqlab qo'ying va do'stingizga yuboring!", "seconds": 3 }
  ]
}
```

5. Pastdagi yashil **Commit changes** tugmasini bosing.

## Tayyor videoni yuklab olish

1. Repozitoriyning yuqorisidagi **Actions** bo'limiga o'ting.
2. Eng yuqoridagi **"Reels yasash"** ishini oching (yashil ✅ belgisini kuting).
3. Sahifaning pastidagi **Artifacts** qismida **reels-videolar** ni bosing. ZIP fayl yuklanadi, ichida videolar bo'ladi.
4. Videoni telefoningizga o'tkazib, Instagram'ga Reels qilib joylang.

## Sozlamalar

| Maydon | Nima qiladi | Misol |
|---|---|---|
| `theme` | Fon rangi | `binafsha`, `kok`, `olov`, `yashil`, `tun` |
| `handle` | Pastdagi yozuv | `@asadius_` |
| `music` | Fon musiqasi (ixtiyoriy) | `musiqa.mp3` |
| `slides` | Ekranlar ro'yxati | — |
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
npm run studio          # brauzerda jonli ko'rish va tahrirlash
npm run render          # reels/ dagi hamma videolarni out/ papkasiga yasash
npm run render -- 01-namuna   # faqat bittasini yasash
```

Loyiha [Remotion](https://www.remotion.dev) asosida qurilgan (shaxsiy foydalanish uchun bepul).
Shrift: Montserrat (SIL Open Font License, `public/fonts/OFL-LICENSE.txt`).
