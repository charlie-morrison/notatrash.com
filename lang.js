(function () {
  'use strict';
  var LANGS = {"en": "English", "uk": "Українська"};
  var DEF = 'en', KEY = 'nat_lang', d = document, de = d.documentElement, cur = DEF;

  function has(l) { return Object.prototype.hasOwnProperty.call(LANGS, l); }
  function norm(l) { return String(l || '').toLowerCase().split('-')[0]; }
  function param() { try { return norm(new URLSearchParams(location.search).get('lang')); } catch (e) { return ''; } }
  function saved() { var m = /(?:^|;\s*)nat_lang=([a-z]+)/.exec(d.cookie || ''); return m ? m[1] : ''; }

  function pick() {
    var want = [param(), saved()];
    try {
      var n = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
      for (var i = 0; i < n.length; i++) want.push(norm(n[i]));
    } catch (e) {  }
    for (var j = 0; j < want.length; j++) if (has(want[j])) return want[j];
    return DEF;
  }

  var css = d.createElement('style');
  (d.head || de).appendChild(css);

  function show(l) {
    cur = l;
    de.lang = l;
    css.textContent = '[data-l]:not([data-l="' + l + '"]){display:none!important}';
    var t = d.querySelector('title');
    if (t && t.getAttribute('data-' + l)) d.title = t.getAttribute('data-' + l);
    var bs = d.querySelectorAll('[data-langs] button');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-set') === l ? 'true' : 'false');
  }

  function choose(l) {
    d.cookie = KEY + '=' + l + ';path=/;max-age=31536000;SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    if (param()) {        try { var u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) {  }
    }
    show(l);
  }

  function buttons() {
    var boxes = d.querySelectorAll('[data-langs]');
    for (var b = 0; b < boxes.length; b++) {
      boxes[b].textContent = '';
      for (var l in LANGS) {
        if (!has(l)) continue;
        var el = d.createElement('button');
        el.type = 'button';
        el.lang = l;
        el.textContent = LANGS[l];
        el.setAttribute('data-set', l);
        el.addEventListener('click', function () { choose(this.getAttribute('data-set')); });
        boxes[b].appendChild(el);
      }
    }
    show(cur);
  }

  show(pick());
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', buttons); else buttons();
  window.NATLang = { langs: function () { return Object.keys(LANGS); }, lang: function () { return cur; }, pick: pick };
})();
