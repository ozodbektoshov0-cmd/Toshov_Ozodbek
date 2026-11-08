/* Haqiqiy Linux terminal: v86 (x86 emulyator, WebAssembly) + xterm.js.
   Hamma narsa brauzerda ishlaydi. Manzillar CONFIG ichida: kerak bo'lsa o'zingizning
   fayllaringizga almashtiring (masalan, loyiha ichiga /vendor/v86/ papkasini qo'ying). */
(function () {
  'use strict';
  var CONFIG = {
    // har bir ro'yxatda birinchi ishlagan manzil olinadi
    lib:   ['https://cdn.jsdelivr.net/npm/v86@latest/build/libv86.js', 'https://unpkg.com/v86@latest/build/libv86.js'],
    wasm:  ['https://cdn.jsdelivr.net/npm/v86@latest/build/v86.wasm', 'https://unpkg.com/v86@latest/build/v86.wasm'],
    bios:  ['https://cdn.jsdelivr.net/gh/copy/v86@master/bios/seabios.bin'],
    vga:   ['https://cdn.jsdelivr.net/gh/copy/v86@master/bios/vgabios.bin'],
    kernel:['https://i.copy.sh/buildroot-bzimage68.bin', 'https://copy.sh/v86/images/buildroot-bzimage68.bin'],
    memoryMB: 128,
    cmdline: 'tsc=reliable mitigations=off random.trust_cpu=on console=ttyS0'
  };

  var $ = function (id) { return document.getElementById(id); };
  var cover = $('cover'), st = $('st'), prog = $('prog'), startBtn = $('start'), resetBtn = $('lx-reset');
  var emu = null, term = null, fit = null;

  function say(t) { st.textContent = t; }
  function bar(p) { prog.style.display = 'block'; prog.firstElementChild.style.width = Math.round(p * 100) + '%'; }

  function pick(list) {
    // birinchi javob bergan (HEAD) manzilni tanlaydi
    var i = 0;
    return new Promise(function (ok, fail) {
      (function next() {
        if (i >= list.length) return fail(new Error(list[0]));
        var u = list[i++];
        fetch(u, { method: 'HEAD' }).then(function (r) { r.ok ? ok(u) : next(); }, next);
      })();
    });
  }
  function loadScript(u) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = function () { fail(new Error(u)); };
      document.head.appendChild(s);
    });
  }

  function makeTerm() {
    if (term) { term.dispose(); }
    var night = document.documentElement.getAttribute('data-theme') === 'night';
    term = new Terminal({
      fontFamily: '"Courier Prime", ui-monospace, Menlo, Consolas, monospace', fontSize: 14, cursorBlink: true, convertEol: false,
      theme: { background: '#000000', foreground: night ? '#d4ffe2' : '#e8edf7', cursor: night ? '#00ff66' : '#29b6f6' }
    });
    fit = new FitAddon.FitAddon(); term.loadAddon(fit);
    $('xt').innerHTML = ''; term.open($('xt')); fit.fit();
    window.addEventListener('resize', function () { try { fit.fit(); } catch (e) {} });
  }

  async function boot() {
    startBtn.disabled = true; startBtn.hidden = true;
    try {
      say('Manzillar tekshirilmoqda...'); bar(.05);
      var u = {};
      var keys = ['lib', 'wasm', 'bios', 'vga', 'kernel'];
      for (var k = 0; k < keys.length; k++) { u[keys[k]] = await pick(CONFIG[keys[k]]); bar(.05 + .1 * k); }
      say('Emulyator yuklanmoqda...');
      if (typeof window.V86 === 'undefined' && typeof window.V86Starter === 'undefined') await loadScript(u.lib);
      var V = window.V86 || window.V86Starter;
      bar(.6); say('Linux yadrosi yuklanmoqda va ishga tushmoqda...');
      makeTerm();
      emu = new V({
        wasm_path: u.wasm,
        memory_size: CONFIG.memoryMB * 1024 * 1024, vga_memory_size: 2 * 1024 * 1024,
        bios: { url: u.bios }, vga_bios: { url: u.vga },
        bzimage: { url: u.kernel }, cmdline: CONFIG.cmdline,
        autostart: true, disable_keyboard: true, disable_mouse: true
      });
      var started = false;
      emu.add_listener('serial0-output-byte', function (b) {
        if (!started) { started = true; cover.style.display = 'none'; resetBtn.hidden = false; term.focus(); }
        term.write(new Uint8Array([b]));
      });
      term.onData(function (d) { emu.serial0_send(d); });
      bar(1);
      setTimeout(function () { if (!started) say('Yadro ishga tushmoqda, bir oz kuting...'); }, 4000);
      setTimeout(function () { if (!started) { cover.style.display = 'none'; term.focus(); } }, 25000);
    } catch (e) {
      prog.style.display = 'none'; startBtn.hidden = false; startBtn.disabled = false; startBtn.textContent = 'Qayta urinish';
      say('Yuklab bo‘lmadi: ' + (e && e.message ? e.message : e) + '. Internetni tekshiring yoki assets/terminal-linux.js ichidagi manzillarni almashtiring.');
    }
  }

  startBtn.addEventListener('click', boot);
  resetBtn.addEventListener('click', function () {
    try { emu && emu.destroy(); } catch (e) {}
    emu = null; cover.style.display = 'flex'; resetBtn.hidden = true; say(''); startBtn.hidden = false; startBtn.disabled = false; startBtn.textContent = 'Linuxni ishga tushirish';
    prog.style.display = 'none';
  });
})();
