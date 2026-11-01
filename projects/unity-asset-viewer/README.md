# Unity Asset Koʻruvchi

Brauzerda ishlaydigan Unity fayl koʻruvchi va export vositasi. Fayllar serverga yuborilmaydi.

## Fayllar
- index.html: sahifa
- style.css: dizayn
- app.js: butun mantiq (bundle parser, LZ4/LZMA, tur daraxti, tekstura dekoderi, mesh, export)

## Ishga tushirish
Fayllarni oddiy statik hostingga qoʻying. Bepul variantlar: GitHub Pages yoki Cloudflare Pages.
Mahalliy sinash uchun papkada: python3 -m http.server 8000, keyin http://localhost:8000 ni oching.
Faylni toʻgʻridan-toʻgʻri ikki marta bosib ochsangiz ZIP'ni diskka yozish ishlamasligi mumkin (xavfsiz kontekst kerak).

## Qoʻllab-quvvatlanadi
UnityFS bundle (LZ4, LZMA), .assets, .resS; Unity 2018 va yangi versiyalar (serialized v17+, tur daraxti bilan).
Tekstura: RGBA32, ARGB32, BGRA32, RGB24, Alpha8, R8, RG16, R16, RGB565, RGBA4444, ARGB4444, DXT1, DXT5; ETC, ASTC, BC7 (GPU orqali, qurilmaga bogʻliq).
Mesh: OBJ va GLB (oddiy va siqilgan Compressed Mesh, faqat uchburchaklar). Sprite: PNG. TextAsset: TXT. AudioClip: FSB. Boshqa obyektlar: JSON.

## Hali yoʻq
Audio'ni WAV'ga dekodlash, Crunch/PVRTC/HDR teksturalar, skelet va animatsiya.
