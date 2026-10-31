# Toshov Ozodbek sayti

Statik sayt: 23 ta onlayn asbob, IT bilim testi, yozish tezligi testi va terminal simulyator. Build jarayoni yo‘q, oddiy HTML, CSS va JavaScript.

## Vercel'ga joylash

1. Bu papkani GitHub repozitoriyga yuklang.
2. vercel.com saytida **Add New > Project** bosing va repozitoriyni tanlang.
3. Framework Preset: **Other**. Build Command va Output Directory bo‘sh qoladi.
4. **Deploy** tugmasini bosing.

Yoki terminalda: `npx vercel --prod`

## Tuzilma

- `index.html`, `tools.html`, `about.html`: asosiy sahifalar
- `terminal.html`, `quiz.html`, `typing.html`: o‘yin va test sahifalari
- `tools/*.html`: har bir asbob uchun alohida sahifa
- `assets/app.js`: sarlavha, pastki qism, mavzu va asboblar ro‘yxati (`TOOLS` massivi)
- `assets/questions.js`: IT test savollari
- `assets/style.css`: umumiy dizayn

## Yangi asbob qo‘shish

1. `tools/` papkasida mavjud asbob sahifasini nusxalab yangi nom bering (masalan `tools/yangi.html`) va `data-tool="yangi"` qilib o‘zgartiring.
2. `assets/app.js` ichidagi `TOOLS` massiviga shu `id` bilan yozuv qo‘shing.

## Yangi test savoli qo‘shish

`assets/questions.js` oxiriga qator qo‘shing: `['Savol', 'To‘g‘ri javob', 'Xato 1', 'Xato 2', 'Xato 3']`

## Tashqi xizmatlar

Valyuta kursi (open.er-api.com), IP ma’lumoti (ipwho.is), internet tezligi (speed.cloudflare.com) va QR kutubxonasi (cdnjs) internet orqali yuklanadi. Qolgan hamma narsa brauzerda ishlaydi.
