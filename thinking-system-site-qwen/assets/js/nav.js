/* nav.js — 站点导航 / 面包屑 / 侧栏锚点目录 / 上下页 / 微缩全景图 */
(function () {
  'use strict';

  /* 站点页面注册表：顺序即体系阅读顺序 */
  var PAGES = [
    { id: 'index',    file: 'index.html',                 nav: '主页',     short: '体系全景', cls: '',        layerKey: null, layerName: '完备版体系总览' },
    { id: 'crit',     file: 'critical-thinking.html',     nav: '认知原则', short: '批判性思维', cls: 'l1',     layerKey: 'l1', layerName: '第一层 · 认知原则' },
    { id: 'struct',   file: 'structured-engineering.html', nav: '问题处理', short: '结构化×工程化', cls: 'l2',  layerKey: 'l2', layerName: '第二层 · 问题处理' },
    { id: 'base',     file: 'discussion-baseline.html',   nav: '讨论机制', short: '讨论基线',  cls: 'l3',      layerKey: 'l3', layerName: '第三层 · 讨论机制' },
    { id: 'dialog',   file: 'dialogue.html',              nav: '对话应用', short: '批判性对话', cls: 'ld',     layerKey: 'ld', layerName: '应用层 · 对话' },
    { id: 'judge',    file: 'judgment-system.html',       nav: '最终能力', short: '判断体系',  cls: 'l5',      layerKey: 'l5', layerName: '第五层 · 最终能力' },
    { id: 'meta',     file: 'metacognition.html',         nav: '元层',     short: '双轨引擎',  cls: 'l0',      layerKey: 'l0', layerName: '第零层 · 元层' },
    { id: 'notes',    file: 'notes.html',                 nav: '沉淀实例', short: '结构化笔记', cls: 'l4',     layerKey: 'l4', layerName: '第四层 · 执行机制（沉淀实例）' }
  ];

  /* 微缩全景图层级（顺序自主页架构图） */
  var LAYERS = [
    { key: 'l0', name: '元层 · 自反制衡',   page: 'meta' },
    { key: 'l1', name: '认知原则 · 审辨',   page: 'crit' },
    { key: 'l2', name: '问题处理 · 结构化', page: 'struct' },
    { key: 'l3', name: '讨论机制 · 基线',   page: 'base' },
    { key: 'l4', name: '执行机制 · 工程化', page: 'notes' },
    { key: 'l5', name: '最终能力 · 判断体系', page: 'judge' },
    { key: 'ld', name: '对话 · 应用测试场', page: 'dialog' }
  ];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function find(id) { return PAGES.filter(function (p) { return p.id === id; })[0]; }

  var body = document.body;
  var cur = find(body.getAttribute('data-page')) || PAGES[0];
  var idx = PAGES.indexOf(cur);

  /* ---- 顶栏 ---- */
  var head = el('header', 'site-head');
  var inner = el('div', 'head-inner');
  var brand = el('a', null, '思考与判断体系<small>THINKING &amp; JUDGMENT</small>');
  brand.href = 'index.html'; brand.className = 'brand';
  var nav = el('nav', 'site-nav');
  PAGES.forEach(function (p, i) {
    var a = el('a', null, p.nav);
    a.href = p.file; a.title = p.short;
    if (i === idx) a.className = 'current' + (p.id === 'meta' ? ' dotred' : '');
    nav.appendChild(a);
  });
  inner.appendChild(brand); inner.appendChild(nav);
  head.appendChild(inner);
  body.insertBefore(head, body.firstChild);

  /* ---- 面包屑 + 侧栏目录骨架 ---- */
  var shell = document.querySelector('.page-shell');
  if (shell) {
    var crumb = el('nav', 'crumb');
    var c1 = el('a', null, '主页'); c1.href = 'index.html';
    crumb.appendChild(c1);
    crumb.appendChild(el('span', 'sep', '/'));
    crumb.appendChild(el('span', null, '<b>' + cur.layerName + '</b>'));
    crumb.appendChild(el('span', 'sep', '/'));
    crumb.appendChild(el('span', null, cur.short));
    var main = document.querySelector('.page-main');
    if (main) main.insertBefore(crumb, main.firstChild);

    /* 侧栏目录：从 .page-main 内 h2 自动生成 */
    if (!shell.classList.contains('no-side')) {
      var toc = el('aside', 'toc');
      toc.appendChild(el('div', 'toc-t', '本页导览'));
      var ol = el('ol');
      var hs = main.querySelectorAll('h2');
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 'sec-' + (i + 1);
        var li = el('li');
        var a = el('a', null, h.textContent);
        a.href = '#' + h.id;
        li.appendChild(a); ol.appendChild(li);
      });
      toc.appendChild(ol);
      shell.insertBefore(toc, main);
      /* 滚动高亮 */
      if ('IntersectionObserver' in window && hs.length) {
        var links = ol.querySelectorAll('a');
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              links.forEach(function (l) { l.parentElement.classList.remove('on'); });
              links.forEach(function (l) {
                if (l.getAttribute('href') === '#' + e.target.id) l.parentElement.classList.add('on');
              });
            }
          });
        }, { rootMargin: '-20% 0px -70% 0px' });
        hs.forEach(function (h) { io.observe(h); });
      }
    }
  }

  /* ---- 上下页 ---- */
  var foot = document.querySelector('.prevnext');
  if (foot) {
    foot.innerHTML = '';
    var prev = PAGES[(idx - 1 + PAGES.length) % PAGES.length];
    var next = PAGES[(idx + 1) % PAGES.length];
    var pa = el('a', null,
      '<span class="pn-lab">← 上一页 · ' + prev.layerName + '</span><span class="pn-t">' + prev.short + '</span>');
    pa.href = prev.file;
    var na = el('a', 'next',
      '<span class="pn-lab">下一页 · ' + next.layerName + ' →</span><span class="pn-t">' + next.short + '</span>');
    na.href = next.file;
    foot.appendChild(pa); foot.appendChild(na);
  }

  /* ---- 微缩全景图 ---- */
  var mm = el('aside', 'mini-map');
  var mmt = el('div', 'mm-t', '体系全景 <a href="index.html" title="返回全景图">↗</a>');
  mm.appendChild(mmt);
  var mol = el('ol');
  LAYERS.forEach(function (ly) {
    var p = find(ly.page);
    var li = el('li', null);
    var a = el('a', null, ly.name);
    a.href = p.file; a.title = p.short;
    if (ly.key === cur.layerKey) { li.className = 'on ' + ly.key; mm.classList.add(ly.key); }
    li.appendChild(a); mol.appendChild(li);
  });
  mm.appendChild(mol);
  body.appendChild(mm);

  /* ---- 页脚 ---- */
  var sf = el('footer', 'site-foot',
    '思考与判断体系 · 一个人如何建立能够独立面对问题、分析问题、检验问题、形成判断，并与他人高质量交流的认知系统');
  body.appendChild(sf);

  /* ---- check-list 逐条点亮（六问最小模型等可交互清单） ---- */
  document.querySelectorAll('.check-list li').forEach(function (li) {
    li.addEventListener('click', function () { li.classList.toggle('lit'); });
  });
})();
