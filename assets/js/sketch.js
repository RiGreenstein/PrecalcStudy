/* Sketch-and-check: the student places key points / horizontal asymptotes on a blank grid; each one is graded.
   Question shape:
   { type:'sketch', prompt, sketch: {
       view: { xMin, xMax, yMin, yMax, xStep, yStep, xUnit:'num'|'deg'|'rad', yUnit:'num'|'rad' },
       snapX, snapY,                              // grid the clicks snap to (e.g. 1/4 and π/12)
       targets: [{ label, kind:'point'|'hline', x, y }],
       answerFns: [{ f, domain? }]                // drawn after grading
   }, explanation } */
(function () {
  const el = R.el;
  const PI = Math.PI;

  function fracText(v) {
    for (let d = 1; d <= 12; d++) { const n = Math.round(v * d); if (Math.abs(n / d - v) < 1e-9) return d === 1 ? String(n) : n + '/' + d; }
    return M.fmt(v, 3);
  }
  const fmtX = (s, v) => s.view.xUnit === 'deg' ? M.fmt(v, 2) + '°' : s.view.xUnit === 'rad' ? M.formatPi(v, 24) : fracText(v);
  const fmtY = (s, v) => s.view.yUnit === 'rad' ? M.formatPi(v, 24) : fracText(v);
  const snap = (v, step) => step ? Math.round(v / step) * step : v;
  const tolX = s => (s.snapX || (s.view.xMax - s.view.xMin) / 100) * 0.51 + 1e-9;
  const tolY = s => (s.snapY || (s.view.yMax - s.view.yMin) / 100) * 0.51 + 1e-9;
  const describe = (s, t, p) => !p ? 'not placed' : t.kind === 'hline' ? 'y = ' + fmtY(s, p.y) : '(' + fmtX(s, p.x) + ', ' + fmtY(s, p.y) + ')';
  const correctText = (s, t) => describe(s, t, t);

  function grade(q, raw) {
    const s = q.sketch;
    raw = raw || {};
    const per = s.targets.map((t, i) => {
      const p = raw[i];
      if (!p) return false;
      if (t.kind === 'hline') return Math.abs(p.y - t.y) <= tolY(s);
      return Math.abs(p.x - t.x) <= tolX(s) && Math.abs(p.y - t.y) <= tolY(s);
    });
    const n = per.filter(Boolean).length;
    const detail = s.targets.map((t, i) => '<div>' + R.escapeHtml(t.label) + ': ' + (per[i] ? '<span class="good">✓</span>' : '<span class="bad">✗</span>') +
      ' <span class="muted">you: ' + describe(s, t, raw[i]) + ' · answer: ' + correctText(s, t) + '</span></div>').join('');
    return { ok: n === per.length, partial: n / per.length, per, detail };
  }
  function isBlank(q, raw) { return !raw || !q.sketch.targets.some((_, i) => raw[i]); }
  function answerText(q) { return q.sketch.targets.map(t => '<div>' + R.escapeHtml(t.label) + ': ' + correctText(q.sketch, t) + '</div>').join(''); }

  function render(container, q, onChange) {
    const s = q.sketch;
    const st = { placed: {}, active: 0, locked: false, result: null, hover: null };
    const wrap = el('div', { class: 'sketch' });
    container.appendChild(wrap);
    const gbox = el('div', { class: 'sketch-graph' }); wrap.appendChild(gbox);
    const side = el('div', { class: 'sketch-side' }); wrap.appendChild(side);
    const help = el('div', { class: 'muted small', text: 'Pick an item, then click the graph to place it. Arrow keys nudge the selected item one grid step.' });
    side.appendChild(help);
    const slots = el('div', { class: 'sketch-slots' }); side.appendChild(slots);
    const readout = el('div', { class: 'sketch-readout muted small' }); side.appendChild(readout);
    const btns = el('div', { class: 'btn-row' }); side.appendChild(btns);
    const clear = el('button', { class: 'btn btn-ghost btn-sm', text: 'Clear all', type: 'button' });
    btns.appendChild(clear);

    const g = new Graph(gbox, Object.assign({ height: 340, interactive: false, hover: false }, s.view));
    g.canvas.style.cursor = 'crosshair';
    g.canvas.tabIndex = 0;

    function pos(e) {
      const r = g.canvas.getBoundingClientRect();
      const sx = g.W / r.width, sy = g.H / r.height;
      return { x: snap(g.xAt((e.clientX - r.left) * sx), s.snapX), y: snap(g.yAt((e.clientY - r.top) * sy), s.snapY) };
    }
    g.canvas.addEventListener('mousemove', e => { if (st.locked) return; st.hover = pos(e); renderReadout(); draw(); });
    g.canvas.addEventListener('mouseleave', () => { st.hover = null; renderReadout(); draw(); });
    g.canvas.addEventListener('click', e => {
      if (st.locked) return;
      const p = pos(e);
      st.placed[st.active] = { x: p.x, y: p.y };
      // move on to the next unplaced item
      const nextFree = s.targets.findIndex((_, i) => !st.placed[i]);
      if (nextFree >= 0) st.active = nextFree;
      changed();
    });
    g.canvas.addEventListener('keydown', e => {
      if (st.locked) return;
      const p = st.placed[st.active];
      if (!p) return;
      const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!d) return;
      e.preventDefault();
      p.x = snap(p.x + d[0] * (s.snapX || 0.1), s.snapX);
      p.y = snap(p.y + d[1] * (s.snapY || 0.1), s.snapY);
      changed();
    });
    clear.addEventListener('click', () => { st.placed = {}; st.active = 0; changed(); });

    function changed() { renderSlots(); renderReadout(); draw(); if (onChange) onChange(); }

    function renderSlots() {
      slots.innerHTML = '';
      s.targets.forEach((t, i) => {
        const b = el('button', { class: 'sketch-slot' + (i === st.active && !st.locked ? ' active' : ''), type: 'button' });
        b.appendChild(el('span', { class: 'sketch-num', text: String(i + 1) }));
        b.appendChild(el('span', { class: 'sketch-label', text: t.label }));
        let status = describe(s, t, st.placed[i]);
        if (st.result) status += st.result.per[i] ? '  ✓' : '  ✗';
        b.appendChild(el('span', { class: 'sketch-val' + (st.result ? (st.result.per[i] ? ' good' : ' bad') : ''), text: status }));
        b.addEventListener('click', () => { if (st.locked) return; st.active = i; renderSlots(); g.canvas.focus(); });
        slots.appendChild(b);
      });
    }
    function renderReadout() {
      const t = s.targets[st.active];
      readout.textContent = st.locked ? '' : st.hover ? 'cursor: ' + (t && t.kind === 'hline' ? 'y = ' + fmtY(s, st.hover.y) : '(' + fmtX(s, st.hover.x) + ', ' + fmtY(s, st.hover.y) + ')') : ' ';
    }

    function draw() {
      const pal = g.palette || {};
      const fns = [], points = [], hlines = [], labels = [];
      if (st.result && s.answerFns) s.answerFns.forEach(fn => fns.push(Object.assign({ color: pal.accent3, width: 3 }, fn)));
      if (st.result) s.targets.forEach(t => {
        if (t.kind === 'hline') hlines.push({ y: t.y, color: pal.accent3 });
        else points.push({ x: t.x, y: t.y, hollow: true, color: pal.accent3, r: 7 });
      });
      s.targets.forEach((t, i) => {
        const p = st.placed[i];
        if (!p) return;
        const col = st.result ? (st.result.per[i] ? pal.accent3 : (pal.accent2)) : (i === st.active ? pal.accent2 : pal.accent);
        if (t.kind === 'hline') { hlines.push({ y: p.y, color: col, width: 2 }); labels.push({ x: s.view.xMin, y: p.y, text: String(i + 1), dx: 6, dy: -8, color: col }); }
        else { points.push({ x: p.x, y: p.y, color: col, r: 5.5, label: String(i + 1), dx: 8, dy: -6 }); }
      });
      const ht = s.targets[st.active];
      if (st.hover && !st.locked) {
        if (ht && ht.kind === 'hline') hlines.push({ y: st.hover.y, color: pal.ghost, width: 1 });
        else points.push({ x: st.hover.x, y: st.hover.y, hollow: true, color: pal.ghost, r: 5 });
      }
      g.update({ fns, points, hlines, labels });
    }

    renderSlots(); renderReadout();
    setTimeout(draw, 0);
    document.addEventListener('themechange', () => { if (g.canvas.isConnected) draw(); });

    return {
      getAnswer: () => { const out = {}; Object.keys(st.placed).forEach(k => out[k] = { x: st.placed[k].x, y: st.placed[k].y }); return out; },
      setAnswer: v => { st.placed = {}; if (v) Object.keys(v).forEach(k => st.placed[k] = { x: v[k].x, y: v[k].y }); const f = s.targets.findIndex((_, i) => !st.placed[i]); st.active = f < 0 ? 0 : f; renderSlots(); draw(); },
      lock: () => { st.locked = true; st.hover = null; clear.style.display = 'none'; help.style.display = 'none'; renderSlots(); renderReadout(); draw(); },
      showResult: res => { st.locked = true; clear.style.display = 'none'; help.style.display = 'none'; st.result = res || grade(q, st.placed); renderSlots(); renderReadout(); draw(); }
    };
  }

  window.Sketch = { render, grade, isBlank, answerText };
})();
