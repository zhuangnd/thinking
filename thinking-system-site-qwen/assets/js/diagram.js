/* diagram.js — 主页全景架构图交互：默认折叠六层骨架，展开显示各层细节 */
(function () {
  'use strict';
  var diagram = document.getElementById('diagram');
  var btn = document.getElementById('dgToggle');
  if (!diagram || !btn) return;

  btn.addEventListener('click', function () {
    var open = diagram.classList.toggle('expanded');
    btn.textContent = open ? '收起各层细节' : '展开各层细节';
  });
})();
