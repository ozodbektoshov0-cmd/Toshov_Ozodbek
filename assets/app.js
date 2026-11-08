/* Toshov Ozodbek sayti: umumiy skript (sarlavha, pastki qism, mavzu, asboblar ro'yxati) */
(function () {
  'use strict';

  var SITE = {
    name: 'Toshov Ozodbek',
    github: 'https://github.com/ozodbektoshov0-cmd',
    telegram: 'https://t.me/Ozodbek_Toshov',
    instagram: 'https://www.instagram.com/toshov_ozodbek_/',
    year: new Date().getFullYear()
  };

  var CATS = {
    hisob: 'Hisob-kitob',
    matn: 'Matn',
    media: 'Rasm va ovoz',
    tarmoq: 'Tarmoq',
    dev: 'Dasturchi uchun',
    vaqt: 'Vaqt',
    loyiha: 'Loyiha'
  };

  var TOOLS = [
    { id: 'qr', t: 'QR kod yaratuvchi', d: 'Matn yoki havoladan rangli QR kod yarating va PNG qilib yuklab oling.', i: '▦', c: 'media' },
    { id: 'calculator', t: 'Kalkulyator', d: 'Oddiy va ilmiy amallar, qavslar, daraja, sin, cos, log. Klaviatura bilan ishlaydi.', i: '±', c: 'hisob' },
    { id: 'currency', t: 'Valyuta kursi', d: "So'm, dollar, yevro, rubl va boshqa valyutalar o'rtasida hisoblash.", i: '$', c: 'hisob' },
    { id: 'units', t: "O'lchov birliklari", d: "Uzunlik, vazn, harorat, hajm va ma'lumot o'lchamlarini o'zgartiring.", i: '⇄', c: 'hisob' },
    { id: 'age', t: 'Yosh hisoblagich', d: "Tug'ilgan sanangizdan yosh, yashagan kunlar va keyingi tug'ilgan kungacha qolgan vaqt.", i: '✦', c: 'hisob' },
    { id: 'calendar', t: 'Kalendar', d: "Oylar bo'yicha kalendar va O'zbekistondagi belgilangan sanali bayramlar.", i: '▤', c: 'vaqt' },
    { id: 'world-clock', t: 'Dunyo vaqti', d: 'Dunyoning turli shaharlarida hozir soat nechchi ekanini ko‘ring.', i: '◷', c: 'vaqt' },
    { id: 'timer', t: 'Taymer va sekundomer', d: 'Orqaga sanash taymeri va sekundomer, tugaganda ovozli signal bilan.', i: '⏱', c: 'vaqt' },
    { id: 'ip-info', t: 'IP va brauzer ma’lumoti', d: "Sizning IP manzilingiz, joylashuvingiz va qurilmangiz haqida ma'lumot.", i: '◎', c: 'tarmoq' },
    { id: 'speed-test', t: 'Internet tezligi', d: 'Yuklab olish, yuklash tezligi va ping vaqtini o‘lchang.', i: '⚡', c: 'tarmoq' },
    { id: 'image-converter', t: 'Rasm konvertori', d: "JPG, PNG va WEBP formatlari orasida o'zgartiring, hajmini kichraytiring.", i: '▣', c: 'media' },
    { id: 'text-to-speech', t: 'Matndan ovozga', d: "Yozilgan matnni brauzer ovozi bilan o'qiting. Tezlik va ohangni sozlang.", i: '♪', c: 'media' },
    { id: 'speech-to-text', t: 'Ovozdan matnga', d: "Mikrofonga gapiring, gapingiz matnga aylanadi (o'zbek, rus, ingliz).", i: '✎', c: 'media' },
    { id: 'color', t: 'Rang asbobi', d: 'HEX, RGB va HSL formatlarini o‘zgartiring va rangning tuslarini oling.', i: '◐', c: 'media' },
    { id: 'password', t: 'Parol yaratuvchi', d: 'Kuchli tasodifiy parol yarating va uning mustahkamligini ko‘ring.', i: '⚿', c: 'dev' },
    { id: 'hash', t: 'Hash hisoblagich', d: 'Matn yoki fayldan SHA-1, SHA-256, SHA-384 va SHA-512 olish.', i: '#', c: 'dev' },
    { id: 'base64', t: 'Base64 va URL kodlash', d: "Matnni Base64 yoki URL formatiga o'tkazing va qaytaring.", i: '⇋', c: 'dev' },
    { id: 'json', t: 'JSON formatlovchi', d: "JSON'ni tekshiring, chiroyli ko'rinishga keltiring yoki siqing.", i: '{ }', c: 'dev' },
    { id: 'regex', t: 'Regex tekshiruvchi', d: 'Muntazam ifodani matn ustida sinab ko‘ring va topilgan joylarni ko‘ring.', i: '.*', c: 'dev' },
    { id: 'number-base', t: 'Sanoq tizimlari', d: "Ikkilik, sakkizlik, o'nlik va o'n oltilik sanoq tizimlari orasida o'zgartiring.", i: '01', c: 'dev' },
    { id: 'random', t: 'Tasodifiy tanlov', d: "Tasodifiy son, tanga, kubik, ro'yxatdan tanlash va UUID yaratish.", i: '⚄', c: 'dev' },
    { id: 'words', t: 'So‘z va belgi sanagich', d: "Matndagi so'z, belgi, gap va o'qish vaqtini hisoblang.", i: 'Aa', c: 'matn' },
    { id: 'case', t: 'Harf registri', d: "KATTA, kichik, Sarlavha, camelCase, snake_case va boshqa ko'rinishlarga o'tkazish.", i: 'aA', c: 'matn' }
  ];
  /* Saytga ichiga o'rnatilgan loyihalar ham asboblar ro'yxatida chiqadi (h = sahifa yo'li) */
  TOOLS.push(
    { h: 'projects/3d-studiya/', id: '3d-studiya', t: '3D Studiya', d: 'Brauzerda 3D modellarni ko‘rish, tahrirlash va konvertatsiya qilish.', i: '◐', c: 'loyiha' },
    { h: 'projects/gta-sa/', id: 'gta-sa', t: 'GTA SA modlar portali', d: 'GTA San Andreas uchun o‘zbekcha modlar, Cheat Menu va grafik paketlar.', i: '▣', c: 'loyiha' },
    { h: 'projects/unity-asset-viewer/', id: 'unity-asset-viewer', t: 'Unity Asset Ko‘ruvchi', d: 'Unity bundle va .assets fayllarini ochish, tekstura va mesh yuklab olish.', i: '◆', c: 'loyiha' },
    { h: 'projects/uy-quruvchi/', id: 'uy-quruvchi', t: 'Uy quruvchi', d: 'Brauzerda uy loyihasini 3D ko‘rinishda chizish, model qo‘yish va OBJ, GLTF formatlariga eksport qilish.', i: '⌂', c: 'loyiha' },
    { h: 'projects/3d-model-studio/', id: '3d-model-studio', t: '3D Model Studiya', d: 'Vektor va OBJ modellarni ko‘rish, o‘lchash va DFF masshtabiga mos OBJ qilib chiqarish.', i: '◈', c: 'loyiha' },
    { h: 'projects/3ds-max-studio/', id: '3ds-max-studio', t: '3DS Max Object Studiya', d: '3DS Max uslubidagi obyekt muharriri: bir nechta obyektni birlashtirib OBJ va STL qilib saqlash.', i: '▣', c: 'loyiha' },
    { h: 'projects/avto-nomer/', id: 'avto-nomer', t: 'Avto nomer studiyasi', d: '195 dan ortiq davlat va viloyatlar uchun avtomobil raqam belgisini yaratish va rasm qilib yuklash.', i: '▭', c: 'loyiha' },
    { h: 'projects/gta-id-baza/', id: 'gta-id-baza', t: 'GTA ID baza va IMG', d: 'GTA ID raqamlar bazasi va IMG arxivlari bilan ishlash.', i: '#', c: 'loyiha' },
    { h: 'projects/gta-light-studio/', id: 'gta-light-studio', t: 'GTA Light Studiya', d: 'GTA mashinalari uchun chiroq va logotip teksturalarini tayyorlash studiyasi.', i: '☀', c: 'loyiha' },
    { h: 'projects/gta-v-to-sa/', id: 'gta-v-to-sa', t: 'GTA V → SA konvertor', d: 'GTA V modellarini San Andreas formatiga o‘tkazish.', i: '⇄', c: 'loyiha' },
    { h: 'projects/img-tool/', id: 'img-tool', t: 'IMG Tool', d: 'GTA IMG arxivlarini ochish: fayllarni qidirish, chiqarib olish, qo‘shish, almashtirish, nomini o‘zgartirish, o‘chirish va arxivni qayta qurish.', i: '▥', c: 'loyiha' },
    { h: 'projects/txd-tool/', id: 'txd-tool', t: 'TXD Tool', d: 'GTA TXD fayllarini ochish, teksturalarni PNG ga eksport va import qilish, nomini o‘zgartirish, o‘chirish, DXT va mipmap bilan saqlash.', i: '▤', c: 'loyiha' },
    { h: 'projects/map-editor/', id: 'map-editor', t: 'Map Editor', d: 'GTA SA IPL va IDE fayllarini xarita ustida ko‘rish va tahrirlash: qidirish, ko‘chirish, aylantirish, klonlash, qo‘shish, o‘chirish va saqlash.', i: '⌖', c: 'loyiha' },
    { h: 'projects/zmodeler-web/', id: 'zmodeler-web', t: 'ZModeler Web', d: 'ZModeler 2 interfeysidan ilhomlangan brauzerdagi past poligonli model muharriri.', i: '◆', c: 'loyiha' }
  );


  var FEATURES = [
    { id: 'terminal', href: 'terminal.html', t: 'Linux terminal', d: "Brauzerda ishlaydigan haqiqiy Linux: bash, ls, vi va boshqa buyruqlar.", peek: '$ uname -a' },
    { id: 'quiz', href: 'quiz.html', t: 'IT bilim testi', d: "60 ta savoldan tasodifiy tanlanadi. Natijangiz saqlanadi.", peek: '20 / 20 ?' },
    { id: 'typing', href: 'typing.html', t: 'Yozish tezligi testi', d: "Daqiqada nechta so'z yozishingizni o'lchang.", peek: '62 WPM' }
  ];

  var NAV = [
    { k: 'terminal', href: 'terminal.html', t: 'Terminal' },
    { k: 'quiz', href: 'quiz.html', t: 'IT test' },
    { k: 'typing', href: 'typing.html', t: 'Yozish' },
    { k: 'files', href: 'files.html', t: 'Files' },
    { k: 'about', href: 'about.html', t: 'Bio' }
  ];

  /* ---- yordamchilar ---- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('to:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('to:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };

  var toastTimer;
  function toast(msg) {
    var el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  function copyText(text) {
    function done() { toast('Nusxa olindi'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('Nusxa olib bo‘lmadi'); }
      document.body.removeChild(ta);
    }
  }

  function download(name, blobOrUrl) {
    var a = document.createElement('a');
    var isBlob = typeof blobOrUrl !== 'string';
    a.href = isBlob ? URL.createObjectURL(blobOrUrl) : blobOrUrl;
    a.download = name;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    if (isBlob) setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  }

  /* ---- mavzu: ko'k (standart) yoki night (yashil Matrix) ---- */
  function getTheme() { return document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'blue'; }
  function setTheme(t) {
    if (t === 'night') document.documentElement.setAttribute('data-theme', 'night');
    else document.documentElement.removeAttribute('data-theme');
    store.set('theme', t === 'night' ? 'night' : 'blue');
    var nb = document.getElementById('night-btn');
    if (nb) nb.setAttribute('aria-pressed', t === 'night' ? 'true' : 'false');
  }
  if (store.get('theme', 'blue') === 'night') document.documentElement.setAttribute('data-theme', 'night');

  /* ---- sarlavha va pastki qism ---- */
  var root = document.body.getAttribute('data-root') || '';
  var page = document.body.getAttribute('data-page') || '';
  var toolId = document.body.getAttribute('data-tool') || '';

  var WD = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
  var MO = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  function p2(n) { return (n < 10 ? '0' : '') + n; }
  function clockText() {
    var d = new Date();
    return WD[d.getDay()] + ', ' + d.getDate() + ' ' + MO[d.getMonth()] + ' ' + d.getFullYear() + ' | ' + p2(d.getHours()) + ':' + p2(d.getMinutes()) + ':' + p2(d.getSeconds());
  }

  function buildHeader() {
    var links = NAV.map(function (n) {
      var cur = (n.k === page) ? ' aria-current="page"' : '';
      return '<a href="' + root + n.href + '"' + cur + '>' + n.t + '</a>';
    }).join('');
    var toolLinks = '<a role="menuitem" class="dd-all" href="' + root + 'tools.html">Barcha asboblar</a>' +
      TOOLS.map(function (t) { return '<a role="menuitem" href="' + toolHref(t.id) + '">' + esc(t.t) + '</a>'; }).join('');
    var inTools = (page === 'tools' || toolId) ? ' aria-current="page"' : '';
    var night = getTheme() === 'night' ? 'true' : 'false';

    var w = document.createElement('div');
    w.className = 'top-wrap';
    w.innerHTML =
      '<div class="topbar" id="topbar" role="timer" aria-label="Hozirgi vaqt">' + clockText() + '</div>' +
      '<header class="site-header"><div class="bar">' +
      '<a class="brand" href="' + root + 'index.html">' + esc(SITE.name) + '</a>' +
      '<nav class="nav" id="nav" aria-label="Asosiy menyu">' +
      '<div class="dd" id="dd"><button class="dd-btn" id="dd-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="dd-menu"' + inTools + '>Tools <span aria-hidden="true">▾</span></button>' +
      '<div class="dd-menu" id="dd-menu" role="menu" hidden>' + toolLinks + '</div></div>' +
      links +
      '<button class="pill" id="night-btn" type="button" aria-pressed="' + night + '">Tema</button></nav>' +
      '<button class="icon-btn menu-btn" id="menu-btn" type="button" aria-label="Menyu" aria-expanded="false" aria-controls="nav">☰</button>' +
      '</div></header>';
    document.body.insertBefore(w, document.body.firstChild);

    var tb = $('#topbar');
    setInterval(function () { tb.textContent = clockText(); }, 1000);

    $('#night-btn').addEventListener('click', function () {
      var next = getTheme() === 'night' ? 'blue' : 'night';
      setTheme(next);
      toast(next === 'night' ? 'Zumrad mavzusi yoqildi' : 'Standart mavzu yoqildi');
    });

    var mb = $('#menu-btn'), nav = $('#nav');
    mb.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    var dd = $('#dd'), ddb = $('#dd-btn'), ddm = $('#dd-menu');
    function closeDd(focus) { ddm.hidden = true; ddb.setAttribute('aria-expanded', 'false'); if (focus) ddb.focus(); }
    ddb.addEventListener('click', function () {
      var open = ddm.hidden;
      ddm.hidden = !open;
      ddb.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var cur = ddm.querySelector('[aria-current]'); if (cur) cur.scrollIntoView({ block: 'nearest' }); }
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) closeDd(false); });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !ddm.hidden) { e.preventDefault(); closeDd(true); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var items = $$('a', ddm); if (ddm.hidden || !items.length) return;
        e.preventDefault();
        var i = items.indexOf(document.activeElement);
        i = e.key === 'ArrowDown' ? (i + 1) % items.length : (i <= 0 ? items.length - 1 : i - 1);
        items[i].focus();
      }
    });
  }

  function buildFooter() {
    var f = document.createElement('footer');
    f.className = 'site-footer';
    f.innerHTML =
      '<div class="container bar"><span>© ' + SITE.year + ' ' + SITE.name + ' • Fayllar Fayl markazida saqlanadi</span>' +
      '<span><a href="' + root + 'tools.html">Asboblar</a> &nbsp; <a href="' + root + 'files.html">Fayl markazi</a> &nbsp; <a href="' + root + 'kirishlar.html">Kirishlar</a> &nbsp; <a href="' + root + 'about.html">Men haqimda</a> &nbsp; <a href="' + SITE.github + '" target="_blank" rel="noopener">GitHub</a> &nbsp; <a href="' + SITE.telegram + '" target="_blank" rel="noopener">Telegram</a> &nbsp; <a href="' + SITE.instagram + '" target="_blank" rel="noopener">Instagram</a></span></div>';
    document.body.appendChild(f);
  }

  /* ---- asboblar ro'yxati ---- */
  function toolHref(id) {
    var t = TOOLS.filter(function (x) { return x.id === id; })[0];
    return root + (t && t.h ? t.h : 'tools/' + id + '.html');
  }

  function toolRow(t) {
    return '<a class="tool-row" href="' + toolHref(t.id) + '">' +
      '<span class="glyph" aria-hidden="true">' + esc(t.i) + '</span>' +
      '<span><span class="cat">' + CATS[t.c] + '</span><h3>' + esc(t.t) + '</h3><p>' + esc(t.d) + '</p></span></a>';
  }

  function renderToolList(container, opts) {
    opts = opts || {};
    var q = (opts.query || '').toLowerCase().trim();
    var cat = opts.cat || 'all';
    var list = TOOLS.filter(function (t) {
      if (cat !== 'all' && t.c !== cat) return false;
      if (!q) return true;
      return (t.t + ' ' + t.d + ' ' + CATS[t.c]).toLowerCase().indexOf(q) !== -1;
    });
    if (opts.limit) list = list.slice(0, opts.limit);
    container.innerHTML = list.length
      ? list.map(toolRow).join('')
      : '<p class="empty">Hech narsa topilmadi. Boshqa so‘z yozib ko‘ring yoki toifani “Hammasi” ga o‘zgartiring.</p>';
    return list.length;
  }

  function mountToolBrowser(opts) {
    opts = opts || {};
    var input = $('#tool-search'), chips = $('#tool-chips'), list = $('#tool-list');
    if (!list) return;
    var state = { query: '', cat: 'all', limit: opts.limit };
    function draw() { renderToolList(list, state); }
    if (chips) {
      var html = '<button class="chip" type="button" data-cat="all" aria-pressed="true">Hammasi</button>' +
        Object.keys(CATS).map(function (k) { return '<button class="chip" type="button" data-cat="' + k + '" aria-pressed="false">' + CATS[k] + '</button>'; }).join('');
      chips.innerHTML = html;
      chips.addEventListener('click', function (e) {
        var b = e.target.closest('.chip'); if (!b) return;
        state.cat = b.getAttribute('data-cat');
        $$('.chip', chips).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        draw();
      });
    }
    if (input) input.addEventListener('input', function () { state.query = input.value; draw(); });
    draw();
  }

  function mountFeatures() {
    var el = $('#feature-grid'); if (!el) return;
    el.innerHTML = FEATURES.map(function (f, i) {
      return '<a class="feature' + (i === 0 ? ' big' : '') + '" href="' + root + f.href + '">' +
        '<span class="term-peek" aria-hidden="true">' + esc(f.peek) + '</span><h3>' + esc(f.t) + '</h3><p>' + esc(f.d) + '</p></a>';
    }).join('');
  }

  function mountToolHead() {
    if (!toolId) return;
    var t = TOOLS.filter(function (x) { return x.id === toolId; })[0];
    if (!t) return;
    document.title = t.t + ' | ' + SITE.name;
    var head = $('#tool-head');
    if (head) {
      head.innerHTML = '<div class="crumb"><a href="' + root + 'tools.html">Asboblar</a> / ' + CATS[t.c] + '</div><h1>' + esc(t.t) + '</h1><p>' + esc(t.d) + '</p>';
    }
    var rel = $('#related');
    if (rel) {
      var others = TOOLS.filter(function (x) { return x.c === t.c && x.id !== t.id; });
      if (others.length < 3) others = others.concat(TOOLS.filter(function (x) { return x.c !== t.c; }).slice(0, 3 - others.length));
      rel.innerHTML = '<h2>Yana shular ham kerak bo‘lishi mumkin</h2><div class="tool-list">' + others.slice(0, 4).map(toolRow).join('') + '</div>';
    }
  }

  buildHeader();
  buildFooter();
  (function () { ['config.js', 'auth.js', 'music.js'].forEach(function (n) { var s = document.createElement('script'); s.src = root + 'assets/' + n; s.async = false; document.body.appendChild(s); }); })();
  mountToolHead();
  mountFeatures();
  mountToolBrowser({ limit: document.body.getAttribute('data-limit') ? parseInt(document.body.getAttribute('data-limit'), 10) : 0 });

  window.TO = { setTheme: setTheme, getTheme: getTheme, $: $, $$: $$, esc: esc, store: store, toast: toast, copyText: copyText, download: download, TOOLS: TOOLS, CATS: CATS, SITE: SITE };
})();
