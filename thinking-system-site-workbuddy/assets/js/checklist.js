/* ==========================================================================
   checklist.js · 六问最小清单的可点击点亮
   - localStorage 持久化（按 slug 分键）
   ========================================================================== */
(function () {
  'use strict';
  var SLUG = document.body.dataset.page || 'checklist';
  var KEY = 'checklist_' + SLUG;

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch (_) { return {}; }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  var items = document.querySelectorAll('.checklist li');
  if (!items.length) return;

  var state = load();
  items.forEach(function (li, idx) {
    if (state[idx]) li.classList.add('checked');
    li.addEventListener('click', function () {
      li.classList.toggle('checked');
      state[idx] = li.classList.contains('checked');
      save(state);
    });
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    li.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });
  });
})();
