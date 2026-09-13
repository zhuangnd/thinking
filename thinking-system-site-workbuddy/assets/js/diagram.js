/* ==========================================================================
   diagram.js · 主页全景图渲染 + 表格行 hover 联动
   完全由 manifest 驱动：增删层只需改 manifest
   ========================================================================== */
(function () {
  'use strict';

  var W = 860, H = 1180;
  // 层渲染顺序与展示字段（label/href/brief）全部从 manifest.layers 读；
  // 这里只保留渲染顺序（manifest 里没有强制 ordering，故在此固定）。
  var layerOrder = [0, 1, 2, 3, 4, 5, 'app'];

  function buildSvg(manifest) {
    var layers = layerOrder.map(function (id) {
      return manifest.layers.find(function (l) { return l.id === id; });
    });

    // 几何常量：所有层等高（metaH = normalH）；元层"视觉降阶"靠虚线 + 暖灰描边，
    // 不靠缩短层高，避免层与层之间出现参差。
    var layout = {
      titleY: 30,
      bandX: 14,
      bandMargin: 10,                  // 色带距层块上下各留 10px
      rectX: 50, rectW: 740,
      rectGap: 28,
      firstY: 80,
      layerH: 64
    };

    var svg = '';
    svg += '<svg class="dg-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="思考与判断体系全景图">';

    // 标题
    svg += '<text class="dg-title" x="' + (W / 2) + '" y="' + layout.titleY +
           '" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="14" fill="currentColor" opacity="0.5">体系总图（点击进入主题）</text>';

    // 批判性思维贯穿色带（高度后续按实际层块范围动态计算）
    var bandTop = layout.firstY - layout.bandMargin;
    svg += '<rect class="dg-band-line" x="' + layout.bandX + '" y="' + bandTop +
           '" width="12" height="100" rx="6" />';
    svg += '<text class="dg-band-label" x="' + (layout.bandX + 22) +
           '" y="' + (bandTop - 8) +
           '" font-family="-apple-system, sans-serif">批判性思维 · 贯穿全程</text>';

    // 层块
    var y = layout.firstY;
    var layerYs = {};
    var layerBottoms = {};
    layers.forEach(function (layer, idx) {
      var isMeta = layer.id === 0;
      var h = layout.layerH;
      var layerLabel = layer.label || layer.name || ('层 ' + layer.id);
      var layerHref = layer.href || ('#' + layer.id);
      var layerBrief = layer.brief || layer.core || '';

      layerYs[layer.id] = y;
      layerBottoms[layer.id] = y + h;

      svg += '<a class="dg-layer-link dg-layer-' + layer.id + '" href="' + layerHref +
             '" data-layer-id="' + layer.id +
             '" aria-label="' + layerLabel + '：' + layerBrief + '">';
      svg += '<rect class="dg-rect" x="' + layout.rectX + '" y="' + y +
             '" width="' + layout.rectW + '" height="' + h + '" rx="12" />';

      // 第零层（虚线描边）——通过 CSS class dg-meta-dash 控制颜色与样式，
      // 不在 SVG inline attribute 中写 var() 以规避跨浏览器支持差异。
      if (isMeta) {
        svg += '<line class="dg-meta-dash" x1="' + (layout.rectX + 10) + '" y1="' + (y + h + 4) +
               '" x2="' + (layout.rectX + 30) + '" y2="' + (y + h + 4) + '" />';
      }

      svg += '<text class="dg-no" x="' + (layout.rectX + 24) + '" y="' + (y + 22) +
             '" font-family="-apple-system, sans-serif">' + layerLabel + '</text>';

      var titleY = y + h / 2 + 5;
      svg += '<text class="dg-name" x="' + (layout.rectX + 24) + '" y="' + titleY +
             '" font-family="-apple-system, sans-serif">' + escapeXml(layerBrief) + '</text>';

      svg += '<text class="dg-go" x="' + (layout.rectX + layout.rectW - 24) + '" y="' + (y + 22) +
             '" text-anchor="end" font-family="-apple-system, sans-serif">进入 →</text>';

      svg += '</a>';

      // 箭头：起点 = 当前层 bottom + 4，终点 = 下一层 top - 4，居中放 ▼
      // 注意：下一层 top = 当前 y + h + rectGap，不能用 layerYs[nextId]，
      // 因为 layerYs 在每次循环末尾才写入。
      if (idx < layers.length - 1) {
        var nextTop = y + h + layout.rectGap;
        var arrowY1 = y + h + 4;
        var arrowY2 = nextTop - 4;
        var arrowYMid = (arrowY1 + arrowY2) / 2 + 5;

        svg += '<line class="dg-arrow" data-from-layer="' + layer.id +
               '" x1="' + (W / 2) + '" y1="' + arrowY1 +
               '" x2="' + (W / 2) + '" y2="' + arrowY2 + '" />';
        svg += '<text class="dg-arrow-text" data-from-layer="' + layer.id +
               '" x="' + (W / 2) + '" y="' + arrowYMid +
               '" text-anchor="middle" font-family="-apple-system, sans-serif">▼</text>';
      }

      y += h + layout.rectGap;
    });

    // 回路（从应用层右侧外 → 绕下方 → 回到元层左侧）
    var lastY = layerYs['app'] + layout.layerH;
    var metaY = layerYs[0];
    var bandBottom = lastY + layout.bandMargin;

    // 把色带高度更新为实际范围（前面先用占位 100，现在覆盖）
    var bandIdx = svg.indexOf('class="dg-band-line"');
    if (bandIdx !== -1) {
      var bandMarker = '<rect class="dg-band-line" x="' + layout.bandX + '" y="' + bandTop +
        '" width="12" height="' + (bandBottom - bandTop) + '" rx="6" />';
      svg = svg.replace(
        new RegExp('<rect class="dg-band-line" x="' + layout.bandX + '" y="' + bandTop + '" width="12" height="\\d+" rx="6" />'),
        bandMarker
      );
    }

    // 回路起点 = 应用层矩形右侧外 10px（不再用 W-80=780，避免侵入矩形内部）
    svg += '<path class="dg-loop-line" d="M ' + (layout.rectX + layout.rectW + 10) + ' ' + (lastY + 6) +
           ' C ' + (W - 30) + ' ' + (lastY + 80) + ', ' + (W - 30) + ' ' + (H - 120) +
           ', ' + (W / 2 + 80) + ' ' + (H - 80) +
           ' L 80 ' + (H - 80) +
           ' C 30 ' + (H - 120) + ', 30 ' + (metaY + 40) + ', 30 ' + (metaY + 12) + '" />';
    svg += '<text class="dg-loop-label" x="' + (W / 2) + '" y="' + (H - 50) +
           '" text-anchor="middle" font-family="-apple-system, sans-serif">' +
           '↺ 持续迭代 · 反馈 / 反证 / 修正 · 回到元层重新自检</text>';

    svg += '</svg>';
    return { svg: svg, layerYs: layerYs };
  }

  function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  /* ----------- 渲染 ---------- */
  function render(manifest) {
    var host = document.querySelector('.diagram');
    if (!host) return;

    var out = buildSvg(manifest);
    host.insertAdjacentHTML('beforeend', out.svg);

    // 折叠/展开元层（元层 + 它对应的箭头同步切换）
    var btn = document.getElementById('dgToggleMeta');
    function setMetaVisible(visible) {
      var metaLink = host.querySelector('.dg-layer-0');
      if (!metaLink) return;
      metaLink.style.display = visible ? '' : 'none';
      // idx=0 那条箭头与 idx=0 层绑定，data-from-layer="0"
      var arrows = host.querySelectorAll('[data-from-layer="0"]');
      arrows.forEach(function (a) { a.style.display = visible ? '' : 'none'; });
      btn.textContent = visible ? '折叠元层' : '展开元层';
    }
    if (btn) {
      // 默认折叠元层（metaLink.dataset.collapsed === '1' 也表示折叠）
      setMetaVisible(false);
      btn.addEventListener('click', function () {
        var metaLink = host.querySelector('.dg-layer-0');
        if (!metaLink) return;
        var isCurrentlyVisible = metaLink.style.display !== 'none';
        setMetaVisible(!isCurrentlyVisible);
      });
    }

    bindTableHover(host, manifest);
  }

  /* ----------- 表格行 hover 联动 ----------- */
  function bindTableHover(host, manifest) {
    var rows = document.querySelectorAll('table.tbl tr[data-layer]');
    rows.forEach(function (row) {
      var layerId = row.dataset.layer;
      row.addEventListener('mouseenter', function () {
        host.querySelectorAll('.dg-layer-link').forEach(function (l) {
          l.classList.remove('focus');
          l.classList.add('dim');
        });
        var target = host.querySelector('.dg-layer-' + layerId + ', .dg-layer-' + (layerId === 'app' ? 'app' : layerId));
        if (target) {
          target.classList.remove('dim');
          target.classList.add('focus');
        }
      });
      row.addEventListener('mouseleave', function () {
        host.querySelectorAll('.dg-layer-link').forEach(function (l) {
          l.classList.remove('dim', 'focus');
        });
      });
      row.addEventListener('click', function () {
        // 点击表格行跳转（如果不是 anchor）
        var a = document.querySelector('a.dg-layer-' + layerId);
        if (a) window.location.href = a.getAttribute('href');
      });
      row.setAttribute('title', '点击查看 ' + manifest.layers.find(function (l) { return String(l.id) === String(layerId); }).name);
    });
  }

  /* ----------- 启动 ----------- */
  document.addEventListener('manifestready', function (e) {
    if (document.body.dataset.page !== 'index') return;
    render(e.detail.manifest);
  });

  document.addEventListener('manifesterror', function () {
    var host = document.querySelector('.diagram');
    if (host) host.insertAdjacentHTML('beforeend',
      '<p style="color:var(--c-accent);text-align:center;padding:32px">' +
      '⚠ 全景图数据加载失败（manifest.json 无法获取）。请检查网络或直接打开<a href="critical-thinking.html">子页</a>。' +
      '</p>');
  });
})();
