/* ==========================================================================
   index.js · 主页数据绑定（manifestready 后执行）
   - 渲染根问题卡片、主线流程条、六层链条表、文档索引表
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('manifestready', function (e) {
    var manifest = e.detail.manifest;
    if (document.body.dataset.page !== 'index') return;

    renderRootQuestions(manifest);
    renderMainline(manifest);
    renderChainTable(manifest);
    renderDocsIndex(manifest);
  });

  function renderRootQuestions(manifest) {
    var host = document.querySelector('[data-bind="root-questions"]');
    if (!host) return;
    host.innerHTML = manifest.root_questions.map(function (rq, i) {
      var layerAccent = ['critical-thinking', 'structured-engineering', 'judgment-system', 'metacognition'];
      var links = rq.links.map(function (id) {
        var p = manifest.pages.find(function (x) { return x.id === id; });
        return p ? '<a href="' + id + '.html">' + p.title + '</a>' : '';
      }).join('');
      var layerIdx = manifest.root_questions.findIndex(function (x) { return x.q === rq.q; });
      return '<div class="rq" style="border-left:4px solid var(--layer' + (i === 3 ? 'Meta' : (i + 1)) + ');">' +
        '<div class="rq-q">' + rq.q + '</div>' +
        '<div class="rq-k">' + rq.tag + '</div>' +
        '<div class="rq-d">' + rq.d + '</div>' +
        '<div class="rq-links">' + links + '</div>' +
        '</div>';
    }).join('');
  }

  function renderMainline(manifest) {
    var host = document.querySelector('[data-bind="mainline"]');
    if (!host) return;
    var ml = manifest.site.mainline;
    var hotSet = (manifest.site.mainline_hot || []).reduce(function (acc, n) { acc[n] = true; return acc; }, {});
    var html = '';
    ml.forEach(function (step, i) {
      var cls = 'ml-st';
      if (hotSet[i]) cls += ' hot-accent';
      else if (i === ml.length - 1) cls += ' hot';
      html += '<span class="' + cls + '" title="第 ' + (i + 1) + ' 步">' + escapeHtml(step) + '</span>';
      if (i < ml.length - 1) html += '<span class="ml-arr">→</span>';
    });
    host.innerHTML = html;
  }

  function renderChainTable(manifest) {
    var host = document.querySelector('[data-bind="chain-table"]');
    if (!host) return;
    var html = '';
    manifest.chain.forEach(function (row) {
      var layerName = '';
      if (row.layer === 0) layerName = '第零层·元层';
      else if (row.layer === 'app') layerName = '应用层·对话';
      else layerName = '第' + row.layer + '层';
      html += '<tr data-layer="' + row.layer + '">' +
        '<td><b>' + layerName + '</b></td>' +
        '<td>' + row.q + '</td>' +
        '<td>' + row.dist + '</td>' +
        '</tr>';
    });
    host.innerHTML = html;
  }

  function renderDocsIndex(manifest) {
    var host = document.querySelector('[data-bind="docs-index"]');
    if (!host) return;
    var html = '<tr><td><a href="index.html"><b>体系全景（本页）</b></a></td>' +
      '<td>思考与判断体系-总结</td><td>完备版总图</td>' +
      '<td>建立能不断产生、检验和修正答案的认知系统</td></tr>';
    manifest.pages.forEach(function (p) {
      html += '<tr>' +
        '<td><a href="' + p.id + '.html">' + p.title + '</a></td>' +
        '<td><code style="font-size:0.8125rem;color:var(--c-fg-3);">' + p.src + '</code></td>' +
        '<td>' + p.layer_label + '</td>' +
        '<td>' + p.core + '</td>' +
        '</tr>';
    });
    host.innerHTML = html;

    // 给文档索引表也加 hover 联动（data-layer 需要根据 id 推断）
    var pageBySlug = {};
    manifest.pages.forEach(function (p) { pageBySlug[p.id] = p; });
    var rows = host.querySelectorAll('tr');
    rows.forEach(function (row) {
      var link = row.querySelector('a[href]');
      if (!link) return;
      var m = link.getAttribute('href').match(/^([a-z-]+)\.html$/);
      if (!m) return;
      var p = pageBySlug[m[1]];
      if (p) row.setAttribute('data-layer', String(p.layer));
      row.style.cursor = 'pointer';
      row.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') return;
        window.location.href = link.getAttribute('href');
      });
    });
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
