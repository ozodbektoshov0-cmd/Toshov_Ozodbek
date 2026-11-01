/* Hacker musiqa: brauzerning o'zida (WebAudio) chalinadigan original qorong'i sintezator treki.
   Tashqi audio fayl yo'q. Ovoz faqat foydalanuvchi bosganidan keyin boshlanadi (brauzer qoidasi). */
(function () {
  'use strict';
  if (window.TOMUSIC) return;
  var AC = window.AudioContext || window.webkitAudioContext;
  var T = window.TO;

  function ls(k, d) { try { var v = localStorage.getItem('to:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem('to:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } }

  /* ---------------- trek: A minor, 104 BPM, 4 taktli sikl ---------------- */
  var BPM = 104, STEP = 60 / BPM / 4;            // 16-lik nota davomiyligi
  var ROOTS = [33, 33, 29, 31];                  // A1, A1, F1, G1 (MIDI)
  var CHORDS = [[57, 60, 64, 69], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]];  // arpedjio tovushlari
  var ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 2, 1, 3, 2, 3, 1, 2];
  var PADS = [[57, 60, 64], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
  var STEPS_PER_LOOP = 64;
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function noiseBuffer(ctx) {
    var len = ctx.sampleRate * 1, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    var seed = 1337;
    for (var i = 0; i < len; i++) { seed = (seed * 16807) % 2147483647; d[i] = (seed / 2147483647) * 2 - 1; }
    return b;
  }

  function Voice(ctx, out) {
    var noise = noiseBuffer(ctx);
    function env(g, t, a, peak, d) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    }
    return {
      kick: function (t) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
        env(g, t, 0.003, 0.9, 0.22);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + 0.3);
      },
      clap: function (t) {
        var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        s.buffer = noise; f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.9;
        env(g, t, 0.004, 0.42, 0.16);
        s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + 0.25);
      },
      hat: function (t, vol) {
        var s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        s.buffer = noise; f.type = 'highpass'; f.frequency.value = 7500;
        env(g, t, 0.002, vol, 0.04);
        s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 0.5); s.stop(t + 0.08);
      },
      bass: function (t, midi, len, cutoff) {
        var o = ctx.createOscillator(), o2 = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'sawtooth'; o2.type = 'square';
        o.frequency.value = hz(midi); o2.frequency.value = hz(midi - 12);
        f.type = 'lowpass'; f.Q.value = 7;
        f.frequency.setValueAtTime(cutoff * 2.2, t);
        f.frequency.exponentialRampToValueAtTime(cutoff * 0.7, t + len);
        env(g, t, 0.008, 0.34, len);
        o.connect(f); o2.connect(f); f.connect(g); g.connect(out);
        o.start(t); o2.start(t); o.stop(t + len + 0.1); o2.stop(t + len + 0.1);
      },
      arp: function (t, midi, vol, send) {
        var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'square'; o.frequency.value = hz(midi);
        f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(900, t + 0.16);
        env(g, t, 0.004, vol, 0.15);
        o.connect(f); f.connect(g); g.connect(out); if (send) g.connect(send);
        o.start(t); o.stop(t + 0.2);
      },
      pad: function (t, notes, len) {
        notes.forEach(function (m, i) {
          var o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
          o.type = 'sawtooth'; o.frequency.value = hz(m + 12); o.detune.value = (i - 1) * 9;
          f.type = 'lowpass'; f.frequency.value = 700;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.linearRampToValueAtTime(0.045, t + len * 0.35);
          g.gain.linearRampToValueAtTime(0.0001, t + len);
          o.connect(f); f.connect(g); g.connect(out);
          o.start(t); o.stop(t + len + 0.05);
        });
      }
    };
  }

  /* bitta 16-lik qadamni jadvalga qo'yadi (jonli va oflayn render uchun umumiy) */
  function scheduleStep(voice, send, step, t) {
    var s = step % STEPS_PER_LOOP, bar = Math.floor(s / 16), k = s % 16, loop = Math.floor(step / STEPS_PER_LOOP);
    if (k === 0) voice.pad(t, PADS[bar], STEP * 16);
    if (k === 0 || k === 8 || (k === 10 && bar % 2 === 1)) voice.kick(t);
    if (k === 4 || k === 12) voice.clap(t);
    if (k % 2 === 1) voice.hat(t, 0.05);
    else if (k % 4 === 2) voice.hat(t, 0.11);
    // bas: 8-lik notalar, filtr bar bo'yicha ochilib boradi
    if (k % 2 === 0) {
      var cut = 260 + 90 * bar + (loop % 2) * 120;
      voice.bass(t, ROOTS[bar] + (k === 6 || k === 14 ? 12 : 0), STEP * 1.8, cut);
    }
    // arpedjio: dastlabki sikl o'tgach qo'shiladi
    if (loop >= 1 || s >= 32) voice.arp(t, CHORDS[bar][ARP[k]] + (k === 15 ? 12 : 0), 0.05, send);
  }

  /* ---------------- jonli ijro ---------------- */
  var ctx = null, master = null, voice = null, send = null, timer = 0, nextT = 0, step = 0;
  var want = !!ls('music', false);          // foydalanuvchi musiqani xohlaydimi
  var vol = ls('music-vol', 0.7);
  var btn = null, pendingGesture = false;

  function build() {
    if (ctx || !AC) return !!ctx;
    ctx = new AC();
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.2;
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(comp); comp.connect(ctx.destination);
    // arpedjio uchun aks-sado
    var dl = ctx.createDelay(1), fb = ctx.createGain(), wet = ctx.createGain(), lp = ctx.createBiquadFilter();
    dl.delayTime.value = STEP * 3; fb.gain.value = 0.38; wet.gain.value = 0.55; lp.type = 'lowpass'; lp.frequency.value = 2400;
    send = ctx.createGain(); send.gain.value = 1;
    send.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(master);
    voice = Voice(ctx, master);
    return true;
  }
  function pump() {
    while (nextT < ctx.currentTime + 0.25) { scheduleStep(voice, send, step, nextT); nextT += STEP; step++; }
  }
  function run() {
    if (!ctx || timer) return;
    nextT = ctx.currentTime + 0.08; step = 0;
    pump();
    timer = setInterval(pump, 50);
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(vol * 0.9, ctx.currentTime + 2.5);   // yumshoq kirish
  }
  function halt() {
    if (!ctx || !timer) return;
    clearInterval(timer); timer = 0;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }
  function paint() {
    if (!btn) return;
    var playing = !!(ctx && ctx.state === 'running' && timer && want);
    btn.setAttribute('aria-pressed', want ? 'true' : 'false');
    btn.classList.toggle('waiting', want && !playing);
    btn.title = want ? (playing ? 'Musiqani o‘chirish' : 'Musiqa tayyor: istalgan joyga bosing') : 'Musiqani yoqish';
  }

  function start() {
    want = true; lsSet('music', true);
    if (!AC) { if (T) T.toast('Brauzeringiz musiqani qo‘llab-quvvatlamaydi'); paint(); return; }
    build();
    var go = function () { if (want) { run(); paint(); } };
    if (ctx.state === 'running') go();
    else ctx.resume().then(go, function () { waitGesture(); paint(); });
    // resume() ba'zan hal bo'lmay turadi: bosish kelmaguncha kutamiz
    setTimeout(function () { if (want && ctx && ctx.state !== 'running') waitGesture(); }, 400);
    paint();
  }
  function stop() { want = false; lsSet('music', false); halt(); paint(); }
  function toggle() { if (want && timer) stop(); else start(); }

  function waitGesture() {
    if (pendingGesture) return;
    pendingGesture = true;
    var ev = ['pointerdown', 'keydown', 'touchstart'];
    var fn = function () {
      ev.forEach(function (e) { window.removeEventListener(e, fn, true); });
      pendingGesture = false;
      if (want) start();
    };
    ev.forEach(function (e) { window.addEventListener(e, fn, true); });
  }

  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (want) ctx.resume();
  });

  /* ---------------- tugma ---------------- */
  var css = document.createElement('style');
  css.textContent =
    '#music-btn{font-family:var(--font-head,monospace);font-size:.95rem;font-weight:700}' +
    '#music-btn[aria-pressed="true"]{color:var(--accent,var(--neon,#0f6));border-color:var(--accent,var(--neon,#0f6))}' +
    '#music-btn.waiting{animation:mpulse 1.2s ease-in-out infinite}' +
    '@keyframes mpulse{50%{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent,var(--neon,#0f6)) 40%,transparent)}}' +
    '#intro{position:fixed;inset:0;z-index:200;background:radial-gradient(circle at 50% 40%,#08142c,#02040c 70%);display:grid;place-items:center;padding:24px;text-align:center;font-family:var(--font-head,sans-serif);color:var(--text,#e8edf7)}' +
    '#intro .box{max-width:520px;width:100%;display:grid;justify-items:center;gap:14px}' +
    '#intro .emblem{--es:min(190px,52vw)}' +
    '#intro h1{font-size:clamp(1rem,3.4vw,1.25rem);margin:6px 0 0;letter-spacing:.22em;text-transform:uppercase;font-weight:700}' +
    '#intro p.s{color:var(--muted,#9aa8c0);margin:0;font-size:.92rem;max-width:42ch}' +
    '#intro .go{font:inherit;font-weight:800;letter-spacing:.2em;font-size:1.15rem;padding:16px 56px;border-radius:999px;cursor:pointer;color:#02040c;background:var(--accent,#29b6f6);border:0;box-shadow:0 0 38px color-mix(in srgb,var(--accent,#29b6f6) 70%,transparent)}' +
    '#intro .tiny{font-size:.7rem;letter-spacing:.3em;color:var(--muted,#9aa8c0)}' +
    '#intro .no{font:inherit;background:none;border:0;color:var(--muted,#9aa8c0);text-decoration:underline;cursor:pointer;font-size:.85rem}' +
    '#intro button:focus-visible{outline:3px solid #fff;outline-offset:3px}';
  document.head.appendChild(css);

  function mountButton() {
    var nav = document.getElementById('nav'), hx = document.getElementById('hx');
    btn = document.createElement('button');
    btn.id = 'music-btn'; btn.type = 'button'; btn.textContent = '♪';
    btn.setAttribute('aria-label', 'Hacker musiqani yoqish yoki o‘chirish');
    if (nav) { btn.className = 'icon-btn'; nav.insertBefore(btn, document.getElementById('fx-btn') || nav.lastChild); }
    else if (hx) { hx.appendChild(btn); }
    else { btn.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:60;padding:8px 12px'; document.body.appendChild(btn); }
    btn.addEventListener('click', toggle);
    paint();
  }

  /* ---------------- kirish ekrani (bosh sahifada, har sessiyada bir marta) ---------------- */
  function intro() {
    var seen = false;
    try { seen = sessionStorage.getItem('to:entered') === '1'; } catch (e) { /* ignore */ }
    if (seen || document.body.getAttribute('data-page') !== 'home') return;
    var el = document.createElement('div');
    el.id = 'intro'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Saytga kirish');
    el.innerHTML = '<div class="box"><div class="emblem"><div class="ring"></div><div class="core"><span>TO</span></div></div>' +
      '<h1>Toshov Ozodbek</h1><p class="s" id="intro-pl">Sayt ovozli kirish bilan ochiladi. Musiqani yuqoridagi ♪ tugmasi bilan o‘chirish mumkin.</p>' +
      '<button class="go" type="button" id="intro-go">▶ START</button><div class="tiny">ENTER THE SYSTEM</div>' +
      '<button class="no" type="button" id="intro-no">musiqasiz kirish</button></div>';
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    var tt = 0;
    function close(withMusic) {
      clearInterval(tt);
      try { sessionStorage.setItem('to:entered', '1'); } catch (e) { /* ignore */ }
      if (withMusic) start(); else if (want) stop();
      el.remove(); document.body.style.overflow = '';
    }
    document.getElementById('intro-go').addEventListener('click', function () { close(true); });
    document.getElementById('intro-no').addEventListener('click', function () { close(false); });
    el.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(false); });
    document.getElementById('intro-go').focus();
  }

  window.TOMUSIC = {
    start: start, stop: stop, toggle: toggle,
    isOn: function () { return want && !!timer; },
    _test: { scheduleStep: scheduleStep, Voice: Voice, STEP: STEP, STEPS_PER_LOOP: STEPS_PER_LOOP, ctx: function () { return ctx; }, analyse: function () {
      if (!ctx || !master) return null;
      var a = ctx.createAnalyser(); a.fftSize = 2048; master.connect(a);
      return a;
    } }
  };

  mountButton();
  intro();
  if (want) { build(); if (ctx) { ctx.resume().then(function () { if (want) { run(); paint(); } }, function () {}); waitGesture(); } }
  paint();
})();
