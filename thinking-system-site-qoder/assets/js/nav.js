/* ============================================================
   nav.js —— 站点导航 / 面包屑 / 上下页 / 汉堡菜单 /
   滚动渐显 / 可点亮清单（认知星座 · Qoder 版）
   ============================================================ */
(function () {
  'use strict';

  /* 站点页面注册表：顺序即体系阅读顺序 */
  var PAGES = [
    { id: 'index',  file: 'index.html',                 nav: '全景',   short: '认知星座全景', layerName: '完备版体系总览' },
    { id: 'crit',   file: 'critical-thinking.html',     nav: '认知原则', short: '批判性思维',   layerName: '第一层 · 认知原则' },
    { id: 'struct', file: 'structured-engineering.html', nav: '问题处理', short: '结构化×工程化', layerName: '第二层 · 问题处理 ＋ 第四层 · 执行机制' },
    { id: 'base',   file: 'discussion-baseline.html',   nav: '讨论机制', short: '讨论基线',     layerName: '第三层 · 讨论机制' },
    { id: 'dialog', file: 'dialogue.html',              nav: '对话应用', short: '批判性对话',   layerName: '应用层 · 对话' },
    { id: 'judge',  file: 'judgment-system.html',       nav: '最终能力', short: '判断体系',     layerName: '第五层 · 最终能力' },
    { id: 'meta',   file: 'metacognition.html',         nav: '元层',    short: '双轨引擎',      layerName: '第零层 · 元层' },
    { id: 'notes',  file: 'notes.html',                 nav: '沉淀实例', short: '结构化笔记',   layerName: '第四层 · 执行机制（沉淀实例）' }
  ];

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function find(id) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].id === id) return PAGES[i];
    return PAGES[0];
  }

  var body = document.body;
  var cur = find(body.getAttribute('data-page'));
  var idx = PAGES.indexOf(cur);

  /* ---------- 顶栏 ---------- */
  var head = el('header', 'site-head');
  var inner = el('div', 'head-inner');
  var brand = el('a', 'brand', '<span class="star">✦</span>思考与判断体系<small>COGNITIVE CONSTELLATION</small>');
  brand.href = 'index.html';
  var nav = el('nav', 'site-nav');
  nav.setAttribute('aria-label', '站点导航');
  PAGES.forEach(function (p, i) {
    var a = el('a', null, p.nav);
    a.href = p.file; a.title = p.short;
    if (i === idx) a.className = 'current';
    nav.appendChild(a);
  });
  var burger = el('button', 'nav-burger', '☰');
  burger.type = 'button';
  burger.setAttribute('aria-label', '展开导航');
  burger.addEventListener('click', function () { nav.classList.toggle('open'); });
  inner.appendChild(brand);
  inner.appendChild(burger);
  inner.appendChild(nav);
  head.appendChild(inner);
  body.insertBefore(head, body.firstChild);

  /* ---------- 面包屑（子页） ---------- */
  var main = document.querySelector('.page-main');
  if (main && cur.id !== 'index') {
    var crumb = el('nav', 'crumb');
    crumb.setAttribute('aria-label', '面包屑');
    var c1 = el('a', null, '认知星座'); c1.href = 'index.html';
    crumb.appendChild(c1);
    crumb.appendChild(el('span', 'sep', '/'));
    crumb.appendChild(el('span', null, '<b>' + cur.layerName + '</b>'));
    crumb.appendChild(el('span', 'sep', '/'));
    crumb.appendChild(el('span', null, cur.short));
    main.insertBefore(crumb, main.firstChild);
  }

  /* ---------- 上下页 ---------- */
  var foot = document.querySelector('.prevnext');
  if (foot) {
    foot.innerHTML = '';
    if (idx === 0) {
      /* 主页：下一页入口 */
      var next = PAGES[1];
      var na = el('a', 'next',
        '<span class="pn-lab">从第一颗星开始 · ' + next.layerName + ' →</span><span class="pn-t">' + next.short + '</span>');
      na.href = next.file;
      var pa = el('a', null, '<span class="pn-lab">提示</span><span class="pn-t">拖拽星图 · 滚轮缩放 · 点击节点 · 双击进入</span>');
      pa.href = '#constCanvas';
      foot.appendChild(pa); foot.appendChild(na);
    } else {
      var prev = PAGES[(idx - 1 + PAGES.length) % PAGES.length];
      var nx = PAGES[(idx + 1) % PAGES.length];
      var pa2 = el('a', null,
        '<span class="pn-lab">← 上一站 · ' + prev.layerName + '</span><span class="pn-t">' + prev.short + '</span>');
      pa2.href = prev.file;
      var na2 = el('a', 'next',
        '<span class="pn-lab">下一站 · ' + nx.layerName + ' →</span><span class="pn-t">' + nx.short + '</span>');
      na2.href = nx.file;
      foot.appendChild(pa2); foot.appendChild(na2);
    }
  }

  /* ---------- 页脚 ---------- */
  var sf = el('footer', 'site-foot',
    '<div>✦ 思考与判断体系 · 认知星座版</div>' +
    '<div>不是建立一套"正确答案"，而是建立一套<b style="color:#F0A830">能够不断产生、检验和修正答案的系统</b></div>' +
    '<div><a href="index.html">返回星座全景</a></div>');
  body.appendChild(sf);

  /* ---------- 滚动渐显 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      reveals.forEach(function (r) { io.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add('in'); });
    }
    /* 兜底：某些环境（无头虚拟时钟等）IntersectionObserver 与 scroll 事件均不触发，
       用轻量定时轮询补位；全部点亮后自动停止 */
    function checkReveals() {
      var pending = 0;
      reveals.forEach(function (r) {
        if (!r.classList.contains('in') && r.getBoundingClientRect().top < window.innerHeight * 0.95) {
          r.classList.add('in');
        }
        if (!r.classList.contains('in')) pending++;
      });
      return pending;
    }
    window.addEventListener('scroll', function () { checkReveals(); }, { passive: true });
    window.addEventListener('resize', function () { checkReveals(); });
    if (checkReveals() > 0) {
      var poll = setInterval(function () {
        if (checkReveals() === 0) clearInterval(poll);
      }, 250);
    }
  }

  /* ---------- 可点亮清单（通用） ---------- */
  document.querySelectorAll('.check-list li').forEach(function (li) {
    li.addEventListener('click', function () {
      li.classList.toggle('lit');
      li.dispatchEvent(new CustomEvent('itemlit', { bubbles: true, detail: { lit: li.classList.contains('lit') } }));
    });
  });
})();
