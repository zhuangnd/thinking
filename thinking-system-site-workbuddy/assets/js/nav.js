/* ==========================================================================
   nav.js · 导航 + 微缩图同步 + 主题切换
   - 依赖 manifest.json（相对路径 assets/data/manifest.json）
   - 数据/视图分离：所有页面结构都从 manifest 渲染
   ========================================================================== */
(function () {
  'use strict';

  const ROOT = document.body.dataset.page === 'index' ? '' : 'index.html';
  const CURRENT = document.body.dataset.page || 'index';
  const MANIFEST_URL = 'assets/data/manifest.json';
  const THEME_KEY = 'tjsa_theme';

  /* ----------- 主题（先于渲染初始化，避免闪烁） ----------- */
  function initTheme() {
    let theme = localStorage.getItem(THEME_KEY);
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;
  }
  initTheme();

  function bindThemeToggle() {
    var btn = document.querySelector('.theme-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.style.colorScheme = next;
      localStorage.setItem(THEME_KEY, next);
      btn.textContent = next === 'dark' ? '☀ 亮色' : '☾ 暗色';
      // 派发主题变化，让 diagram.js 重新计算图层色
      document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
    });
    var cur0 = document.documentElement.getAttribute('data-theme') ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    btn.textContent = cur0 === 'dark' ? '☀ 亮色' : '☾ 暗色';
  }

  /* ----------- 渲染：顶栏 + 上下页 + 微缩图 ----------- */
  function renderTopbar(manifest) {
    var nav = document.querySelector('.navlinks');
    if (!nav) return;
    var links = manifest.pages.map(function (p) {
      var cls = (p.id === CURRENT || (CURRENT === 'index' && p.id === 'index')) ? 'navlink active' : 'navlink';
      var href = p.id === 'index' ? (ROOT || '#') : (ROOT ? ROOT.replace(/[^/]*$/, '') + p.id + '.html' : p.id + '.html');
      // 主页用 ROOT 作为基础
      if (document.body.dataset.page === 'index') {
        href = p.id === 'index' ? 'index.html' : p.id + '.html';
      } else {
        href = p.id === 'index' ? 'index.html' : p.id + '.html';
      }
      return '<a class="' + cls + '" href="' + href + '" data-page-id="' + p.id + '">' + p.title + '</a>';
    }).join('');
    nav.innerHTML = links;
  }

  function renderCrumbs(manifest) {
    var el = document.querySelector('[data-bind="crumbs"]');
    if (!el || CURRENT === 'index') return;
    var page = manifest.pages.find(function (p) { return p.id === CURRENT; });
    if (!page) return;
    el.innerHTML =
      '<a href="' + (document.body.dataset.page === 'index' ? 'index.html' : 'index.html') + '">主页</a>' +
      '<span class="sep">/</span>' +
      '<span>' + page.layer_label + '</span>' +
      '<span class="sep">/</span>' +
      '<span>' + page.title + '</span>';
  }

  function renderPrevNext(manifest) {
    var el = document.querySelector('.prevnext');
    if (!el || CURRENT === 'index') return;
    var page = manifest.pages.find(function (p) { return p.id === CURRENT; });
    if (!page) return;

    function linkHtml(p, kind) {
      if (!p) return '<span></span>';
      var href = p.id + '.html';
      return '<a class="pn-' + kind + '" href="' + href + '">' +
        '<span class="pn-label">' + (kind === 'prev' ? '上一篇' : '下一篇') + '</span>' +
        '<span class="pn-title">' + p.title + '</span></a>';
    }
    var prev = manifest.pages.find(function (p) { return p.id === page.prev; });
    var next = manifest.pages.find(function (p) { return p.id === page.next; });
    el.innerHTML =
      linkHtml(prev, 'prev') +
      '<a class="pn-home" href="index.html">' +
        '<span class="pn-label">返回</span>' +
        '<span class="pn-title">↩ 体系全景</span></a>' +
      linkHtml(next, 'next');
  }

  /* ----------- 微缩图（纯 SVG 子页定位） ----------- */
  function renderMinimap(manifest, currentLayerId) {
    var mm = document.querySelector('.minimap');
    if (!mm) return;

    var order = [0, 1, 2, 3, 4, 5, 'app'];
    var layers = order.map(function (id) {
      return manifest.layers.find(function (l) { return l.id === id; });
    });

    var theme = document.documentElement.getAttribute('data-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    var W = 140, H = 180;
    var layerH = 18, gap = 4, padX = 6, padY = 22;
    var svg = '';

    // title
    svg += '<svg class="minimap-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="体系位置">';

    layers.forEach(function (l, i) {
      var y = padY + i * (layerH + gap);
      var isActive = String(l.id) === String(currentLayerId);
      var isMeta = l.id === 0;
      var cls = 'mm-rect' + (isActive ? ' active' : '') + (isMeta ? ' meta' : '');
      var fill = isActive ? l.color[theme] : '';
      // 非激活时 fill 由 CSS .mm-rect 默认，颜色由 active 覆盖
      svg += '<rect class="' + cls + '" x="' + padX + '" y="' + y +
             '" width="' + (W - 2 * padX) + '" height="' + layerH +
             '" rx="3" fill="' + fill + '" />';
      svg += '<text class="mm-label' + (isActive ? ' active' : '') + '" x="' + (padX + 6) +
             '" y="' + (y + layerH / 2 + 3) + '">' + l.short + (isActive ? ' ●' : '') + '</text>';
    });

    svg += '</svg>';

    // 缓存供后续主题切换复用
    mm.innerHTML = '<div class="mm-title">当前所在层</div>' + svg;
    mm.dataset.layerId = currentLayerId;
  }

  function updateMinimapColors(manifest) {
    var mm = document.querySelector('.minimap');
    if (!mm) return;
    var theme = document.documentElement.getAttribute('data-theme') ||
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    var currentLayerId = mm.dataset.layerId;
    if (!currentLayerId) return;
    var layer = manifest.layers.find(function (l) { return String(l.id) === String(currentLayerId); });
    if (!layer) return;
    var active = mm.querySelector('.minimap-svg .mm-rect.active');
    if (active) active.setAttribute('fill', layer.color[theme]);
  }

  /* ----------- 主流程 ----------- */
  function boot() {
    fetch(MANIFEST_URL, { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('manifest fetch failed: ' + r.status);
        return r.json();
      })
      .then(function (manifest) {
        // 把 layer 色挂到 CSS 变量，让 SVG 使用
        var theme = document.documentElement.getAttribute('data-theme') ||
                    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        var root = document.documentElement;
        manifest.layers.forEach(function (l) {
          var key;
          if (l.id === 0) key = '--layerMeta';
          else if (l.id === 'app') key = '--layerApp';
          else key = '--layer' + l.id;
          root.style.setProperty(key, l.color[theme]);
        });
        root.style.setProperty('--layerCurrent', manifest.layers.find(function (l) { return l.id === 0; }).color[theme]); // 占位，会被覆盖

        renderTopbar(manifest);
        renderCrumbs(manifest);
        renderPrevNext(manifest);

        // 子页：渲染微缩图
        if (CURRENT !== 'index') {
          var page = manifest.pages.find(function (p) { return p.id === CURRENT; });
          if (page) renderMinimap(manifest, page.layer);
        }

        // 主题切换后重新着色
        document.addEventListener('themechange', function () {
          var t = document.documentElement.getAttribute('data-theme') ||
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
          manifest.layers.forEach(function (l) {
            var key;
            if (l.id === 0) key = '--layerMeta';
            else if (l.id === 'app') key = '--layerApp';
            else key = '--layer' + l.id;
            root.style.setProperty(key, l.color[t]);
          });
          updateMinimapColors(manifest);
        });

        // 通知其他脚本 manifest 已就绪
        document.dispatchEvent(new CustomEvent('manifestready', { detail: { manifest: manifest } }));
      })
      .catch(function (err) {
        console.error('[nav]', err);
        document.dispatchEvent(new CustomEvent('manifesterror', { detail: { error: err } }));
      });

    bindThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
