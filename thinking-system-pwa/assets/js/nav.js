/* ============================================================
   nav.js —— 思考与判断体系 · 移动优先 PWA 交互与导航管理
   功能：Service Worker 注册、阅读进度条、移动顶栏与底栏、
         侧滑抽屉（主题/字号/本文大纲/全站导航）、触控交互增强
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. 体系页面注册表（按认知递进逻辑排列） ---------- */
  var PAGES = [
    { id: 'index',  file: 'index.html',                 nav: '全景',   short: '体系全景总览', layerTag: '完备全景', layerName: '认知大厦完备总览' },
    { id: 'meta',   file: 'metacognition.html',         nav: '元层',   short: '双轨引擎',     layerTag: 'L0 元层',   layerName: '第零层 · 双轨引擎与元认知' },
    { id: 'crit',   file: 'critical-thinking.html',     nav: '认知原则', short: '批判性思维',   layerTag: 'L1 原则',   layerName: '第一层 · 认知原则' },
    { id: 'struct', file: 'structured-engineering.html', nav: '空间解构', short: '结构化×工程化', layerTag: 'L2 解构',   layerName: '第二层 · 空间解构 ＋ 第四层 · 执行机制' },
    { id: 'system', file: 'systems-thinking.html',      nav: '动态演构', short: '系统化思维',   layerTag: 'L2 演构',   layerName: '第二层 · 动态演构与反馈回路' },
    { id: 'base',   file: 'discussion-baseline.html',   nav: '讨论机制', short: '讨论基线',     layerTag: 'L3 机制',   layerName: '第三层 · 讨论机制与共识框架' },
    { id: 'notes',  file: 'notes.html',                 nav: '执行沉淀', short: '结构化笔记',   layerTag: 'L4 执行',   layerName: '第四层 · 执行机制（沉淀实例）' },
    { id: 'judge',  file: 'judgment-system.html',       nav: '最终能力', short: '判断体系',     layerTag: 'L5 能力',   layerName: '第五层 · 个人判断体系' },
    { id: 'dialog', file: 'dialogue.html',              nav: '实战测试', short: '批判性对话',   layerTag: '应用层',   layerName: '应用层 · 真实测试场' }
  ];

  var APPENDIX_PAGES = [
    { id: 'models', file: 'mental-models.html', nav: '模型格栅', short: '思维模型格栅库', layerTag: '附录工具', layerName: '附录 · 跨学科思维模型格栅库' }
  ];

  /* 辅助查找 */
  function findPage(id) {
    for (var i = 0; i < PAGES.length; i++) {
      if (PAGES[i].id === id) return PAGES[i];
    }
    for (var j = 0; j < APPENDIX_PAGES.length; j++) {
      if (APPENDIX_PAGES[j].id === id) return APPENDIX_PAGES[j];
    }
    return PAGES[0];
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  }

  var body = document.body;
  var pageId = body.getAttribute('data-page') || 'index';
  var curPage = findPage(pageId);
  var curIdx = -1;
  for (var i = 0; i < PAGES.length; i++) {
    if (PAGES[i].id === curPage.id) { curIdx = i; break; }
  }

  /* ---------- 2. Service Worker 离线缓存注册 ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('./sw.js')
        .then(function (reg) {
          /* console.log('PWA ServiceWorker registered:', reg.scope); */
        })
        .catch(function (err) {
          console.warn('PWA ServiceWorker registration failed:', err);
        });
    });
  }

  /* PWA 安装事件监听 */
  var deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) installBtn.style.display = 'block';
  });

  /* ---------- 3. 主题与字号偏好管理 ---------- */
  var THEME_KEY = 'thinking_pwa_theme';
  var FONT_KEY = 'thinking_pwa_font';

  var currentTheme = localStorage.getItem(THEME_KEY) || 'dark';
  var currentFontSize = localStorage.getItem(FONT_KEY) || 'md';

  function applyTheme(theme) {
    currentTheme = theme;
    if (theme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem(THEME_KEY, theme);
    updateSettingsUI();
  }

  function applyFontSize(size) {
    currentFontSize = size;
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem(FONT_KEY, size);
    updateSettingsUI();
  }

  /* 初始应用偏好 */
  applyTheme(currentTheme);
  applyFontSize(currentFontSize);

  /* ---------- 4. 顶部阅读进度条 ---------- */
  var progressBar = el('div', 'reading-progress-bar');
  document.body.appendChild(progressBar);

  function updateReadingProgress() {
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      progressBar.style.width = '0%';
      return;
    }
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var pct = Math.min(100, Math.max(0, (scrolled / docHeight) * 100));
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);

  /* ---------- 5. 顶栏 (Mobile App Bar) ---------- */
  var head = el('header', 'site-head');
  var headInner = el('div', 'head-inner');

  var brandWrap = el('div', 'brand-wrap');
  if (curPage.id === 'index') {
    var brandA = el('a', 'brand-text', '<span style="color:var(--gold);font-size:18px;">✦</span> 思考与判断体系 <span class="brand-tag">PWA</span>');
    brandA.href = 'index.html';
    brandWrap.appendChild(brandA);
  } else {
    var backBtn = el('a', 'back-btn', '←');
    backBtn.href = 'index.html';
    backBtn.setAttribute('aria-label', '返回全景总览');
    brandWrap.appendChild(backBtn);

    var subTitle = el('div', 'brand-text',
      '<span>' + curPage.short + '</span><span class="brand-tag">' + curPage.layerTag + '</span>'
    );
    brandWrap.appendChild(subTitle);
  }

  var headActions = el('div', 'head-actions');

  /* 快捷字号切换按钮 */
  var fontBtn = el('button', 'icon-btn', 'A');
  fontBtn.type = 'button';
  fontBtn.title = '切换字号';
  fontBtn.setAttribute('aria-label', '切换阅读字号');
  fontBtn.addEventListener('click', function () {
    var nextFont = currentFontSize === 'sm' ? 'md' : (currentFontSize === 'md' ? 'lg' : 'sm');
    applyFontSize(nextFont);
  });

  /* 汉堡抽屉按钮 */
  var menuBtn = el('button', 'icon-btn', '☰');
  menuBtn.type = 'button';
  menuBtn.title = '展开目录与设置';
  menuBtn.setAttribute('aria-label', '展开目录与设置');
  menuBtn.addEventListener('click', function () {
    openDrawer();
  });

  headActions.appendChild(fontBtn);
  headActions.appendChild(menuBtn);

  headInner.appendChild(brandWrap);
  headInner.appendChild(headActions);
  head.appendChild(headInner);
  body.insertBefore(head, body.firstChild);

  /* ---------- 6. 侧滑抽屉 (TOC、体系章节与设置) ---------- */
  var drawerMask = el('div', 'pwa-drawer-mask');
  var drawerPanel = el('div', 'pwa-drawer-panel');

  var drawerHead = el('div', 'drawer-head',
    '<h3>体系导航与阅读设置</h3><button type="button" class="drawer-close" aria-label="关闭抽屉">×</button>'
  );
  var drawerClose = drawerHead.querySelector('.drawer-close');
  drawerClose.addEventListener('click', closeDrawer);
  drawerMask.addEventListener('click', function (e) {
    if (e.target === drawerMask) closeDrawer();
  });

  var drawerBody = el('div', 'drawer-body');

  /* PWA 安装按钮卡片（默认隐藏，触发时显示） */
  var installCard = el('div', '', 
    '<button type="button" id="pwaInstallBtn" style="display:none;width:100%;margin-bottom:16px;padding:11px;background:linear-gradient(135deg,rgba(240,168,48,0.2),rgba(56,189,248,0.2));border:1px solid var(--gold);color:var(--gold);font-weight:600;border-radius:10px;text-align:center;">' +
    '📲 安装到手机主屏幕 (PWA 离线版)' +
    '</button>'
  );
  drawerBody.appendChild(installCard);
  var pwaBtn = installCard.querySelector('#pwaInstallBtn');
  if (pwaBtn) {
    pwaBtn.addEventListener('click', function () {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function (choiceResult) {
          if (choiceResult.outcome === 'accepted') {
            pwaBtn.style.display = 'none';
          }
          deferredPrompt = null;
        });
      }
    });
  }

  /* 设置项：字号与主题 */
  var settingsSec = el('div', 'drawer-settings');
  settingsSec.innerHTML =
    '<div class="drawer-sec-title">阅读外观模式</div>' +
    '<div class="setting-btn-group" id="themeGroup">' +
      '<button type="button" class="setting-btn" data-theme-val="dark">深空深色</button>' +
      '<button type="button" class="setting-btn" data-theme-val="sepia">暖阳纸质</button>' +
      '<button type="button" class="setting-btn" data-theme-val="light">白昼明亮</button>' +
    '</div>' +
    '<div class="drawer-sec-title">正文字号大小</div>' +
    '<div class="setting-btn-group" id="fontGroup">' +
      '<button type="button" class="setting-btn" data-font-val="sm">小 (15px)</button>' +
      '<button type="button" class="setting-btn" data-font-val="md">中 (16.5px)</button>' +
      '<button type="button" class="setting-btn" data-font-val="lg">大 (18px)</button>' +
    '</div>';
  drawerBody.appendChild(settingsSec);

  /* 设置项按钮事件 */
  settingsSec.querySelectorAll('[data-theme-val]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyTheme(btn.getAttribute('data-theme-val'));
    });
  });
  settingsSec.querySelectorAll('[data-font-val]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      applyFontSize(btn.getAttribute('data-font-val'));
    });
  });

  function updateSettingsUI() {
    if (!drawerBody) return;
    drawerBody.querySelectorAll('[data-theme-val]').forEach(function (btn) {
      if (btn.getAttribute('data-theme-val') === currentTheme) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    drawerBody.querySelectorAll('[data-font-val]').forEach(function (btn) {
      if (btn.getAttribute('data-font-val') === currentFontSize) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
  updateSettingsUI();

  /* 动态提取本文大纲 (TOC) */
  var headings = document.querySelectorAll('.page-main h2, .page-main h3');
  if (headings.length > 0 && curPage.id !== 'index') {
    var tocSec = el('div', 'drawer-toc');
    var tocTitle = el('div', 'drawer-sec-title', '本篇内容大纲');
    var tocList = el('ul', 'toc-list');

    headings.forEach(function (h, hIdx) {
      if (!h.id) {
        h.id = 'sec-heading-' + hIdx;
      }
      var isH3 = h.tagName.toLowerCase() === 'h3';
      var li = el('li');
      var a = el('a', 'toc-link' + (isH3 ? ' h3' : ''), h.innerText || h.textContent);
      a.href = '#' + h.id;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
        var targetEl = document.getElementById(h.id);
        if (targetEl) {
          var yOffset = -70; // 顶栏避让
          var y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
      li.appendChild(a);
      tocList.appendChild(li);
    });

    tocSec.appendChild(tocTitle);
    tocSec.appendChild(tocList);
    drawerBody.appendChild(tocSec);
  }

  /* 体系全览章节列表 */
  var chapterSec = el('div', 'drawer-chapters');
  var chapTitle = el('div', 'drawer-sec-title', '认知体系全貌章节');
  var chapList = el('ul', 'chapter-list');

  PAGES.forEach(function (p, idx) {
    var li = el('li');
    var a = el('a', 'chapter-item' + (idx === curIdx ? ' current' : ''));
    a.href = p.file;
    a.innerHTML =
      '<span>' + p.short + '</span>' +
      '<span class="chapter-badge">' + p.layerTag + '</span>';
    li.appendChild(a);
    chapList.appendChild(li);
  });

  chapterSec.appendChild(chapTitle);
  chapterSec.appendChild(chapList);
  drawerBody.appendChild(chapterSec);

  /* 拓展附录列表 */
  var appendixSec = el('div', 'drawer-appendix');
  var appTitle = el('div', 'drawer-sec-title', '拓展认知兵器库');
  var appList = el('ul', 'chapter-list');
  var appLi = el('li');
  var appA = el('a', 'chapter-item' + (curPage.id === 'models' ? ' current' : ''));
  appA.href = 'mental-models.html';
  appA.innerHTML =
    '<span>思维模型格栅库 (44项)</span>' +
    '<span class="chapter-badge" style="color:var(--c-model);">附录库</span>';
  appLi.appendChild(appA);
  appList.appendChild(appLi);
  appendixSec.appendChild(appTitle);
  appendixSec.appendChild(appList);
  drawerBody.appendChild(appendixSec);

  drawerPanel.appendChild(drawerHead);
  drawerPanel.appendChild(drawerBody);
  drawerMask.appendChild(drawerPanel);
  body.appendChild(drawerMask);

  function openDrawer() {
    drawerMask.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawerMask.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- 7. 移动底部固定操作栏 (TabBar) ---------- */
  var bottomBar = el('nav', 'pwa-bottom-bar');
  bottomBar.setAttribute('aria-label', '移动快捷导航');
  var tabInner = el('div', 'tabbar-inner');

  if (curPage.id === 'index') {
    tabInner.innerHTML =
      '<button type="button" class="tab-item active" id="tabHome">' +
        '<span class="t-icon">❖</span><span>体系全景</span>' +
      '</button>' +
      '<button type="button" class="tab-item" id="tabHierarchy">' +
        '<span class="t-icon">🏛</span><span>六层架构</span>' +
      '</button>' +
      '<button type="button" class="tab-item" id="tabLab">' +
        '<span class="t-icon">⚡</span><span>交互实验</span>' +
      '</button>' +
      '<button type="button" class="tab-item" id="tabDocs">' +
        '<span class="t-icon">📖</span><span>全篇目录</span>' +
      '</button>';
    bottomBar.appendChild(tabInner);
    body.appendChild(bottomBar);

    var tabHome = tabInner.querySelector('#tabHome');
    var tabHierarchy = tabInner.querySelector('#tabHierarchy');
    var tabLab = tabInner.querySelector('#tabLab');
    var tabDocs = tabInner.querySelector('#tabDocs');

    if (tabHome) tabHome.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    if (tabHierarchy) tabHierarchy.addEventListener('click', function () {
      var target = document.getElementById('sec-hierarchy') || document.getElementById('hierarchy');
      if (target) {
        var y = target.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
    if (tabLab) tabLab.addEventListener('click', function () {
      var target = document.getElementById('sec-lab') || document.getElementById('lab');
      if (target) {
        var y = target.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
    if (tabDocs) tabDocs.addEventListener('click', function () {
      openDrawer();
    });
  } else if (curPage.id === 'models') {
    tabInner.innerHTML =
      '<a href="index.html" class="tab-item" id="tabHome">' +
        '<span class="t-icon">❖</span><span>体系全景</span>' +
      '</a>' +
      '<button type="button" class="tab-item" id="tabOutline">' +
        '<span class="t-icon">📑</span><span>目录/设置</span>' +
      '</button>' +
      '<button type="button" class="tab-item" id="tabTop">' +
        '<span class="t-icon">↑</span><span>回到顶部</span>' +
      '</button>' +
      '<a href="metacognition.html" class="tab-item" id="tabMain">' +
        '<span class="t-icon">→</span><span>主线第零层</span>' +
      '</a>';
    bottomBar.appendChild(tabInner);
    body.appendChild(bottomBar);

    var tabOutlineM = tabInner.querySelector('#tabOutline');
    var tabTopM = tabInner.querySelector('#tabTop');
    if (tabOutlineM) tabOutlineM.addEventListener('click', openDrawer);
    if (tabTopM) tabTopM.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  } else {
    var prevPage = PAGES[(curIdx - 1 + PAGES.length) % PAGES.length];
    var nextPage = PAGES[(curIdx + 1) % PAGES.length];

    tabInner.innerHTML =
      '<a href="' + prevPage.file + '" class="tab-item" id="tabPrev">' +
        '<span class="t-icon">←</span><span>上一章</span>' +
      '</a>' +
      '<button type="button" class="tab-item" id="tabOutline">' +
        '<span class="t-icon">📑</span><span>本文大纲</span>' +
      '</button>' +
      '<button type="button" class="tab-item" id="tabTop">' +
        '<span class="t-icon">↑</span><span>回到顶部</span>' +
      '</button>' +
      '<a href="' + nextPage.file + '" class="tab-item" id="tabNext">' +
        '<span class="t-icon">→</span><span>下一章</span>' +
      '</a>';
    bottomBar.appendChild(tabInner);
    body.appendChild(bottomBar);

    var tabOutline = tabInner.querySelector('#tabOutline');
    var tabTop = tabInner.querySelector('#tabTop');
    if (tabOutline) tabOutline.addEventListener('click', function () {
      openDrawer();
    });
    if (tabTop) tabTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 8. 面包屑导航（子页） ---------- */
  var main = document.querySelector('.page-main');
  if (main && curPage.id !== 'index') {
    var crumb = el('nav', 'crumb');
    crumb.setAttribute('aria-label', '面包屑导航');
    crumb.innerHTML =
      '<a href="index.html">体系全貌</a>' +
      '<span class="sep">/</span>' +
      '<span style="color:var(--lc);font-weight:600;">' + curPage.layerTag + '</span>' +
      '<span class="sep">/</span>' +
      '<span>' + curPage.short + '</span>';
    main.insertBefore(crumb, main.firstChild);
  }

  /* ---------- 9. 上下一页卡片式导航 (PrevNext) ---------- */
  var pnContainer = document.querySelector('.prevnext');
  if (pnContainer) {
    pnContainer.innerHTML = '';
    if (curPage.id === 'index') {
      var nextP = PAGES[1];
      var nextCard = el('a', 'next',
        '<span class="pn-lab">从基石开始阅读 · ' + nextP.layerName + ' →</span>' +
        '<span class="pn-t">' + nextP.short + '</span>'
      );
      nextCard.href = nextP.file;

      var dirCard = el('a', '',
        '<span class="pn-lab">快速导航</span>' +
        '<span class="pn-t">轻触右下角目录或右上角 ☰ 查看全部层级</span>'
      );
      dirCard.href = 'javascript:void(0);';
      dirCard.addEventListener('click', openDrawer);

      pnContainer.appendChild(dirCard);
      pnContainer.appendChild(nextCard);
    } else if (curPage.id === 'models') {
      var prevCardM = el('a', '',
        '<span class="pn-lab">← 返回全景</span>' +
        '<span class="pn-t">体系全景总览</span>'
      );
      prevCardM.href = 'index.html';

      var nextCardM = el('a', 'next',
        '<span class="pn-lab">进入体系主线 · 第零层 →</span>' +
        '<span class="pn-t">双轨引擎与元认知</span>'
      );
      nextCardM.href = 'metacognition.html';

      pnContainer.appendChild(prevCardM);
      pnContainer.appendChild(nextCardM);
    } else {
      var prevP = PAGES[(curIdx - 1 + PAGES.length) % PAGES.length];
      var nextP2 = PAGES[(curIdx + 1) % PAGES.length];

      var prevCard = el('a', '',
        '<span class="pn-lab">← 上一篇 · ' + prevP.layerTag + '</span>' +
        '<span class="pn-t">' + prevP.short + '</span>'
      );
      prevCard.href = prevP.file;

      var nextCard2 = el('a', 'next',
        '<span class="pn-lab">下一篇 · ' + nextP2.layerTag + ' →</span>' +
        '<span class="pn-t">' + nextP2.short + '</span>'
      );
      nextCard2.href = nextP2.file;

      pnContainer.appendChild(prevCard);
      pnContainer.appendChild(nextCard2);
    }
  }

  /* ---------- 10. 页脚 ---------- */
  var siteFoot = el('footer', 'site-foot',
    '<div style="font-weight:600;margin-bottom:6px;color:var(--ink-strong);">✦ 思考与判断体系 · PWA 移动版</div>' +
    '<div style="margin-bottom:8px;font-size:13.5px;color:var(--ink-2);">' +
      '不是建立一套"正确答案"，而是建立一套<b style="color:var(--gold);">能够不断产生、检验和修正答案的系统</b>' +
    '</div>' +
    '<div style="font-size:13px;display:flex;gap:12px;justify-content:center;margin-top:10px;">' +
      '<a href="index.html">返回体系全景</a> · ' +
      '<a href="javascript:void(0);" id="footOpenDrawer">全站导航与设置</a>' +
    '</div>'
  );
  var footLink = siteFoot.querySelector('#footOpenDrawer');
  if (footLink) footLink.addEventListener('click', openDrawer);
  body.appendChild(siteFoot);

  /* ---------- 11. 滚动淡入动效 (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
      reveals.forEach(function (r) { io.observe(r); });
    } else {
      reveals.forEach(function (r) { r.classList.add('in'); });
    }

    /* 针对离屏或快速滑动的兜底判定 */
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
    window.addEventListener('scroll', checkReveals, { passive: true });
    window.addEventListener('resize', checkReveals);
    if (checkReveals() > 0) {
      var poll = setInterval(function () {
        if (checkReveals() === 0) clearInterval(poll);
      }, 300);
    }
  }

  /* ---------- 12. 可点亮交互清单支持 ---------- */
  document.querySelectorAll('.check-list li').forEach(function (li) {
    li.addEventListener('click', function () {
      li.classList.toggle('lit');
      li.dispatchEvent(new CustomEvent('itemlit', {
        bubbles: true,
        detail: { lit: li.classList.contains('lit') }
      }));
    });
  });

})();
