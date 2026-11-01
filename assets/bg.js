/* Hacker fon: Matrix yomg'iri, yozilib turuvchi kod oynalari va sarlavha effekti */
(function () {
  'use strict';
  var T = window.TO;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var enabled = T ? T.store.get('fx', !reduce) : !reduce;

  var CH = ('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン' +
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[]()/=+-*&|$#@%;:').split('');
  function rc() { return CH[(Math.random() * CH.length) | 0]; }

  /* ---------- fon canvas: ko'k rejimda matn gumbazi, tungi rejimda Matrix yomg'iri ---------- */
  var cv = document.createElement('canvas');
  cv.id = 'bg-rain';
  cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d');
  var FS = 16, W = 0, H = 0, cols = 0, drops = [], speeds = [], raf = 0, last = 0, accent = '#00ff66';
  var night = false, rows = [], ROWH = 15;
  var PHR = ['toshov ozodbek', 'const sayt = "ozodbek";', 'ping 127.0.0.1', 'git push origin main', 'npm run build', 'tizim tayyor', '0x1337', 'SELECT * FROM loyihalar;', 'terminal --start', 'import socket', 'console.log("salom")', 'chmod +x sayt.sh', 'ssh ozodbek@sayt', 'while(true){ kod(); }', 'sudo yaratish --sayt', 'asboblar: 23 ta', 'yuklanmoqda...', 'ulanish: barqaror', 'def salom(): pass', '<div class="hacker">'];

  function readTheme() {
    var root = document.documentElement;
    night = root.getAttribute('data-theme') === 'night';
    var v = getComputedStyle(root).getPropertyValue('--accent').trim();
    accent = v || (night ? '#00ff66' : '#29b6f6');
    cv.style.opacity = night ? '' : '0.2';
    size();
  }
  function buildRows() {
    rows = [];
    var n = Math.ceil(H / ROWH);
    for (var i = 0; i < n; i++) {
      var s = '';
      while (s.length < 260) s += PHR[(Math.random() * PHR.length) | 0] + '   ';
      rows.push({ s: s, off: Math.random() * 400, sp: (i % 2 ? 1 : -1) * (6 + Math.random() * 10) });
    }
  }
  function size() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    if (night) {
      cols = Math.ceil(W / FS);
      drops = []; speeds = [];
      for (var i = 0; i < cols; i++) {
        drops.push(Math.floor(Math.random() * -(H / FS)));
        speeds.push(0.45 + Math.random() * 0.55);
      }
      ctx.font = FS + 'px "Courier Prime", monospace';
    } else {
      buildRows();
      ctx.font = '11px "Courier Prime", monospace';
    }
    ctx.textBaseline = 'alphabetic';
  }
  function frameNight() {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
    for (var i = 0; i < cols; i++) {
      if (Math.random() > speeds[i]) continue;
      var r = drops[i], x = i * FS;
      if (r >= 0 && r * FS < H + FS) {
        if (r > 0) {
          ctx.clearRect(x, (r - 1) * FS, FS, FS);
          ctx.fillStyle = accent;
          ctx.fillText(rc(), x, r * FS - 3);
        }
        ctx.clearRect(x, r * FS, FS, FS);
        ctx.fillStyle = '#eafff1';
        ctx.fillText(rc(), x, (r + 1) * FS - 3);
      }
      drops[i]++;
      if (drops[i] * FS > H && Math.random() > 0.975) drops[i] = Math.floor(Math.random() * -20);
    }
  }
  function frameBlue(t) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = accent;
    var cw = 6.6;
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i], len = r.s.length * cw;
      var o = ((r.off + r.sp * t / 1000) % len + len) % len;
      var y = (i + 1) * ROWH;
      ctx.fillText(r.s, -o, y);
      ctx.fillText(r.s, -o + len, y);
    }
    // markazdan chetga so'nuvchi niqob (gumbaz)
    ctx.globalCompositeOperation = 'destination-in';
    var g = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.1, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }
  function frame(t) {
    raf = requestAnimationFrame(frame);
    if (t - last < (night ? 45 : 50)) return;
    last = t;
    if (night) frameNight(); else frameBlue(t);
  }

  /* ---------- yozilib turuvchi kod oynalari ---------- */
  function hex(n) { var s = ''; for (var i = 0; i < n; i++) s += '0123456789abcdef'[(Math.random() * 16) | 0]; return s; }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  var LOGMSG = ['modullar yuklanmoqda...', 'kanal ochildi', 'paket shifrlandi', 'kesh isitildi', 'sinxronlash tugadi', 'kalit almashildi', 'xotira tekshirildi', 'render sikli ok', 'ulanish barqaror'];
  var CODE = ['const sayt = "toshov-ozodbek";', 'for (let i = 0; i < 8; i++) {', '  buf[i] ^= kalit[i % 4];', '}', 'if (ulanish.ok) yuborish(paket);', 'function dekod(s) { return atob(s); }', 'while (true) { tinglash(port); }', 'let h = sha256(matn + tuz);', 'def run(): return [x*x for x in range(9)]', 'SELECT * FROM jadval LIMIT 5;', 'mov eax, 0x1337  ; ok', 'import socket, time', 'try { await fetch(url) } catch {}', 'git commit -m "yangi funksiya"', 'npm run build && deploy()'];
  function genLog() { return '[' + hex(4) + '] ' + pick(LOGMSG) + (Math.random() < 0.4 ? ' 0x' + hex(6) : ''); }
  function genCode() {
    var q = Math.random();
    if (q < 0.6) return pick(CODE);
    if (q < 0.85) { var b = ''; for (var i = 0; i < 8; i++) b += hex(2) + ' '; return '0x' + hex(6) + '  ' + b; }
    var bin = ''; for (var j = 0; j < 3; j++) { for (var k = 0; k < 8; k++) bin += Math.random() < 0.5 ? '0' : '1'; bin += ' '; }
    return bin;
  }

  function makeGhost(cls, gen, maxLines) {
    var el = document.createElement('div');
    el.className = 'code-ghost ' + cls;
    el.style.height = (maxLines * 18 + 6) + 'px';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);
    var lines = [], target = '', pos = 0, timer = 0;
    function render(cur) { el.textContent = lines.join('\n') + (lines.length ? '\n' : '') + cur + '█'; }
    function next() { target = gen(); pos = 0; }
    function tick() {
      if (pos >= target.length) {
        lines.push(target); if (lines.length > maxLines - 1) lines.shift();
        next(); render('');
        timer = setTimeout(tick, 140 + Math.random() * 260);
        return;
      }
      pos += Math.random() < 0.3 ? 2 : 1;
      render(target.slice(0, pos));
      timer = setTimeout(tick, 22 + Math.random() * 30);
    }
    return {
      start: function () { if (!timer) { next(); tick(); } },
      stop: function () { clearTimeout(timer); timer = 0; }
    };
  }
  var ghostL = makeGhost('l', genLog, 11);
  var ghostR = makeGhost('r', genCode, 12);

  /* ---------- yoqish / o'chirish ---------- */
  function setFx(on) {
    enabled = !!on;
    document.body.classList.toggle('no-fx', !enabled);
    var b = document.getElementById('fx-btn');
    if (b) b.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    if (enabled) {
      if (!raf) raf = requestAnimationFrame(frame);
      ghostL.start(); ghostR.start();
    } else {
      cancelAnimationFrame(raf); raf = 0;
      ghostL.stop(); ghostR.stop();
      ctx.clearRect(0, 0, W, H);
    }
    if (T) T.store.set('fx', enabled);
  }
  window.TOFX = { set: setFx, get: function () { return enabled; } };

  /* ---------- sarlavha: harflar "dekodlanib" chiqadi ---------- */
  function scramble(el) {
    var final = el.getAttribute('data-text') || el.textContent, n = 0, total = 28, chars = '01ABCDEF<>/\\{}$#@%';
    var id = setInterval(function () {
      n++;
      var out = '';
      for (var i = 0; i < final.length; i++) out += (final[i] === ' ' || i < final.length * n / total) ? final[i] : chars[(Math.random() * chars.length) | 0];
      el.textContent = out;
      if (n >= total) { clearInterval(id); el.textContent = final; }
    }, 40);
  }
  if (!reduce) Array.prototype.forEach.call(document.querySelectorAll('.scramble'), scramble);

  /* ---------- ishga tushirish ---------- */
  readTheme();
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 200); });
  try {
    new MutationObserver(readTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) { /* eski brauzer */ }
  setFx(enabled);
})();
