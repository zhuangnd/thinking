/* ==========================================================================
   diagram.js · 主页全景图渲染 + 表格行 hover 联动
   完全由 manifest 驱动：增删层只需改 manifest
   ========================================================================== */
(function () {
  'use strict';

  var W = 860, H = 1180;
  var layerOrder = [0, 1, 2, 3, 4, 5, 'app'];
  var LAYER_LABELS = {
    0:   { no: '第零层 · 元层',    href: 'metacognition.html',         brief: '双轨思考引擎 · 反优势机制 · 把体系拥有者自身作为分析对象' },
    1:   { no: '第一层 · 认知原则', href: 'critical-thinking.html',    brief: '回答"我应该如何面对问题"——审辨纪律贯穿全程' },
    2:   { no: '第二层 · 问题处理', href: 'structured-engineering.html', brief: '结构化 × 工程化 × 模型——看清问题并改变现实' },
    3:   { no: '第三层 · 讨论机制', href: 'discussion-baseline.html',  brief: '基线 + 框架 + 模型——降低认知噪声' },
    4:   { no: '第四层 · 执行机制', href: 'notes.html',                  brief: '工程化思维——把临场能力变成可重复流程' },
    5:   { no: '第五层 · 最终能力', href: 'judgment-system.html',       brief: '个人判断体系——形成世界观的机制' },
    'app': { no: '应用层 · 对话',   href: 'dialogue.html',               brief: '八步 + 三语境——判断体系在真实世界的测试场' }
  };

  function buildSvg(manifest) {
    var layers = layerOrder.map(function (id) {
      return manifest.layers.find(function (l) { return l.id === id; });
    });

    var layout = {
      titleY: 30,
      bandX: 14, bandTop: 60, bandBottom: 940,
      rectX: 50, rectW: 740, rectH: 64, rectGap: 28,
      firstY: 80,
      metaH: 56, normalH: 64
    };

    var svg = '';
    svg += '<svg class="dg-svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="思考与判断体系全景图">';

    // 标题
    svg += '<text class="dg-title" x="' + (W / 2) + '" y="' + layout.titleY +
           '" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="14" fill="currentColor" opacity="0.5">体系总图（点击进入主题）</text>';

    // 批判性思维贯穿色带
    svg += '<rect class="dg-band-line" x="' + layout.bandX + '" y="' + layout.bandTop +
           '" width="12" height="' + (layout.bandBottom - layout.bandTop) + '" rx="6" />';
    svg += '<text class="dg-band-label" x="' + (layout.bandX + 22) +
           '" y="' + (layout.bandTop - 8) +
           '" font-family="-apple-system, sans-serif">批判性思维 · 贯穿全程</text>';

    // 层块
    var y = layout.firstY;
    var layerYs = {};
    layers.forEach(function (layer, idx) {
      var isMeta = layer.id === 0;
      var h = isMeta ? layout.metaH : layout.normalH;
      var meta = LAYER_LABELS[layer.id];

      layerYs[layer.id] = y;

      svg += '<a class="dg-layer-link dg-layer-' + layer.id + '" href="' + meta.href +
             '" data-layer-id="' + layer.id +
             '" aria-label="' + meta.no + '：' + meta.brief + '">';
      svg += '<rect class="dg-rect" x="' + layout.rectX + '" y="' + y +
             '" width="' + layout.rectW + '" height="' + h + '" rx="12" />';

      // 第零层（虚线描边）
      if (isMeta) {
        svg += '<line x1="' + (layout.rectX + 10) + '" y1="' + (y + h + 4) +
               '" x2="' + (layout.rectX + 30) + '" y2="' + (y + h + 4) +
               '" stroke="var(--c-meta)" stroke-width="1.5" stroke-dasharray="3 2" />';
      }

      svg += '<text class="dg-no" x="' + (layout.rectX + 24) + '" y="' + (y + 22) +
             '" font-family="-apple-system, sans-serif">' + meta.no + '</text>';

      var titleY = y + h / 2 + 5;
      svg += '<text class="dg-name" x="' + (layout.rectX + 24) + '" y="' + titleY +
             '" font-family="-apple-system, sans-serif">' + escapeXml(meta.brief) + '</text>';

      svg += '<text class="dg-go" x="' + (layout.rectX + layout.rectW - 24) + '" y="' + (y + 22) +
             '" text-anchor="end" font-family="-apple-system, sans-serif">进入 →</text>';

      svg += '</a>';

      y += h + layout.rectGap;

      // 箭头（第零层下、五层之下、对话层之上都加）
      if (idx < layers.length - 1) {
        var nextIsMeta = layers[idx + 1].id === 0; // 永远 false（0 是第一个）
        // 元层之后到第一层之间的连接线
        svg += '<line class="dg-arrow" x1="' + (W / 2) + '" y1="' + (y - 4) +
               '" x2="' + (W / 2) + '" y2="' + (y + layout.rectGap - 12) +
               '" />';
        svg += '<text x="' + (W / 2) + '" y="' + (y + layout.rectGap - 16) +
               '" text-anchor="middle" font-size="14" fill="var(--c-fg-3)">▼</text>';
      }
    });

    // 回路（从对话层右 → 绕下方 → 回到元层左）
    var lastY = layerYs['app'] + layout.normalH;
    var metaY = layerYs[0];
    svg += '<path class="dg-loop-line" d="M ' + (W - 80) + ' ' + (lastY + 6) +
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

    // 折叠/展开元层
    var btn = document.getElementById('dgToggleMeta');
    if (btn) {
      // 默认折叠元层
      var metaLink = host.querySelector('.dg-layer-0');
      if (metaLink && metaLink.dataset.collapsed !== '0') {
        metaLink.style.display = 'none';
        // 折叠时隐藏指向下一层的箭头
        // 简化处理：直接隐藏
      }
      btn.addEventListener('click', function () {
        var meta = host.querySelector('.dg-layer-0');
        if (!meta) return;
        var isHidden = meta.style.display === 'none';
        meta.style.display = isHidden ? '' : 'none';
        btn.textContent = isHidden ? '折叠元层' : '展开元层';
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
      row.setAttribute('title', '点击查看 ' + LAYER_LABELS[layerId === 'app' ? 'app' : layerId].no);
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
