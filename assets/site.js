/* Optional. The pages read fully without this file.
   It brings the current page into view in the contents, marks the section you are reading,
   names it in the narrow Contents box and closes that box when you pick a section.
   Tables and code that scroll sideways get keyboard focus.
   It also runs the theme button: System (follows the reader's system), Light or Dark. */
(function () {
  'use strict';

  /* The theme button. The head script has already applied a stored choice (data-theme on <html>). */
  var root = document.documentElement;
  var btn = document.querySelector('.theme');
  var MODES = ['system', 'light', 'dark'];
  var NAME = { system: 'System', light: 'Light', dark: 'Dark' };
  /* The ground of each theme, the same as its --bg token, for the browser's theme-color. */
  var GROUND = { light: '#ffffff', dark: '#1a1a1a' };

  function current() { return root.dataset.theme || 'system'; }
  function applyTheme(mode) {
    if (mode === 'system') delete root.dataset.theme; else root.dataset.theme = mode;
    var label = 'Theme: ' + NAME[mode];
    if (btn) {
      btn.setAttribute('aria-label', label);
      btn.title = label;
      btn.querySelectorAll('svg').forEach(function (s) { s.toggleAttribute('hidden', !s.classList.contains('i-' + mode)); });
    }
    /* Both theme-color metas take the chosen ground. For System each keeps its own scheme's colour. */
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      var dark = /dark/.test(m.media);
      m.content = GROUND[mode === 'system' ? (dark ? 'dark' : 'light') : mode];
    });
  }
  if (btn) {
    applyTheme(current());
    btn.hidden = false;
    btn.addEventListener('click', function () {
      var next = MODES[(MODES.indexOf(current()) + 1) % MODES.length];
      try {
        if (next === 'system') localStorage.removeItem('theme'); else localStorage.setItem('theme', next);
      } catch (e) { /* storage blocked: the choice lasts until the page is left */ }
      applyTheme(next);
    });
  }

  function reach() {
    document.querySelectorAll('.prose table, .prose pre').forEach(function (el) {
      if (el.scrollWidth > el.clientWidth + 1) el.tabIndex = 0; else el.removeAttribute('tabindex');
    });
  }
  reach();
  addEventListener('resize', reach);

  var toc = document.querySelector('.toc');
  var here = document.querySelector('.toc-here');
  var rail = document.querySelector('.rail');

  /* The sidebar and the open Contents list both start at the current page. */
  function show(box) {
    var at = box && box.querySelector('a[aria-current="page"]');
    if (at && at.offsetTop + 120 > box.scrollTop + box.clientHeight) box.scrollTop = at.offsetTop - 12;
  }
  show(rail);
  if (toc) {
    toc.addEventListener('toggle', function () { if (toc.open) show(toc.querySelector('nav')); });
    toc.addEventListener('click', function (e) { if (e.target.closest('nav a')) toc.open = false; });
  }

  var path = location.pathname;
  var links = Array.prototype.slice.call(document.querySelectorAll('.pages ol a')).filter(function (a) {
    return a.pathname === path && a.hash;
  });
  var heads = [];
  links.forEach(function (a) {
    var h = document.getElementById(decodeURIComponent(a.hash.slice(1)));
    if (h && heads.indexOf(h) < 0) heads.push(h);
  });
  if (!heads.length) return;

  /* Where you are: the last section heading that has passed the top of the screen. */
  var cur = null, ticking = false;
  function place() {
    ticking = false;
    var line = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 8;
    var h = null;
    for (var i = 0; i < heads.length && heads[i].getBoundingClientRect().top <= line; i++) h = heads[i];
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) h = heads[heads.length - 1];
    if (h === cur) return;
    cur = h;
    links.forEach(function (a) {
      var on = h && a.hash === '#' + h.id;
      if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      if (on && rail && rail.contains(a) && rail.scrollHeight > rail.clientHeight) {
        var top = a.offsetTop - rail.scrollTop;
        if (top < 40 || top > rail.clientHeight - 60) rail.scrollTop = a.offsetTop - rail.clientHeight / 3;
      }
    });
    if (here) here.textContent = h ? h.textContent : '';
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(place); } }, { passive: true });
  addEventListener('resize', place);
  place();
})();
