/* Notes renderer (markdown subset + KaTeX) and staged-reveal practice cards. */
(function () {
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function tex(src, display) {
    if (window.katex) {
      try {
        return katex.renderToString(src, { displayMode: !!display, throwOnError: false, strict: 'ignore' });
      } catch (e) { /* fall through */ }
    }
    return '<span class="math-fallback">' + escapeHtml(src) + '</span>';
  }

  // Protect math segments, run markdown, then restore rendered math.
  function md(text, sharedStash) {
    if (text === null || text === undefined) return '';
    const stash = sharedStash || [];
    // content is often authored in String.raw templates, where a backtick must be written as \`
    let s = String(text).replace(/\\`/g, '`');
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { stash.push(tex(m, true)); return '\u0000' + (stash.length - 1) + '\u0000'; });
    s = s.replace(/\$([^$\n]+?)\$/g, (_, m) => { stash.push(tex(m, false)); return '\u0000' + (stash.length - 1) + '\u0000'; });

    const lines = s.split('\n');
    const out = [];
    let para = [], inQuote = false, quoteBuf = [];
    // list stack: [{type:'ul'|'ol', indent, open:bool(li still open)}]
    const lists = [];

    function flushPara() {
      if (para.length) { out.push('<p>' + inline(para.join(' ')) + '</p>'); para = []; }
    }
    function closeList() { const l = lists.pop(); if (l.open) out.push('</li>'); out.push('</' + l.type + '>'); }
    function flushList() { while (lists.length) closeList(); }
    function flushQuote() {
      if (inQuote) { out.push('<div class="callout">' + md(quoteBuf.join('\n'), stash) + '</div>'); quoteBuf = []; inQuote = false; }
    }
    function listItem(type, indent, content) {
      flushPara();
      while (lists.length && lists[lists.length - 1].indent > indent) closeList();
      let top = lists[lists.length - 1];
      if (top && top.indent === indent && top.type !== type) { closeList(); top = lists[lists.length - 1]; }
      if (!top || top.indent < indent) {
        // nested list opens inside the still-open parent <li>
        out.push('<' + type + '>');
        lists.push({ type, indent, open: false });
        top = lists[lists.length - 1];
      }
      if (top.open) out.push('</li>');
      out.push('<li>' + inline(content));
      top.open = true;
    }
    function inline(t) {
      t = escapeHtml(t);
      t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');
      t = t.replace(/`([^`]+?)`/g, '<code>$1</code>');
      t = t.replace(/\[\[([^\]]+?)\]\]/g, '<span class="key">$1</span>');
      return t;
    }

    for (let raw of lines) {
      const line = raw.replace(/\s+$/, '');
      if (/^\s*$/.test(line)) { flushPara(); flushQuote(); continue; }
      let m;
      if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); inQuote = true; quoteBuf.push(m[1]); continue; }
      else flushQuote();
      if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flushPara(); flushList(); const l = m[1].length + 2; out.push('<h' + l + '>' + inline(m[2]) + '</h' + l + '>'); continue; }
      if ((m = line.match(/^(\s*)[-*]\s+(.*)$/))) { listItem('ul', m[1].length, m[2]); continue; }
      if ((m = line.match(/^(\s*)\d+[.)]\s+(.*)$/))) { listItem('ol', m[1].length, m[2]); continue; }
      if (/^---+$/.test(line)) { flushPara(); flushList(); out.push('<hr>'); continue; }
      if ((m = line.match(/^\s*\{\{fig:([\w-]+)\}\}\s*$/))) { flushPara(); flushList(); out.push(figure(m[1])); continue; }
      if (/^\|/.test(line)) { flushPara(); flushList(); const row = tableRow(line, inline); if (row) out.push(row); continue; }
      flushList();
      para.push(line);
    }
    flushPara(); flushList(); flushQuote();

    let html = out.join('\n');
    html = html.replace(/(<tr>[\s\S]*?<\/tr>\n?)+/g, m => '<table class="tbl">' + m + '</table>');
    if (!sharedStash) html = html.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[+i]);
    return html;
  }

  // Figures are registered by unit files as window.FIGURES[id] = () => '<svg…>' and placed in markdown with {{fig:id}} on its own line.
  function figure(id) {
    const f = window.FIGURES && window.FIGURES[id];
    let svg;
    try { svg = f ? f() : null; } catch (e) { console.error(e); }
    return '<figure class="fig">' + (svg || '<span class="bad">Missing figure: ' + escapeHtml(id) + '</span>') + '</figure>';
  }

  function tableRow(line, inline) {
    const cells = line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    if (cells.every(c => /^:?-{2,}:?$/.test(c))) return '';
    const isHead = cells.every(c => /^\*\*.*\*\*$/.test(c));
    const tag = isHead ? 'th' : 'td';
    return '<tr>' + cells.map(c => '<' + tag + '>' + inline(c.replace(/^\*\*|\*\*$/g, '')) + '</' + tag + '>').join('') + '</tr>';
  }

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    if (children) (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c === null || c === undefined) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  }

  // A practice problem with staged reveal. Nothing is shown until the student asks.
  function problemCard(p, index) {
    const card = el('div', { class: 'problem' });
    card.appendChild(el('div', { class: 'problem-num', text: 'Problem ' + (index + 1) }));
    card.appendChild(el('div', { class: 'problem-q', html: md(p.q) }));
    if (p.graph) {
      const g = el('div', { class: 'problem-graph' });
      card.appendChild(g);
      setTimeout(() => { try { p.graph(g); } catch (e) { console.error(e); } }, 0);
    }

    const work = el('textarea', { class: 'scratch', placeholder: 'Work it out here first (optional)…', rows: '2' });
    card.appendChild(work);

    const stages = [];
    if (p.hint) stages.push({ label: 'Show hint', cls: 'hint', title: 'Hint', body: p.hint });
    stages.push({ label: 'Show answer', cls: 'answer', title: 'Answer', body: p.answer, graph: p.answerGraph });
    if (p.solution) stages.push({ label: 'Show full solution', cls: 'solution', title: 'Solution', body: p.solution, graph: p.solutionGraph });

    const reveals = el('div', { class: 'reveals' });
    const btnRow = el('div', { class: 'btn-row' });
    card.appendChild(reveals);
    card.appendChild(btnRow);

    let i = 0;
    const btn = el('button', { class: 'btn btn-ghost', text: stages[0].label });
    btn.addEventListener('click', () => {
      const st = stages[i];
      const box = el('div', { class: 'reveal reveal-' + st.cls });
      box.appendChild(el('div', { class: 'reveal-title', text: st.title }));
      box.appendChild(el('div', { html: md(st.body) }));
      reveals.appendChild(box);
      // graphs that would give the answer away (e.g. "sketch this") are only drawn once revealed
      if (st.graph) {
        const g = el('div', { class: 'problem-graph' });
        box.appendChild(g);
        setTimeout(() => { try { st.graph(g); } catch (e) { console.error(e); } }, 0);
      }
      i++;
      if (i < stages.length) btn.textContent = stages[i].label;
      else btn.remove();
    });
    btnRow.appendChild(btn);
    return card;
  }

  window.R = { md, tex, el, escapeHtml, problemCard };
})();
