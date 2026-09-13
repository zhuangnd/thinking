/* ==========================================================================
   diagram.js · 主页全景图渲染 + 表格行 hover 联动
   完全由 manifest 驱动：增删层只需改 manifest
   ========================================================================== */
(function () {
  'use strict';

  var W = 860;
  // 层渲染顺序（manifest 里没有强制 ordering，故在此固定）。
  var fullOrder = [0, 1, 2, 3, 4, 5, 'app'];

  function getLayers(manifest, collapsed) {
    var order = collapsed ? fullOrder.filter(function (id) { return id !== 0; }) : fullOrder;
    return order.map(function (id) {
      return manifest.layers.find(function (l) { return l.id === id; });
    });
  }

  function buildSvg(manifest, collapsed) {
    var layers = getLayers(manifest, collapsed);

    // 几何常量：左右留白紧凑，viewBox 高度按实际内容动态计算。
    var layout = {
      W: W,
      padX: 40,
      padY: 44,
      bandX: 24,
      bandW: 12,
      rectX: 70,
      rectW: 720,
      rectH: 64,
      rectGap: 24,
      titleY: 24,
      firstY: 56
    };

    var svg = '';

    // 先跑一遍计算各层 y 坐标、总高度，再生成 SVG。
    var y = layout.firstY;
    var layerYs = {};
    var layerBottoms = {};
    layers.forEach(function (layer) {
      layerYs[layer.id] = y;
      layerBottoms[layer.id] = y + layout.rectH;
      y += layout.rectH + layout.rectGap;
    });

    var lastId = layers[layers.length - 1].id;
    var lastBottom = layerBottoms[lastId];
    var bandTop = layout.firstY - 10;
    var bandBottom = lastBottom + 10;
    // 去掉虚线回路后，文字与上方层块直接留 24px
    var loopLabelY = lastBottom + 24;
    var H = loopLabelY + layout.padY;

    svg += '<svg class="dg-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="思考与判断体系全景图">';

    // 标题
    svg += '<text class="dg-title" x="' + (W / 2) + '" y="' + layout.titleY +
           '" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="14" fill="currentColor" opacity="0.5">体系总图（点击进入主题）</text>';

    // 批判性思维贯穿色带——作为左侧背景强调条，高度贴合实际层块范围
    svg += '<rect class="dg-band-line" x="' + layout.bandX + '" y="' + bandTop +
           '" width="' + layout.bandW + '" height="' + (bandBottom - bandTop) + '" rx="6" />';
    svg += '<text class="dg-band-label" x="' + (layout.bandX + 20) + '" y="' + (bandTop - 8) +
           '" font-family="-apple-system, sans-serif">批判性思维 · 贯穿全程</text>';

    // 层块
    layers.forEach(function (layer, idx) {
      var isMeta = layer.id === 0;
      var h = layout.rectH;
      var layerLabel = layer.label || layer.name || ('层 ' + layer.id);
      var layerHref = layer.href || ('#' + layer.id);
      var layerBrief = layer.brief || layer.core || '';

      svg += '<a class="dg-layer-link dg-layer-' + layer.id + '" href="' + layerHref +
             '" data-layer-id="' + layer.id +
             '" aria-label="' + escapeXml(layerLabel) + '：' + escapeXml(layerBrief) + '">';

      // 层块主体
      svg += '<rect class="dg-rect" x="' + layout.rectX + '" y="' + layerYs[layer.id] +
             '" width="' + layout.rectW + '" height="' + h + '" rx="12" />';

      // 左侧彩色边条（与层色一致）
      svg += '<rect class="dg-strip dg-strip-' + layer.id + '" x="' + (layout.rectX + 8) + '" y="' + (layerYs[layer.id] + 12) +
             '" width="4" height="' + (h - 24) + '" rx="2" />';

      // 第零层（底部虚线描边）
      if (isMeta) {
        svg += '<line class="dg-meta-dash" x1="' + (layout.rectX + 10) + '" y1="' + (layerYs[layer.id] + h + 4) +
               '" x2="' + (layout.rectX + 30) + '" y2="' + (layerYs[layer.id] + h + 4) + '" />';
      }

      var topY = layerYs[layer.id];
      svg += '<text class="dg-no" x="' + (layout.rectX + 24) + '" y="' + (topY + 20) +
             '" font-family="-apple-system, sans-serif">' + layerLabel + '</text>';

      var titleY = topY + h / 2 + 6;
      svg += '<text class="dg-name" x="' + (layout.rectX + 24) + '" y="' + titleY +
             '" font-family="-apple-system, sans-serif">' + escapeXml(layerBrief) + '</text>';

      svg += '<text class="dg-go" x="' + (layout.rectX + layout.rectW - 22) + '" y="' + (topY + 22) +
             '" text-anchor="end" font-family="-apple-system, sans-serif">进入 →</text>';

      svg += '</a>';

      // 箭头：起点 = 当前层 bottom + 4，终点 = 下一层 top - 4，居中放 ▼
      if (idx < layers.length - 1) {
        var next = layers[idx + 1];
        var arrowY1 = layerBottoms[layer.id] + 4;
        var arrowY2 = layerYs[next.id] - 4;
        var arrowYMid = (arrowY1 + arrowY2) / 2 + 5;

        svg += '<line class="dg-arrow" data-from-layer="' + layer.id +
               '" x1="' + (W / 2) + '" y1="' + arrowY1 +
               '" x2="' + (W / 2) + '" y2="' + arrowY2 + '" />';
        svg += '<text class="dg-arrow-text" data-from-layer="' + layer.id +
               '" x="' + (W / 2) + '" y="' + arrowYMid +
               '" text-anchor="middle" font-family="-apple-system, sans-serif">▼</text>';
      }
    });

    // 回路文字（去掉虚线回路，只保留文字）
    var loopLabel = collapsed
      ? '↺ 持续迭代 · 反馈 / 反证 / 修正 · 回到第一层重新审题'
      : '↺ 持续迭代 · 反馈 / 反证 / 修正 · 回到元层重新自检';
    svg += '<text class="dg-loop-label" x="' + (W / 2) + '" y="' + loopLabelY +
           '" text-anchor="middle" font-family="-apple-system, sans-serif">' + loopLabel + '</text>';

    svg += '</svg>';
    return { svg: svg, layerYs: layerYs, H: H };
  }

  function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  /* ----------- 渲染 ---------- */
  function render(manifest) {
    var host = document.querySelector('.diagram');
    if (!host) return;

    var svgEl = host.querySelector('.dg-svg');
    if (svgEl) svgEl.remove();

    var meta = manifest.layers.find(function (l) { return l.id === 0; });
    var collapsedDefault = meta ? (meta.collapsed_default !== false) : true;

    var state = { collapsed: collapsedDefault };

    function draw() {
      var out = buildSvg(manifest, state.collapsed);
      if (svgEl) svgEl.remove();
      host.insertAdjacentHTML('beforeend', out.svg);
      svgEl = host.querySelector('.dg-svg');
      updateBtn();
    }

    function updateBtn() {
      var btn = document.getElementById('dgToggleMeta');
      if (btn) btn.textContent = state.collapsed ? '展开元层' : '折叠元层';
    }

    draw();
    bindTableHover(host, manifest, state);

    var btn = document.getElementById('dgToggleMeta');
    if (btn) {
      btn.addEventListener('click', function () {
        state.collapsed = !state.collapsed;
        draw();
        bindTableHover(host, manifest, state);
      });
    }
  }

  /* ----------- 表格行 hover 联动 ----------- */
  function bindTableHover(host, manifest, state) {
    var rows = document.querySelectorAll('table.tbl tr[data-layer]');
    rows.forEach(function (row) {
      var layerId = row.dataset.layer;
      // 折叠时，如果 hover 的是元层，则高亮第一层（视觉上元层不存在）
      var highlightId = (state.collapsed && layerId === '0') ? '1' : layerId;

      row.addEventListener('mouseenter', function () {
        host.querySelectorAll('.dg-layer-link').forEach(function (l) {
          l.classList.remove('focus');
          l.classList.add('dim');
        });
        var target = host.querySelector('.dg-layer-' + highlightId);
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
        var a = document.querySelector('a.dg-layer-' + highlightId);
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
