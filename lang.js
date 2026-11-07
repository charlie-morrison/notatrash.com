(function () {
  'use strict';
  var LANGS = {"en": "English", "es": "Español", "pt": "Português", "uk": "Українська"};
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
    var N = 'nav[data-langs] ', ui = d.createElement('style');
  ui.textContent =
    N + '.nl{position:relative;display:inline-block;text-align:left;vertical-align:middle}' +
    N + 'button.nl-btn{display:inline-flex;align-items:center;gap:7px;margin:0;padding:6px 10px 6px 8px;border-radius:12px;' +
      'background:rgba(0,0,0,.35);border:2px solid rgba(255,255,255,.32);color:#fff;font:inherit;font-size:15px;font-weight:600;' +
      'line-height:1.2;text-decoration:none;cursor:pointer}' +
    N + 'button.nl-btn:hover,' + N + 'button.nl-btn[aria-expanded="true"]{border-color:#38e8ff}' +
    N + '.nl-btn svg{flex:none}' + N + '.nl-car{opacity:.8;transition:transform .15s}' +
    N + 'button.nl-btn[aria-expanded="true"] .nl-car{transform:rotate(180deg)}' +
    N + '.nl-list{position:absolute;right:0;top:calc(100% + 6px);z-index:20;min-width:180px;box-sizing:border-box;padding:6px;' +
      'border-radius:14px;background:#1b1240;border:2px solid rgba(255,255,255,.3);box-shadow:0 10px 30px rgba(0,0,0,.55)}' +
    N + '.nl-list[hidden]{display:none}' +
    N + '.nl-list button[data-set]{display:block;width:100%;box-sizing:border-box;margin:0 0 5px;padding:10px 14px;border-radius:10px;' +
      'background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.18);color:#e9e6f5;font:inherit;font-size:16px;' +
      'font-weight:400;line-height:1.3;text-align:left;text-decoration:none;cursor:pointer}' +
    N + '.nl-list button[data-set]:last-child{margin-bottom:0}' +
    N + '.nl-list button[data-set]:hover{border-color:#38e8ff}' +
    N + '.nl-list button[aria-pressed="true"]{background:rgba(125,255,138,.18);border-color:#7dff8a;color:#c9ffcf;font-weight:600;cursor:default}' +
    N + 'button:focus-visible{outline:2px solid #38e8ff;outline-offset:2px}';
  (d.head || de).appendChild(ui);
  var GLOBE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9.5"/><ellipse cx="12" cy="12" rx="4" ry="9.5"/><path d="M2.5 12h19M4.2 7h15.6M4.2 17h15.6" stroke-width="1.6"/></svg>';
  var CARET = '<svg class="nl-car" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">' +
    '<path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function show(l) {
    cur = l;
    de.lang = l;
    css.textContent = '[data-l]:not([data-l="' + l + '"]){display:none!important}';
    var t = d.querySelector('title');
    if (t && t.getAttribute('data-' + l)) d.title = t.getAttribute('data-' + l);
    var bs = d.querySelectorAll('[data-langs] [data-set]');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', bs[i].getAttribute('data-set') === l ? 'true' : 'false');
    var cs = d.querySelectorAll('[data-langs] .nl-cur');
    for (var c = 0; c < cs.length; c++) { cs[c].textContent = LANGS[l]; cs[c].lang = l; }
  }

  function choose(l) {
    d.cookie = KEY + '=' + l + ';path=/;max-age=31536000;SameSite=Lax' + (location.protocol === 'https:' ? ';Secure' : '');
    if (param()) {        try { var u = new URL(location.href); u.searchParams.delete('lang'); history.replaceState(null, '', u.pathname + u.search + u.hash); } catch (e) {  }
    }
    show(l);
  }

  function setOpen(box, on) {
    var tg = box.querySelector('.nl-btn'), ls = box.querySelector('.nl-list');
    if (!tg || !ls) return;
    tg.setAttribute('aria-expanded', on ? 'true' : 'false');
    ls.hidden = !on;
  }
  function closeAll() { var bx = d.querySelectorAll('[data-langs]'); for (var i = 0; i < bx.length; i++) setOpen(bx[i], false); }

  function build(box) {
    box.textContent = '';
    var wrap = d.createElement('div'), tg = d.createElement('button'), ls = d.createElement('div');
    wrap.className = 'nl';
    tg.type = 'button';
    tg.className = 'nl-btn';
    tg.setAttribute('aria-haspopup', 'true');
    tg.setAttribute('aria-expanded', 'false');
    tg.innerHTML = GLOBE + '<span class="nl-cur"></span>' + CARET;
    tg.addEventListener('click', function (e) { e.stopPropagation(); var on = ls.hidden; closeAll(); setOpen(box, on); });
    ls.className = 'nl-list';
    ls.hidden = true;
    for (var l in LANGS) {
      if (!has(l)) continue;
      var el = d.createElement('button');
      el.type = 'button';
      el.lang = l;
      el.textContent = LANGS[l];
      el.setAttribute('data-set', l);
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        choose(this.getAttribute('data-set'));
        closeAll();
        if (e.detail === 0) tg.focus();        });
      ls.appendChild(el);
    }
    wrap.appendChild(tg);
    wrap.appendChild(ls);
    box.appendChild(wrap);
  }

  function buttons() {
    var boxes = d.querySelectorAll('[data-langs]');
    for (var b = 0; b < boxes.length; b++) build(boxes[b]);
    d.addEventListener('click', closeAll);
    d.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var o = d.querySelector('[data-langs] .nl-btn[aria-expanded="true"]');
      if (o) { closeAll(); o.focus(); }
    });
    show(cur);
  }

  show(pick());
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', buttons); else buttons();
  window.NATLang = { langs: function () { return Object.keys(LANGS); }, lang: function () { return cur; }, pick: pick };
})();
