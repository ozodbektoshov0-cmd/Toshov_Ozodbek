# Toshov Ozodbek sayti

Statik sayt: 23 ta onlayn asbob, ko‘k neon uslub, tungi (Matrix) rejim, IT bilim testi, yozish tezligi testi va terminal simulyator. Build jarayoni yo‘q, oddiy HTML, CSS va JavaScript.

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

## Loyihalar

- `projects/3d-studiya/`: 3D Studiya. Ko‘k/tungi mavzu `css/hacker.css` va `js/hacker-fx.js` fayllarida (asl fayllar o‘zgarmagan, faqat `index.html` va `sw.js` ga ulangan). Mavzu va FX holati asosiy sayt bilan umumiy.
- `projects/gta-sa/`: GTA SA modlar portali (o‘zgartirilmagan)

## Mavzu va fon

Sayt standart ko‘k neon mavzuda, orqada sekin siljiydigan kod matni. Sarlavhadagi **NIGHT MODE** tugmasi yashil Matrix yomg‘iri mavzusiga o‘tkazadi (`data-theme="night"`, `localStorage` kaliti `to:theme`). 3D Studiya ham shu mavzuni ishlatadi. `FX` tugmasi fon animatsiyasini o‘chiradi. Kod `assets/bg.js` da. Tizimda “animatsiyani kamaytirish” yoqilgan bo‘lsa, fon o‘zi o‘chiq boshlanadi.

## Musiqa

`assets/music.js` brauzerning o‘zida (WebAudio) original qorong‘i sintezator trekini chaladi, audio fayl yo‘q. Brauzer qoidasiga ko‘ra ovoz foydalanuvchi bosganidan keyin boshlanadi, shuning uchun bosh sahifada **START** kirish ekrani bor. ♪ tugmasi yoki terminaldagi `music` buyrug‘i musiqani yoqadi va o‘chiradi. Kirish ekranini o‘chirish uchun `music.js` ichidagi `intro();` qatorini olib tashlang.
