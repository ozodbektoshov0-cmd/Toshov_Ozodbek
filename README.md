# Toshov Ozodbek sayti

Statik sayt: 23 ta onlayn asbob, ko‘k neon uslub, tungi (Matrix) rejim, IT bilim testi, yozish tezligi testi va Linux terminal (v86, brauzerda). Build jarayoni yo‘q, oddiy HTML, CSS va JavaScript.

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
- `projects/unity-asset-viewer/`: Unity Asset Ko‘ruvchi. Asl fayllar o‘zgarmagan; `hacker.css` va `theme.js` qo‘shilgan. Three.js va fflate CDN orqali yuklanadi (internet kerak).
- `projects/gta-sa/`: GTA SA modlar portali (o‘zgartirilmagan)

## Mavzu va fon

Sayt standart ko‘k neon mavzuda, orqada sekin siljiydigan kod matni. Sarlavhadagi **NIGHT MODE** tugmasi yashil Matrix yomg‘iri mavzusiga o‘tkazadi (`data-theme="night"`, `localStorage` kaliti `to:theme`). 3D Studiya ham shu mavzuni ishlatadi. `FX` tugmasi fon animatsiyasini o‘chiradi. Kod `assets/bg.js` da. Tizimda “animatsiyani kamaytirish” yoqilgan bo‘lsa, fon o‘zi o‘chiq boshlanadi.

## Musiqa

`assets/music.js` brauzerning o‘zida (WebAudio) original qorong‘i sintezator trekini chaladi, audio fayl yo‘q. Brauzer qoidasiga ko‘ra ovoz foydalanuvchi bosganidan keyin boshlanadi, shuning uchun bosh sahifada **START** kirish ekrani bor. ♪ tugmasi yoki terminaldagi `music` buyrug‘i musiqani yoqadi va o‘chiradi. Kirish ekranini o‘chirish uchun `music.js` ichidagi `intro();` qatorini olib tashlang.

- `projects/uy-quruvchi/`: Uy quruvchi. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/3d-model-studio/`: 3D Model Studiya. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/3ds-max-studio/`: 3DS Max Object Studiya. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/avto-nomer/`: Avto nomer studiyasi. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/gta-id-baza/`: GTA ID baza va IMG. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/gta-light-studio/`: GTA Light Studiya. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/gta-v-to-sa/`: GTA V → SA konvertor. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/img-tool/`: IMG Tool. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/txd-tool/`: TXD Tool. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/map-editor/`: Map Editor. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.
- `projects/zmodeler-web/`: ZModeler Web. Ko‘k/night mavzu `site-theme.css` va `site-theme.js` orqali asosiy sayt bilan umumiy.

## Terminal

`terminal.html` haqiqiy Linux'ni brauzerda v86 (WebAssembly) orqali ishga tushiradi. Fayllar manzillari `assets/terminal-linux.js` boshidagi `CONFIG` ichida (CDN). Oflayn yoki tezroq ishlashi uchun v86 fayllarini o'zingizning papkangizga qo'yib, manzillarni almashtiring.

## Fayl markazi, Google kirish va Kirishlar

- `files.html`: fayllar brauzerda (IndexedDB) saqlanadi, 1 GB gacha. Server kerak emas.
- `kirishlar.html`, `assets/auth.js`, `assets/config.js`: Google bilan kirish va statistika. Ishlashi uchun Firebase kerak: `assets/config.js` ga sozlamalar va `ADMIN_EMAIL` yoziladi. Sozlanmagan bo'lsa, kirish tugmasi chiqmaydi.
- Kirishda foydalanuvchiga rozilik so'raladi: ism, email, IP (ipapi.co orqali), qurilma, brauzer saqlanadi.

Firestore qoidalari (ADMIN_EMAIL o'rniga o'z emailingiz):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{id} {
      allow create, update: if request.auth != null && request.auth.uid == id;
      allow read: if request.auth != null && request.auth.token.email == 'ADMIN_EMAIL';
    }
    match /logins/{id} {
      allow create: if request.auth != null && request.resource.data.uid == request.auth.uid;
      allow read: if request.auth != null && request.auth.token.email == 'ADMIN_EMAIL';
    }
  }
}
```
