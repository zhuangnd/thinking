/* ==========================================================================
   tabs.js · 三语境切换（dialogue.html 专用）
   ========================================================================== */
(function () {
  'use strict';
  var btns = document.querySelectorAll('.tabs .tab-btn');
  if (!btns.length) return;

  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tab = btn.dataset.tab;
      btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.querySelectorAll('.tab-panel').forEach(function (p) {
        p.classList.toggle('active', p.dataset.panel === tab);
      });
    });
  });
})();
