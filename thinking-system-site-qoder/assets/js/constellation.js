/* ============================================================
   constellation.js —— 认知星座图
   Canvas 2D 渲染 + 交互：拖拽平移 / 滚轮缩放 / hover 浮层 /
   click 内容卡 / dblclick 跳页 / 呼吸动画 / 连线光流 / 脉冲回路
   支持微缩模式（子页星座定位）与 prefers-reduced-motion 降级。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 星图数据：节点（世界坐标 1400×1000） ---------- */
  var NODES = [
    /* 布局逻辑（按层级与关系）：
       第零层 meta 置顶居中，凌驾五层之上；主链 crit→struct→base→model→eng→judge→dialog
       自上而下逐层下降；第三层 base 与 model 同层并排；应用层 dialog 置于右侧中部（横跨五层接口）。 */
    { id: 'meta',   x: 700,  y: 150, r: 24, color: '#E2E8F0', label: '双轨引擎',     sub: '第零层 · 元层 · 自反与制衡', page: 'metacognition.html',
      desc: '把体系拥有者自身作为分析对象——思考能力已经不是瓶颈，思考的自我约束机制才是。',
      points: ['轨道 A · 放大优势：结构拆解 → 对抗压力 → 尺度迁移', '轨道 B · 反优势制衡：不可解释槽位 · 体验还原 · 低解释密度', '总检验：承认这些不确定性之后，我是否还愿意暂时持有这个判断'],
      tags: ['元规则', '自反', '制衡'] },
    { id: 'crit',   x: 300,  y: 240, r: 34, color: '#F0A830', label: '批判性思维',   sub: '第一层 · 认知原则（贯穿全程）', page: 'critical-thinking.html',
      desc: '不是"批评"而是"审辨"——在接受、形成或改变判断之前，有意识地检查证据、逻辑、前提和不确定性。',
      points: ['审辨 ≠ 怀疑一切：相信到证据允许的程度', '三层次递进：信息批判 → 逻辑批判 → 自我批判', '六问最小模型：日常判断的可操作基线'],
      tags: ['审辨', '证据', '可修正'] },
    { id: 'struct', x: 520,  y: 380, r: 26, color: '#38BDF8', label: '结构化思维',   sub: '第二层 · 问题处理', page: 'structured-engineering.html',
      desc: '把复杂问题转换为可处理的结构：拆解、分类、抽象、建模、关联、转换、整合。',
      points: ['拆解 → 分类 → 建模 → 转换，看清问题构成', '四层抽象模型：事实 → 功能 → 逻辑 → 原理', '结构化让你深入问题，审辨防止你接受错误前提'],
      tags: ['拆解', '框架', '模型链'] },
    { id: 'base',   x: 650,  y: 500, r: 26, color: '#4ADE80', label: '基线 + 框架',  sub: '第三层 · 讨论机制', page: 'discussion-baseline.html',
      desc: '概念 → 标准 → 事实 → 逻辑四条基线，让讨论从"观点碰撞"变成"对象分析"。',
      points: ['四基线：概念定义 · 标准约束 · 事实依据 · 逻辑遵循', '精度模型：基线不变，宽容度随场景变', '认知增量：讨论目标是学习而非说服'],
      tags: ['四基线', '精度', '认知增量'] },
    { id: 'model',  x: 840,  y: 500, r: 23, color: '#2DD4BF', label: '模型',         sub: '第三层 · 有目的的抽象', page: 'structured-engineering.html',
      desc: '模型是对现实的有目的抽象——选择变量、建立关系、忽略次要因素。',
      points: ['三类模型链：问题模型 → 信息模型 → 数学模型', '模型三要素：变量 · 关系 · 边界', '最重要的模型往往是最简单的结构模型'],
      tags: ['抽象', '变量·关系·边界'] },
    { id: 'eng',    x: 740,  y: 600, r: 26, color: '#A78BFA', label: '工程化思维',   sub: '第四层 · 执行机制', page: 'structured-engineering.html',
      desc: '把依赖临场能力的思考变成稳定、可重复、可检验、可迭代的流程。',
      points: ['经验 → 规则 → 流程 → 模板 → 工具 → 反馈', '人机协同：人成为认知系统的组织者', '结构化笔记：第一个工程化沉淀实例'],
      tags: ['流程', '模板', '迭代'] },
    { id: 'judge',  x: 670,  y: 780, r: 32, color: '#FB7185', label: '个人判断体系', sub: '第五层 · 最终能力', page: 'judgment-system.html',
      desc: '不是观点集合，而是"形成世界观的机制"——独立、持续、可修正地形成判断的认知操作系统。',
      points: ['四层构造：价值优先级 / 证据标准 / 风险态度 / 修正机制', '证据排序：逻辑 > 真实数据 > 经验 = 权威（按领域区分）', '主动可证伪：建判断时写明"出现 A/B/C 我就放弃"'],
      tags: ['机制', '证伪', '纠错回路'] },
    { id: 'dialog', x: 1140, y: 500, r: 30, color: '#FB923C', label: '对话实践',     sub: '应用层 · 真实世界测试场', page: 'dialogue.html',
      desc: '判断体系若只在内心运行，无法接受真实检验——对话是其真实世界测试场。',
      points: ['骨架：承认合理性 · 批判前提 · 补充变量 · 升维 · 共同思考', '八步闭环：理解→审题→结构化→证据→模型→反证→判断→反馈', '心态：一起探索真相，而非证明谁对'],
      tags: ['对话', '检验', '闭环'] }
  ];

  /* ---------- 连线：main=纵向主线（实线光流）/ cross=横向关联（虚线）/ loop=迭代回路（脉冲） ---------- */
  var EDGES = [
    { a: 'crit',   b: 'struct', type: 'main' },
    { a: 'struct', b: 'base',   type: 'main' },
    { a: 'base',   b: 'model',  type: 'main' },
    { a: 'model',  b: 'eng',    type: 'main' },
    { a: 'eng',    b: 'judge',  type: 'main' },
    { a: 'judge',  b: 'dialog', type: 'main' },
    { a: 'crit',   b: 'base',   type: 'cross' },
    { a: 'crit',   b: 'model',  type: 'cross' },
    { a: 'crit',   b: 'eng',    type: 'cross' },
    { a: 'crit',   b: 'judge',  type: 'cross' },
    { a: 'dialog', b: 'crit',   type: 'cross' },
    { a: 'dialog', b: 'base',   type: 'cross' },
    { a: 'dialog', b: 'judge',  type: 'cross' },
    { a: 'meta',   b: 'crit',   type: 'cross' },
    { a: 'dialog', b: 'meta',   type: 'loop' }
  ];

  function nodeById(id) {
    for (var i = 0; i < NODES.length; i++) if (NODES[i].id === id) return NODES[i];
    return null;
  }
  function hexToRgba(hex, a) {
    var v = parseInt(hex.slice(1), 16);
    return 'rgba(' + (v >> 16 & 255) + ',' + (v >> 8 & 255) + ',' + (v & 255) + ',' + a + ')';
  }
  function rgbaDim(hex, a, k) { /* 颜色乘暗系数 k，用于淡化 */
    var v = parseInt(hex.slice(1), 16);
    var r = Math.round((v >> 16 & 255) * k), g = Math.round((v >> 8 & 255) * k), b = Math.round((v & 255) * k);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  /* 背景星（确定性伪随机，固定布局） */
  function makeBgStars() {
    var arr = [], seed = 42;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    for (var i = 0; i < 110; i++) {
      arr.push({ x: rnd() * 1400, y: rnd() * 1000, r: 1.2 + rnd() * 1.3, a: 0.10 + rnd() * 0.30, ph: rnd() * Math.PI * 2 });
    }
    return arr;
  }
  var BG_STARS = makeBgStars();

  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     create(canvas, opts)
     opts: { mini:false, highlight:[], interactive:true, card:HTMLElement, tip:HTMLElement }
     返回 api：{ pulse(id), setHighlight(ids), fit(), destroy() }
     ============================================================ */
  function create(canvas, opts) {
    opts = opts || {};
    var mini = !!opts.mini;
    var interactive = opts.interactive !== false && !mini;
    var ctx = canvas.getContext('2d');
    var dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    var W = 0, H = 0;

    var view = { scale: 1, tx: 0, ty: 0 };      /* 平移（屏幕像素） */
    var hoverId = null;
    var selId = null;                            /* click 选中（卡片） */
    var highlightIds = opts.highlight ? opts.highlight.slice() : null;
    var pulses = [];                             /* [{id, t0}] */
    var t0 = Date.now();
    var rafId = 0;
    var destroyed = false;

    /* hover 缩放插值 & 节点视觉半径 */
    var nodeK = {};
    NODES.forEach(function (n) { nodeK[n.id] = 1; });

    function now() { return REDUCED ? 0 : Date.now() - t0; }

    /* ---------- 坐标变换 ---------- */
    function worldBounds() {
      var minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
      NODES.forEach(function (n) {
        minX = Math.min(minX, n.x - 90); minY = Math.min(minY, n.y - 90);
        maxX = Math.max(maxX, n.x + 90); maxY = Math.max(maxY, n.y + 90);
      });
      return { minX: minX, minY: minY, maxX: maxX, maxY: maxY };
    }
    /* 顶部安全区：非微缩模式下，为 hh-overlay 标题区让出空间，
       使初始视图的星图整体下移、略微缩小，不与标题/面板重叠。 */
    function topSafe() {
      if (mini) return 0;
      var ov = document.querySelector('.hh-overlay');
      if (ov) {
        var h = ov.getBoundingClientRect().height;
        if (h > 0) return Math.min(Math.max(h + 26, 90), H * 0.45);
      }
      return 110;
    }
    function fit() {
      var b = worldBounds();
      var ts = topSafe();
      var availH = Math.max(200, H - ts);
      var s = Math.min(W / (b.maxX - b.minX), availH / (b.maxY - b.minY));
      if (mini) s = Math.min(s, H / (b.maxY - b.minY));
      view.scale = s;
      view.tx = W / 2 - (b.minX + b.maxX) / 2 * s;
      view.ty = ts + availH / 2 - (b.minY + b.maxY) / 2 * s;
      requestRender();
    }
    function toScreen(p) { return { x: p.x * view.scale + view.tx, y: p.y * view.scale + view.ty }; }

    /* ---------- 尺寸 ---------- */
    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(10, rect.width); H = Math.max(10, rect.height);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (mini) fit();
      requestRender();
    }
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
    else window.addEventListener('resize', resize);

    /* ---------- 命中检测 ---------- */
    function hitNode(mx, my) {
      var best = null, bestD = 1e9;
      NODES.forEach(function (n) {
        var s = toScreen(n);
        var d = Math.hypot(mx - s.x, my - s.y);
        if (d < Math.max(26, n.r * view.scale * nodeK[n.id] + 12) && d < bestD) { best = n; bestD = d; }
      });
      return best;
    }

    /* ---------- 相关边（hover/选中高亮） ---------- */
    function edgeOf(e, ids) { return ids.indexOf(e.a) >= 0 && ids.indexOf(e.b) >= 0; }

    /* ---------- 渲染 ---------- */
    function drawNodeGlow(x, y, r, color, alpha) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, hexToRgba(color, 0.50 * alpha));
      g.addColorStop(0.45, hexToRgba(color, 0.16 * alpha));
      g.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }

    function render() {
      var t = now();
      ctx.clearRect(0, 0, W, H);

      /* 背景星 */
      BG_STARS.forEach(function (s) {
        var p = toScreen(s);
        if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) return;
        var tw = REDUCED ? 1 : 0.6 + 0.4 * Math.sin(t / 500 + s.ph);
        ctx.fillStyle = 'rgba(20,214,235,' + (s.a * tw).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, s.r, 0, Math.PI * 2); ctx.fill();
      });

      var focusIds = null;
      if (hoverId) focusIds = [hoverId];
      else if (selId) focusIds = [selId];
      else if (highlightIds && highlightIds.length) focusIds = highlightIds;

      /* 连线 */
      EDGES.forEach(function (e) {
        var na = nodeById(e.a), nb = nodeById(e.b);
        var pa = toScreen(na), pb = toScreen(nb);
        var focused = focusIds && (e.a === focusIds[0] || e.b === focusIds[0]);
        var inHighlight = focusIds ? (focusIds.indexOf(e.a) >= 0 && focusIds.indexOf(e.b) >= 0) : false;
        var dimmed = focusIds ? !(focused || inHighlight) : false;
        var alpha = dimmed ? 0.05 : (focused || inHighlight ? 0.75 : 0.22);
        var color = (e.type === 'main') ? '255,255,255'
                  : (e.type === 'loop') ? '251,146,60'
                  : '190,205,225';

        ctx.lineWidth = focused ? 1.8 : 1.1;
        ctx.setLineDash(e.type === 'main' ? [] : [6, 7]);
        if (e.type === 'loop' && !REDUCED) {
          ctx.lineDashOffset = -(t / 40) % 26; /* 回路虚线流动 */
        }
        ctx.strokeStyle = 'rgba(' + color + ',' + alpha + ')';
        /* 高亮时取目标节点色相 */
        if (focused && e.type !== 'loop') {
          var tgt = (e.a === focusIds[0]) ? nodeById(e.b) : nodeById(e.a);
          ctx.strokeStyle = hexToRgba(tgt.color, dimmed ? 0.05 : 0.85);
          ctx.shadowBlur = 8; ctx.shadowColor = hexToRgba(tgt.color, 0.6);
        }
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
      });

      /* 主线光流：沿线移动的光点 */
      if (!REDUCED) {
        EDGES.forEach(function (e, i) {
          if (e.type !== 'main') return;
          var na = nodeById(e.a), nb = nodeById(e.b);
          var dimmed = focusIds ? !edgeOf(e, focusIds) : false;
          if (dimmed) return;
          var p = ((t / 5200) + i * 0.31) % 1;
          var pa = toScreen(na), pb = toScreen(nb);
          var x = pa.x + (pb.x - pa.x) * p, y = pa.y + (pb.y - pa.y) * p;
          var g = ctx.createRadialGradient(x, y, 0, x, y, 9);
          g.addColorStop(0, 'rgba(255,244,214,.9)');
          g.addColorStop(1, 'rgba(255,244,214,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
        });
        /* 回路脉冲：dialog → meta */
        var ld = nodeById('dialog'), mt = nodeById('meta');
        var pl = toScreen(ld), pm = toScreen(mt);
        var pp = (t / 3600) % 1;
        var px = pl.x + (pm.x - pl.x) * pp, py = pl.y + (pm.y - pl.y) * pp;
        var pg = ctx.createRadialGradient(px, py, 0, px, py, 12);
        pg.addColorStop(0, 'rgba(251,146,60,.95)');
        pg.addColorStop(1, 'rgba(251,146,60,0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
      }

      /* 节点 */
      NODES.forEach(function (n, i) {
        var ph = i * 1.7;
        var breathe = REDUCED ? 1 : 1 + 0.055 * Math.sin(t / 1900 + ph);
        var k = nodeK[n.id];
        var p = toScreen(n);
        var rr = n.r * view.scale * breathe * k;
        if (p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 80) return;

        var dim = 1;
        if (focusIds && focusIds.indexOf(n.id) < 0) dim = 0.18;
        else if (highlightIds && highlightIds.length && focusIds === highlightIds) dim = 1;

        /* 光晕 */
        drawNodeGlow(p.x, p.y, rr * 3.4, n.color, dim * (hoverId === n.id || selId === n.id ? 1.25 : 0.85));
        /* 本体 */
        ctx.fillStyle = rgbaDim(n.color, dim, 0.92);
        ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.fill();
        /* 内芯 */
        ctx.fillStyle = 'rgba(255,255,255,' + (0.85 * dim) + ')';
        ctx.beginPath(); ctx.arc(p.x - rr * 0.18, p.y - rr * 0.18, rr * 0.34, 0, Math.PI * 2); ctx.fill();

        /* 标签 */
        ctx.textAlign = 'center';
        var fs = Math.max(11, Math.min(15, 13 * view.scale * (mini ? 1.05 : 1)));
        ctx.font = '600 ' + fs + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
        ctx.fillStyle = 'rgba(226,232,240,' + (0.92 * dim) + ')';
        ctx.fillText(n.label, p.x, p.y + rr + fs + 6);
        if (!mini && view.scale > 0.62) {
          ctx.font = '400 ' + Math.max(9.5, fs - 3.5) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
          ctx.fillStyle = 'rgba(148,163,184,' + (0.75 * dim) + ')';
          ctx.fillText(n.sub, p.x, p.y + rr + fs * 2 + 8);
        }
        if (mini) {
          ctx.font = '400 ' + Math.max(9, fs - 4) + 'px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
          ctx.fillStyle = 'rgba(148,163,184,' + (0.7 * dim) + ')';
          ctx.fillText(n.sub, p.x, p.y + rr + fs * 2 + 5);
        }
      });

      /* 脉冲环（外部触发 / 主线 hover）；REDUCED 模式只画一帧即移除 */
      pulses = pulses.filter(function (pu) {
        var age = REDUCED ? 200 : Date.now() - pu.t0;
        var n = nodeById(pu.id);
        var p = toScreen(n);
        var prog = age / 1200;
        var rr = n.r * view.scale * (1 + prog * 1.6);
        ctx.strokeStyle = hexToRgba(n.color, (1 - prog) * 0.9);
        ctx.lineWidth = 2.5 * (1 - prog) + 0.5;
        ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, Math.PI * 2); ctx.stroke();
        return !REDUCED && age <= 1200;
      });
    }

    /* ---------- 动画循环 ---------- */
    function loop() {
      if (destroyed) return;
      if (!REDUCED) {
        /* hover 缩放插值 */
        NODES.forEach(function (n) {
          var target = (hoverId === n.id || selId === n.id) ? 1.28 : 1;
          nodeK[n.id] += (target - nodeK[n.id]) * 0.14;
        });
        render();
        rafId = requestAnimationFrame(loop);
      }
    }
    function requestRender() {
      if (REDUCED) { render(); return; }
      /* 非 REDUCED 时由 rAF 循环持续渲染 */
    }

    /* ---------- 浮层与卡片 ---------- */
    var tip = opts.tip || null;
    var card = opts.card || null;

    function showTip(n, mx, my) {
      if (!tip) return;
      tip.innerHTML = '<div class="ct-t" style="color:' + n.color + '">' + n.label +
        ' <span style="font-weight:400;font-size:11.5px;color:#94A3B8">' + n.sub + '</span></div>' +
        '<div class="ct-d">' + n.desc + '</div>';
      tip.classList.add('show');
      var pad = canvas.parentElement || canvas;
      var bw = pad.clientWidth, bh = pad.clientHeight;
      var x = Math.min(mx + 18, bw - 310), y = Math.min(my + 14, bh - 90);
      tip.style.left = Math.max(8, x) + 'px';
      tip.style.top = Math.max(8, y) + 'px';
    }
    function hideTip() { if (tip) tip.classList.remove('show'); }

    function openCard(n) {
      if (!card) return;
      selId = n.id;
      card.innerHTML =
        '<button class="cc-close" type="button" aria-label="关闭">✕</button>' +
        '<div class="cc-kicker">' + n.sub + '</div>' +
        '<div class="cc-title" style="color:' + n.color + '">' + n.label + '</div>' +
        '<div class="cc-sub">' + n.tags.join(' · ') + '</div>' +
        '<div class="cc-desc">' + n.desc + '</div>' +
        '<ul>' + n.points.map(function (p) { return '<li style="color:' + hexToRgba(n.color, .95) + '">' + p + '</li>'; }).join('') + '</ul>' +
        '<div class="cc-tags">' + n.tags.map(function (tg) { return '<span class="chip">' + tg + '</span>'; }).join('') + '</div>' +
        '<a class="cc-go" href="' + n.page + '">深入阅读 ' + n.label + ' →</a>';
      card.style.setProperty('--cc', n.color);
      card.style.setProperty('--ccg', hexToRgba(n.color, 0.4));
      card.classList.add('open');
      card.querySelector('.cc-close').addEventListener('click', function (ev) {
        ev.stopPropagation();
        selId = null; card.classList.remove('open'); requestRender();
      });
      requestRender();
    }
    function closeCard() {
      selId = null;
      if (card) card.classList.remove('open');
      requestRender();
    }

    /* ---------- 交互事件 ---------- */
    var dragging = false, moved = false, downX = 0, downY = 0, lastX = 0, lastY = 0;
    var pinchD = 0, pinchScale = 1;

    function canvasPos(ev) {
      var rect = canvas.getBoundingClientRect();
      return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
    }
    function zoomAt(mx, my, factor) {
      var s0 = view.scale;
      view.scale = Math.max(0.35, Math.min(3, s0 * factor));
      var f = view.scale / s0;
      view.tx = mx - (mx - view.tx) * f;
      view.ty = my - (my - view.ty) * f;
      requestRender();
    }

    if (interactive) {
      canvas.addEventListener('mousedown', function (ev) {
        dragging = true; moved = false;
        downX = lastX = ev.clientX; downY = lastY = ev.clientY;
        canvas.classList.add('grabbing');
      });
      window.addEventListener('mousemove', function (ev) {
        var p = canvasPos(ev);
        if (dragging) {
          var dx = ev.clientX - lastX, dy = ev.clientY - lastY;
          if (Math.hypot(ev.clientX - downX, ev.clientY - downY) > 4) moved = true;
          view.tx += dx; view.ty += dy;
          lastX = ev.clientX; lastY = ev.clientY;
          hideTip(); requestRender();
          return;
        }
        if (ev.target !== canvas) { if (hoverId) { hoverId = null; hideTip(); requestRender(); } return; }
        var n = hitNode(p.x, p.y);
        var changed = n ? (hoverId !== n.id) : !!hoverId;
        hoverId = n ? n.id : null;
        canvas.style.cursor = n ? 'pointer' : 'grab';
        if (n) showTip(n, p.x, p.y); else hideTip();
        if (changed || REDUCED) requestRender();
      });
      window.addEventListener('mouseup', function (ev) {
        if (!dragging) return;
        dragging = false;
        canvas.classList.remove('grabbing');
        if (moved) return;
        var p = canvasPos(ev);
        var n = hitNode(p.x, p.y);
        if (n) { if (selId === n.id) closeCard(); else openCard(n); }
        else closeCard();
        if (REDUCED) render();
      });
      canvas.addEventListener('dblclick', function (ev) {
        var p = canvasPos(ev);
        var n = hitNode(p.x, p.y);
        if (n) window.location.href = n.page;
      });
      canvas.addEventListener('wheel', function (ev) {
        /* 普通滚轮＝页面滚动（不拦截）；⌘/Ctrl+滚轮（含触控板捏合，系统自动带 ctrlKey）＝星图缩放 */
        if (!ev.ctrlKey && !ev.metaKey) return;
        ev.preventDefault();
        var p = canvasPos(ev);
        zoomAt(p.x, p.y, Math.exp(-ev.deltaY * 0.0011));
        if (REDUCED) render();
      }, { passive: false });

      /* 触摸：单指平移，双指缩放，轻点 = 点击 */
      canvas.addEventListener('touchstart', function (ev) {
        if (ev.touches.length === 1) {
          dragging = true; moved = false;
          downX = lastX = ev.touches[0].clientX; downY = lastY = ev.touches[0].clientY;
        } else if (ev.touches.length === 2) {
          dragging = false;
          pinchD = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY);
          pinchScale = view.scale;
        }
      }, { passive: true });
      canvas.addEventListener('touchmove', function (ev) {
        ev.preventDefault();
        if (ev.touches.length === 1 && dragging) {
          var t = ev.touches[0];
          var dx = t.clientX - lastX, dy = t.clientY - lastY;
          if (Math.hypot(t.clientX - downX, t.clientY - downY) > 6) moved = true;
          /* 纵向滑动交还页面滚动（配合 CSS touch-action: pan-y），横向拖拽才平移星图 */
          if (Math.abs(dx) > Math.abs(dy)) view.tx += dx;
          lastX = t.clientX; lastY = t.clientY;
          requestRender();
        } else if (ev.touches.length === 2 && pinchD > 0) {
          var d = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY);
          var rect = canvas.getBoundingClientRect();
          var cx = (ev.touches[0].clientX + ev.touches[1].clientX) / 2 - rect.left;
          var cy = (ev.touches[0].clientY + ev.touches[1].clientY) / 2 - rect.top;
          zoomAt(cx, cy, (pinchScale * d / pinchD) / view.scale);
        }
      }, { passive: false });
      canvas.addEventListener('touchend', function (ev) {
        if (dragging && !moved && ev.changedTouches.length) {
          var rect = canvas.getBoundingClientRect();
          var n = hitNode(ev.changedTouches[0].clientX - rect.left, ev.changedTouches[0].clientY - rect.top);
          if (n) openCard(n); else closeCard();
        }
        dragging = false; pinchD = 0;
        if (REDUCED) render();
      });
    } else if (mini) {
      /* 微缩模式：点击节点直接跳转 */
      canvas.addEventListener('click', function (ev) {
        var p = canvasPos(ev);
        var n = hitNode(p.x, p.y);
        if (n) window.location.href = n.page;
      });
      canvas.addEventListener('mousemove', function (ev) {
        var p = canvasPos(ev);
        var n = hitNode(p.x, p.y);
        canvas.style.cursor = n ? 'pointer' : 'default';
        hoverId = n ? n.id : null;
        if (REDUCED) render();
      });
    }

    /* ---------- 对外 API ---------- */
    var api = {
      pulse: function (id) {
        pulses.push({ id: id, t0: Date.now() });
        if (REDUCED) render();
      },
      setHighlight: function (ids) {
        highlightIds = ids ? ids.slice() : null;
        if (REDUCED) render();
      },
      fit: fit,
      getView: function () { return { scale: view.scale, tx: view.tx, ty: view.ty }; },
      nodeById: nodeById,
      destroy: function () {
        destroyed = true;
        if (rafId) cancelAnimationFrame(rafId);
      }
    };

    resize();
    fit();
    if (!REDUCED) loop(); else render();
    return api;
  }

  /* ============================================================
     自动初始化：<canvas data-const="mini" data-highlight="crit,base">
     主页由页面脚本显式 create（需传入卡片/浮层元素）。
     ============================================================ */
  function autoInit() {
    document.querySelectorAll('canvas[data-const]').forEach(function (c) {
      var hl = (c.getAttribute('data-highlight') || '').split(',').filter(Boolean);
      create(c, { mini: true, highlight: hl });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.Constellation = { create: create, nodes: NODES, edges: EDGES, nodeById: nodeById, reduced: REDUCED };
})();
