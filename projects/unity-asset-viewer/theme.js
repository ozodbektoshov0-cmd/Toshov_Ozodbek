(function () {
  try { if (JSON.parse(localStorage.getItem('to:theme')) === 'night') document.documentElement.setAttribute('data-theme', 'night'); } catch (e) {}
  var a = document.createElement('a');
  a.id = 'back'; a.href = '../../tools.html'; a.textContent = '← Asboblar';
  document.body.appendChild(a);
})();
