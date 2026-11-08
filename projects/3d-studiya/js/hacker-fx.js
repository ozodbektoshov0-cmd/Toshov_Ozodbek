/* Hacker fon: 3D oyna orqasida Matrix yomg'iri, yashil to'r va asosiy saytga qaytish tugmasi */
(function () {
  'use strict';
  var vp = document.getElementById('vp'), cv = document.getElementById('c');
  if (!vp || !cv) return;

  /* asosiy sayt bilan bir xil origin: mavzu va FX holati umumiy */
  function ls(k, d) { try { var v = localStorage.getItem('to:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem('to:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var theme = ls('theme', 'blue') === 'night' ? 'night' : 'blue';
  var enabled = ls('fx', !reduce);
  var root = document.documentElement;
  if (theme === 'night') root.setAttribute('data-theme', 'night');
  vp.classList.toggle('night', theme === 'night');

  /* ---------- to'r rangi ---------- */
  function paintGrid() {
    try {
      if (typeof grid === 'undefined' || !grid.material) return;
      if (theme === 'night') grid.material.color.setRGB(0.1, 1.3, 0.8);
      else grid.material.color.setRGB(0.5, 0.5, 1.6);
    } catch (e) { /* to'r topilmasa, o'tkazib yuboramiz */ }
  }
  paintGrid();

  /* ---------- Matrix yomg'iri ---------- */
  var CH = ('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン' +
    '0123456789ABCDEF<>{}[]()/=+-*&|$#@%;:').split('');
  function rc() { return CH[(Math.random() * CH.length) | 0]; }
  var rain = document.createElement('canvas');
  rain.id = 'hrain';
  rain.setAttribute('aria-hidden', 'true');
  vp.insertBefore(rain, vp.firstChild);
  var ctx = rain.getContext('2d');
  var FS = 15, W = 0, H = 0, cols = 0, drops = [], spd = [], raf = 0, last = 0;

  function size() {
    var r = vp.getBoundingClientRect();
    W = rain.width = Math.max(1, Math.floor(r.width));
    H = rain.height = Math.max(1, Math.floor(r.height));
    cols = Math.ceil(W / FS);
    drops = []; spd = [];
    for (var i = 0; i < cols; i++) { drops.push(Math.floor(Math.random() * -(H / FS))); spd.push(0.45 + Math.random() * 0.55); }
    ctx.font = FS + 'px "Courier Prime", monospace';
  }
  function color() { return '#00ff66'; }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < 50 || document.hidden) return;
    last = t;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    for (var i = 0; i < cols; i++) {
      if (Math.random() > spd[i]) continue;
      var r = drops[i], x = i * FS;
      if (r >= 0 && r * FS < H + FS) {
        if (r > 0) { ctx.clearRect(x, (r - 1) * FS, FS, FS); ctx.fillStyle = color(); ctx.fillText(rc(), x, r * FS - 3); }
        ctx.clearRect(x, r * FS, FS, FS);
        ctx.fillStyle = '#eafff1';
        ctx.fillText(rc(), x, (r + 1) * FS - 3);
      }
      drops[i]++;
      if (drops[i] * FS > H && Math.random() > 0.975) drops[i] = Math.floor(Math.random() * -20);
    }
  }
  try { new ResizeObserver(size).observe(vp); } catch (e) { window.addEventListener('resize', size); }
  size();

  /* ---------- yozilib turuvchi jurnal ---------- */
  var log = document.createElement('div');
  log.id = 'hlog';
  log.setAttribute('aria-hidden', 'true');
  vp.appendChild(log);
  function hex(n) { var s = ''; for (var i = 0; i < n; i++) s += '0123456789abcdef'[(Math.random() * 16) | 0]; return s; }
  var MSG = ['three.js yuklandi', 'sahna tayyor', 'to‘r chizildi', 'kesh isitildi', 'GLB dekoder ok', 'DFF/TXD o‘qigich ok', 'tekstura xotirasi tekshirildi', 'render sikli barqaror', 'oflayn rejim tayyor'];
  function line() { return '[' + hex(4) + '] ' + MSG[(Math.random() * MSG.length) | 0] + (Math.random() < 0.4 ? ' 0x' + hex(6) : ''); }
  var lines = [], target = '', pos = 0, timer = 0;
  function draw(cur) { log.textContent = lines.join('\n') + (lines.length ? '\n' : '') + cur + '█'; }
  function tick() {
    if (!target) { target = line(); pos = 0; }
    if (pos >= target.length) {
      lines.push(target); if (lines.length > 7) lines.shift();
      target = ''; draw('');
      timer = setTimeout(tick, 200 + Math.random() * 400);
      return;
    }
    pos += Math.random() < 0.3 ? 2 : 1;
    draw(target.slice(0, pos));
    timer = setTimeout(tick, 25 + Math.random() * 30);
  }

  /* ---------- tugmalar ---------- */
  var bar = document.createElement('div');
  bar.id = 'hx';
  var back = document.createElement('a');
  back.href = '../../tools.html';
  back.textContent = '← Asboblar';
  back.title = 'Asosiy saytga qaytish';
  var fx = document.createElement('button');
  fx.type = 'button'; fx.textContent = 'FX'; fx.title = 'Fon animatsiyasini yoqish yoki o‘chirish';
  fx.setAttribute('aria-label', 'Fon animatsiyasini yoqish yoki o‘chirish');
  var th = document.createElement('button');
  th.type = 'button'; th.textContent = '◐'; th.title = 'Ko‘k va tungi rejim';
  th.setAttribute('aria-label', 'Rang mavzusini almashtirish');
  bar.appendChild(back); bar.appendChild(fx); bar.appendChild(th);
  vp.appendChild(bar);

  function setFx(on) {
    enabled = !!on;
    vp.classList.toggle('nofx', !enabled);
    fx.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    if (enabled) { if (!raf) raf = requestAnimationFrame(frame); if (!timer) tick(); }
    else { cancelAnimationFrame(raf); raf = 0; clearTimeout(timer); timer = 0; ctx.clearRect(0, 0, W, H); }
    lsSet('fx', enabled);
  }
  fx.addEventListener('click', function () { setFx(!enabled); });
  th.addEventListener('click', function () {
    theme = theme === 'night' ? 'blue' : 'night';
    if (theme === 'night') root.setAttribute('data-theme', 'night'); else root.removeAttribute('data-theme');
    vp.classList.toggle('night', theme === 'night');
    lsSet('theme', theme); paintGrid();
  });
  setFx(enabled);
})();
