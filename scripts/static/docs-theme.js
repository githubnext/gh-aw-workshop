(function () {
  var THEME_KEY = 'workshop-color-mode';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-mode', theme);
    var buttons = document.querySelectorAll('[data-theme]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', buttons[i].dataset.theme === theme ? 'true' : 'false');
    }
  }

  var stored = localStorage.getItem(THEME_KEY);
  applyTheme(stored === 'light' || stored === 'dark' ? stored : 'auto');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-theme]');
    if (!btn) return;
    var theme = btn.dataset.theme;
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  });
}());
