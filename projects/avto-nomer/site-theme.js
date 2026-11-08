/* Toshov Ozodbek sayti mavzusi: asosiy sayt bilan umumiy (ko'k / night) */
(function () {
  var root = document.documentElement;
  function saved() { try { return JSON.parse(localStorage.getItem('to:theme')) === 'night'; } catch (e) { return false; } }
  function save(n) { try { localStorage.setItem('to:theme', JSON.stringify(n ? 'night' : 'blue')); } catch (e) {} }
  function apply(n) {
    if (n) root.setAttribute('data-theme', 'night'); else root.removeAttribute('data-theme');
    if (document.body) document.body.classList.toggle('night-mode', n);
  }
  function init() {
    apply(saved());
    // loyihaning o'z "night" tugmasi bo'lsa, tanlov sayt bilan umumiy saqlanadi
    var last = document.body.classList.contains('night-mode');
    new MutationObserver(function () {
      var n = document.body.classList.contains('night-mode');
      if (n === last) return; last = n;
      if (n) root.setAttribute('data-theme', 'night'); else root.removeAttribute('data-theme');
      save(n);
    }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    var a = document.createElement('a');
    a.id = 'to-back'; a.href = '../../tools.html'; a.textContent = '← Asboblar';
    a.addEventListener('click', function () { try { sessionStorage.setItem('toshov_ozodbek_return_from_tool', '1'); } catch (e) {} });
    document.body.appendChild(a);
  }
  if (saved()) root.setAttribute('data-theme', 'night');
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
