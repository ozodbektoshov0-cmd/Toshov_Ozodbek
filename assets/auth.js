/* Google bilan kirish + kirishlarni Firestore'ga yozish (Firebase sozlanganda ishlaydi) */
(function () {
  'use strict';
  var F = window.TO_FIREBASE, ok = F && F.config && F.config.apiKey;
  var V = '10.12.2', root = document.body.getAttribute('data-root') || '';
  window.TOAUTH = { ready: false, user: null, db: null, auth: null, admin: false, onChange: [] };
  if (!ok) return;
  function load(u) { return new Promise(function (a, b) { var s = document.createElement('script'); s.src = u; s.onload = a; s.onerror = b; document.head.appendChild(s); }); }
  function parse() {
    var ua = navigator.userAgent, b = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Boshqa';
    var o = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Boshqa';
    return { browser: b + ' / ' + o, device: /Mobi|Android|iPhone/.test(ua) ? 'Telefon' : 'Kompyuter' };
  }
  Promise.all([load('https://www.gstatic.com/firebasejs/' + V + '/firebase-app-compat.js')]).then(function () {
    return Promise.all([load('https://www.gstatic.com/firebasejs/' + V + '/firebase-auth-compat.js'), load('https://www.gstatic.com/firebasejs/' + V + '/firebase-firestore-compat.js')]);
  }).then(function () {
    firebase.initializeApp(F.config);
    var A = window.TOAUTH; A.auth = firebase.auth(); A.db = firebase.firestore(); A.ready = true;
    A.login = function () { return A.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()); };
    A.logout = function () { return A.auth.signOut(); };
    A.auth.onAuthStateChanged(function (u) {
      A.user = u; A.admin = !!(u && F.ADMIN_EMAIL && u.email === F.ADMIN_EMAIL);
      var b = document.getElementById('login-btn');
      if (b) b.textContent = u ? (u.displayName || u.email).split(' ')[0] + ' ✕' : 'Kirish';
      A.onChange.forEach(function (f) { f(u); });
      if (u && !sessionStorage.getItem('to:logged')) {
        sessionStorage.setItem('to:logged', '1');
        var p = parse(), rec = { uid: u.uid, name: u.displayName || '', email: u.email || '', device: p.device, browser: p.browser, at: firebase.firestore.FieldValue.serverTimestamp(), ip: '', place: '' };
        // IP va shahar: ipapi.co orqali (kirish sahifasidagi rozilik matni bilan)
        fetch('https://ipapi.co/json/').then(function (r) { return r.json(); }).then(function (j) { rec.ip = j.ip || ''; rec.place = [j.country_name, j.city].filter(Boolean).join(', '); }).catch(function () {}).then(function () {
          A.db.collection('logins').add(rec);
          A.db.collection('users').doc(u.uid).set({ name: rec.name, email: rec.email, ip: rec.ip, place: rec.place, device: rec.device, browser: rec.browser, last: rec.at }, { merge: true });
        }).catch(function () {});
      }
    });
    var nav = document.getElementById('nav');
    if (nav && !document.getElementById('login-btn')) {
      var b = document.createElement('button'); b.id = 'login-btn'; b.className = 'icon-btn'; b.type = 'button'; b.textContent = 'Kirish'; b.style.width = 'auto'; b.style.padding = '0 12px';
      b.onclick = function () { if (A.user) A.logout(); else if (confirm('Google bilan kirsangiz, ismingiz, emailingiz, IP manzilingiz, qurilmangiz va brauzeringiz kirishlar jadvaliga yoziladi. Rozimisiz?')) A.login(); };
      nav.insertBefore(b, document.getElementById('fx-btn'));
    }
  }).catch(function () {});
})();
