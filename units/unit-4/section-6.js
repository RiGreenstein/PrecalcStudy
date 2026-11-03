/* Unit 4 — section 4-6: exact values of inverse circular functions (and compositions). */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { INV, ORDER, PI, TRIG } = U4;
  const r = String.raw;
  const sec = { id: '4-6', title: 'Exact values of inverse functions', topics: [] };
  U.sections.push(sec);

  const angleAns = v => { const f = M.asPiFraction(v, 12); return f ? f.n * PI / f.d : v; };
  const degTxt = v => M.fmt(v * 180 / PI, 2) + '°';
  const TRIG_TEX = { sin: '\\sin', cos: '\\cos', tan: '\\tan', cot: '\\cot', sec: '\\sec', csc: '\\csc' };
  const argTex = th => th < 0 ? '\\left(' + M.texPi(th) + '\\right)' : M.texPi(th);
  const undefOk = s => /undef|dne|does not|none|no solution|n\/?a/i.test(String(s));

  // Text explaining where the answer must lie and which quadrant a negative input lands in
  function rangeHint(k, x) {
    const P = INV[k];
    const half = P.group === 'right' ? 'right half ($-\\tfrac{\\pi}{2}$ to $\\tfrac{\\pi}{2}$)' : 'top half ($0$ to $\\pi$)';
    if (x === undefined) return 'Answers for ' + P.name + ' live on the ' + half + '.';
    if (x > 0) return 'Positive input → Quadrant I.';
    if (x === 0) return 'Zero input → on an axis.';
    return 'Negative input → ' + (P.group === 'right' ? 'Quadrant IV (a **negative** angle)' : 'Quadrant II (between $\\tfrac{\\pi}{2}$ and $\\pi$)') + ', because ' + P.name + ' answers on the ' + half + '.';
  }
  // Rewrite reciprocal inverses in terms of the familiar ones
  function recipNote(k, x, xTex) {
    if (k === 'sec') return '$\\operatorname{arcsec}(' + xTex + ') = \\arccos\\left(\\tfrac{1}{' + xTex + '}\\right) = \\arccos\\left(' + U4.valueTex(1 / x) + '\\right)$. ';
    if (k === 'csc') return '$\\operatorname{arccsc}(' + xTex + ') = \\arcsin\\left(\\tfrac{1}{' + xTex + '}\\right) = \\arcsin\\left(' + U4.valueTex(1 / x) + '\\right)$. ';
    if (k === 'cot') return x === 0 ? '$\\cot\\theta = 0$ at $\\theta = \\tfrac{\\pi}{2}$. ' : 'Need $\\tan\\theta = ' + U4.valueTex(1 / x) + '$ with $\\theta$ in $(0, \\pi)$. ';
    return '';
  }

  // ======================= unit-circle range explorer =======================
  function rangeExplorer(container, L, cfg) {
    const { Graph, R } = L;
    cfg = Object.assign({ key: 'sec', keys: ORDER }, cfg);
    const st = { key: cfg.key, idx: 1, shown: false };
    const root = R.el('div', { class: 'explorer cv-explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
    const eq = R.el('div', { class: 'equation' }); top.appendChild(eq);
    const sw = R.el('div', { class: 'explorer-switches' }); top.appendChild(sw);
    Graph.segmented(sw, cfg.keys.map(k => ({ label: INV[k].name, value: k })), st.key, v => { st.key = v; st.idx = 1; st.shown = false; fillSelect(); draw(); });
    const row = R.el('div', { class: 'cv-row' }); root.appendChild(row);
    const S = 360, dpr = window.devicePixelRatio || 1;
    const cv = R.el('canvas', { role: 'img', 'aria-label': 'Unit circle showing where the answer must lie' });
    cv.width = S * dpr; cv.height = S * dpr; cv.style.width = '100%'; cv.style.maxWidth = S + 'px'; cv.style.height = 'auto';
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    row.appendChild(cv);
    const side = R.el('div', { class: 'cv-side' }); row.appendChild(side);
    const pickRow = R.el('div', { class: 'uc-input' });
    pickRow.appendChild(R.el('span', { class: 'muted', text: 'input x = ' }));
    const sel = R.el('select', { class: 'select' }); pickRow.appendChild(sel);
    side.appendChild(pickRow);
    const think = R.el('div', { class: 'explore-intro' }); side.appendChild(think);
    const btns = R.el('div', { class: 'btn-row' }); side.appendChild(btns);
    const reveal = R.el('button', { class: 'btn btn-primary btn-sm', text: 'Reveal answer' });
    const rand = R.el('button', { class: 'btn btn-ghost btn-sm', text: 'Random one' });
    btns.appendChild(reveal); btns.appendChild(rand);
    const out = R.el('div', { class: 'uc-readout' }); side.appendChild(out);
    sel.addEventListener('change', () => { st.idx = +sel.value; st.shown = false; draw(); });
    reveal.addEventListener('click', () => { st.shown = true; draw(); });
    rand.addEventListener('click', () => {
      const g = M.rng((Date.now() ^ (Math.random() * 1e9)) >>> 0);
      st.key = g.pick(cfg.keys); st.idx = g.int(0, U4.valuesFor(st.key).length - 1); st.shown = false;
      sw.querySelectorAll('.seg').forEach((b, i) => b.classList.toggle('active', cfg.keys[i] === st.key));
      fillSelect(); draw();
    });

    function fillSelect() {
      sel.innerHTML = '';
      U4.valuesFor(st.key).forEach(([v], i) => sel.appendChild(R.el('option', { value: String(i), text: M.formatExact(v) })));
      sel.value = String(st.idx);
    }
    const css = n => getComputedStyle(root).getPropertyValue(n).trim();

    function candidates(k, x) {
      // the two unit-circle angles whose k-value is x (one is in range, one isn't)
      if (k === 'sin' || k === 'csc') { const s = k === 'sin' ? x : 1 / x; const a = Math.asin(s); return { kind: 'h', val: s, angs: [a, PI - a] }; }
      if (k === 'cos' || k === 'sec') { const c = k === 'cos' ? x : 1 / x; const a = Math.acos(c); return { kind: 'v', val: c, angs: [a, -a] }; }
      if (k === 'cot' && x === 0) return { kind: 'line', angs: [PI / 2, -PI / 2] };
      const t = k === 'tan' ? x : 1 / x; const a = Math.atan(t);
      return { kind: 'line', angs: [a, a + PI] };
    }

    function draw() {
      const k = st.key, P = INV[k], [x, xTex] = U4.valuesFor(k)[st.idx];
      const ans = angleAns(P.f(x));
      const cx = S / 2, cy = S / 2, Rr = 130;
      const pt = th => [cx + Rr * Math.cos(th), cy - Rr * Math.sin(th)];
      const bg = css('--graph-bg'), txt = css('--graph-text'), axis = css('--graph-axis'), acc = css('--accent'), acc2 = css('--accent-2'), acc3 = css('--accent-3'), mut = css('--text-muted');
      ctx.clearRect(0, 0, S, S); ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(S - 10, cy); ctx.moveTo(cx, 10); ctx.lineTo(cx, S - 10); ctx.stroke();
      ctx.strokeStyle = mut; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 2 * PI); ctx.stroke();
      // allowed range arc
      const col = P.group === 'right' ? acc3 : acc;
      ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath();
      if (P.group === 'right') ctx.arc(cx, cy, Rr, -PI / 2, PI / 2, false); else ctx.arc(cx, cy, Rr, -PI, 0, false);
      ctx.stroke(); ctx.lineCap = 'butt';
      // excluded angles (hollow)
      const excl = { tan: [PI / 2, -PI / 2], cot: [0, PI], sec: [PI / 2], csc: [0] }[k] || [];
      excl.forEach(th => { const [px, py] = pt(th); ctx.fillStyle = bg; ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * PI); ctx.fill(); ctx.stroke(); });
      // range end labels
      ctx.fillStyle = txt; ctx.font = '12px system-ui, sans-serif'; ctx.textBaseline = 'middle';
      const lab = (th, s, dx, dy) => { const [px, py] = pt(th); ctx.textAlign = 'center'; ctx.fillText(s, px + dx, py + dy); };
      if (P.group === 'right') { lab(PI / 2, 'π/2', 0, -18); lab(-PI / 2, '−π/2', 0, 18); lab(0, '0', 18, 0); }
      else { lab(0, '0', 16, 0); lab(PI, 'π', -16, 0); lab(PI / 2, 'π/2', 0, -18); }
      // the condition line + candidates
      const C = candidates(k, x);
      ctx.strokeStyle = acc2; ctx.lineWidth = 1.5; ctx.setLineDash([6, 5]); ctx.beginPath();
      if (C.kind === 'h') { const y = cy - Rr * C.val; ctx.moveTo(20, y); ctx.lineTo(S - 20, y); }
      else if (C.kind === 'v') { const xx = cx + Rr * C.val; ctx.moveTo(xx, 20); ctx.lineTo(xx, S - 20); }
      else { const [ax, ay] = pt(C.angs[0]), [bx, by] = pt(C.angs[1]); ctx.moveTo(cx + (ax - cx) * 1.25, cy + (ay - cy) * 1.25); ctx.lineTo(cx + (bx - cx) * 1.25, cy + (by - cy) * 1.25); }
      ctx.stroke(); ctx.setLineDash([]);
      const near = (p, q) => Math.abs(Math.atan2(Math.sin(p - q), Math.cos(p - q))) < 1e-6;
      const uniq = C.angs.filter((a, i) => i === 0 || !near(a, C.angs[0]));
      uniq.forEach(a => {
        const good = near(a, ans);
        const [px, py] = pt(a);
        ctx.lineWidth = 2.5; ctx.strokeStyle = acc2; ctx.fillStyle = st.shown && good ? acc2 : bg;
        ctx.beginPath(); ctx.arc(px, py, 7, 0, 2 * PI); ctx.fill(); ctx.stroke();
        if (st.shown && !good) {
          ctx.strokeStyle = mut; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px - 6, py - 6); ctx.lineTo(px + 6, py + 6); ctx.moveTo(px + 6, py - 6); ctx.lineTo(px - 6, py + 6); ctx.stroke();
        }
      });
      if (st.shown) {
        const [px, py] = pt(ans);
        ctx.strokeStyle = acc2; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(px, py); ctx.stroke();
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, -ans, ans > 0); ctx.stroke();
        ctx.fillStyle = acc2; ctx.font = '600 13px system-ui, sans-serif'; ctx.textAlign = px >= cx ? 'left' : 'right';
        ctx.fillText(M.formatPi(ans), px + (px >= cx ? 12 : -12), py + (py < cy ? -10 : 12));
      }

      eq.innerHTML = R.tex(P.tex + '\\left(' + xTex + '\\right) = \\;?', true);
      const condTex = { sin: '\\sin\\theta = ' + xTex, cos: '\\cos\\theta = ' + xTex, tan: '\\tan\\theta = ' + xTex, cot: '\\cot\\theta = ' + xTex, sec: '\\sec\\theta = ' + xTex + '\\;\\Leftrightarrow\\; \\cos\\theta = ' + U4.valueTex(1 / x), csc: '\\csc\\theta = ' + xTex + '\\;\\Leftrightarrow\\; \\sin\\theta = ' + U4.valueTex(1 / x) }[k];
      think.innerHTML = R.md('Find the angle $\\theta$ on the **highlighted half-circle** with $' + condTex + '$. The dashed line shows every angle that satisfies the equation — only one of the two orange points is in the range.');
      out.innerHTML = st.shown
        ? '<div class="info-row"><span>Answer</span><strong>' + M.formatPi(ans) + ' = ' + degTxt(ans) + '</strong></div><div class="info-note">' + R.md(rangeHint(k, x)) + '</div>'
        : '<div class="info-row"><span>Answer</span><strong class="muted">work it out, then reveal</strong></div>';
    }
    document.addEventListener('themechange', () => { if (cv.isConnected) draw(); });
    fillSelect(); draw();
  }

  // ---- generators shared by the two exact-value topics ----
  function genExact(keys) {
    return function (rng) {
      const k = rng.pick(keys), [x, xTex] = rng.pick(U4.valuesFor(k));
      const ans = angleAns(INV[k].f(x));
      const ref = INV[k].group === 'right' ? Math.abs(ans) : (ans <= PI / 2 ? ans : PI - ans);
      return { type: 'number', parse: 'angle', prompt: 'Find the exact value **in radians** (no calculator): $' + INV[k].tex + '\\left(' + xTex + '\\right)$. Type like `-pi/6` or `3pi/4`.', answer: ans, tol: 0.005, answerText: M.formatPi(ans), explanation: recipNote(k, x, xTex) + 'Reference angle $' + M.texPi(ref) + '$. ' + rangeHint(k, x) + ' Answer: $' + M.texPi(ans) + '$ $(' + degTxt(ans).replace('°', '^\\circ') + ')$.' };
    };
  }
  function genWrongRange(keys) {
    return function (rng) {
      let k, x, xTex, ans;
      do { k = rng.pick(keys); [x, xTex] = rng.pick(U4.valuesFor(k)); ans = angleAns(INV[k].f(x)); } while (x >= 0 && rng.bool(0.75));
      const cands = [-ans, PI - ans, PI + ans, ans - PI, 2 * PI - ans, ans + 2 * PI, ans + PI / 2].map(angleAns);
      const seen = new Set([M.formatPi(ans)]);
      const distract = [];
      rng.shuffle(cands).forEach(v => { const t = M.formatPi(v); if (!seen.has(t) && distract.length < 3) { seen.add(t); distract.push(v); } });
      return { type: 'mc', prompt: 'Which is $' + INV[k].tex + '\\left(' + xTex + '\\right)$?', choices: [{ text: '$' + M.texPi(ans) + '$', correct: true }].concat(distract.map(v => ({ text: '$' + M.texPi(v) + '$', correct: false }))), explanation: 'Several of these angles have the right ' + k + ' value, but only one is in the range of ' + INV[k].name + ' (' + INV[k].rangeText + '). ' + rangeHint(k, x) };
    };
  }
  function genDegrees(keys) {
    return function (rng) {
      const k = rng.pick(keys), [x, xTex] = rng.pick(U4.valuesFor(k));
      const ans = Math.round(INV[k].f(x) * 180 / PI);
      return { type: 'number', prompt: 'Find $' + INV[k].tex + '\\left(' + xTex + '\\right)$ **in degrees**.', answer: ans, tol: 0.5, unit: '°', answerText: ans + '°', explanation: rangeHint(k, x) + ' In degrees the range is ' + (INV[k].group === 'right' ? '$-90^\\circ$ to $90^\\circ$' : '$0^\\circ$ to $180^\\circ$') + '. Answer: $' + ans + '^\\circ$.' };
    };
  }
  function genDefined(keys, bad) {
    return function (rng) {
      const k = rng.pick(keys);
      const useBad = rng.bool(0.5);
      let x, xTex, ans;
      if (useBad) { [x, xTex] = rng.pick(bad[k]); ans = null; }
      else { [x, xTex] = rng.pick(U4.valuesFor(k)); ans = angleAns(INV[k].f(x)); }
      return {
        type: 'text', mentionsUndefined: true, placeholder: 'radians, or "undefined"',
        prompt: 'Evaluate exactly (radians), or type **undefined** if there is no answer: $' + INV[k].tex + '\\left(' + xTex + '\\right)$',
        check: s => ans === null ? undefOk(s) : (!undefOk(s) && Math.abs(Quiz.parseBy('angle', s) - ans) < 0.005),
        answerText: ans === null ? 'undefined' : M.formatPi(ans),
        explanation: ans === null ? 'Domain of ' + INV[k].name + ': ' + INV[k].domainText + '. $' + xTex + '$ is outside it — ' + INV[k].na : rangeHint(k, x) + ' Answer: $' + M.texPi(ans) + '$.'
      };
    };
  }
  const BAD = {
    sin: [[2, '2'], [-1.5, '-1.5'], [Math.sqrt(3), '\\sqrt3']], cos: [[-2, '-2'], [Math.SQRT2, '\\sqrt2'], [1.2, '1.2']], tan: [],
    sec: [[0.5, '\\tfrac12'], [0, '0'], [-Math.SQRT2 / 2, '-\\tfrac{\\sqrt2}{2}']], csc: [[0, '0'], [0.5, '\\tfrac12'], [Math.sqrt(3) / 2, '\\tfrac{\\sqrt3}{2}']], cot: []
  };

  // ======================= 4-6a arcsin, arccos, arctan =======================
  sec.topics.push({
    id: '4-6-basic', title: 'Exact values: arcsin, arccos, arctan',
    notes: r`## The question behind the notation

$\arcsin x$ asks: **"Which angle, in arcsin's range, has sine equal to $x$?"** Same idea for every inverse function.

## The routine

1. **Ignore the sign** and find the reference angle from the table.
2. **Place it in the range** using the sign of $x$:
   - $x > 0$: Quadrant I — the answer is the reference angle.
   - $x < 0$, **arcsin or arctan** (right half): Quadrant IV — answer $= -\text{ref}$.
   - $x < 0$, **arccos** (top half): Quadrant II — answer $= \pi - \text{ref}$.
3. Answer in **radians** unless told otherwise.

{{fig:u4-range-map}}

## Values you must know cold

| **$\theta$** | $0$ | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{4}$ | $\tfrac{\pi}{3}$ | $\tfrac{\pi}{2}$ |
| --- | --- | --- | --- | --- | --- |
| $\sin\theta$ | $0$ | $\tfrac12$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt3}{2}$ | $1$ |
| $\cos\theta$ | $1$ | $\tfrac{\sqrt3}{2}$ | $\tfrac{\sqrt2}{2}$ | $\tfrac12$ | $0$ |
| $\tan\theta$ | $0$ | $\tfrac{\sqrt3}{3}$ | $1$ | $\sqrt3$ | undefined |

## Examples (different from the practice set)

- $\arcsin\tfrac{\sqrt2}{2}$: reference $\tfrac{\pi}{4}$, positive → $\tfrac{\pi}{4}$.
- $\arccos\!\left(-\tfrac{\sqrt2}{2}\right)$: reference $\tfrac{\pi}{4}$, negative, top half → $\pi - \tfrac{\pi}{4} = \tfrac{3\pi}{4}$.
- $\arctan(-1)$: reference $\tfrac{\pi}{4}$, negative, right half → $-\tfrac{\pi}{4}$.

> **Common mistake:** an answer that has the right sine but is outside the range, like $\arcsin(-\tfrac12) = \tfrac{7\pi}{6}$. There is exactly **one** correct answer, and it's in the range.

> **Common mistake:** $\arccos(-x) = -\arccos x$. arccos never gives a negative angle. Its rule is $\arccos(-x) = \pi - \arccos x$.`,
    explore: {
      type: 'custom',
      intro: 'Pick a function and an input. The **highlighted half-circle** is where the answer must lie, and the dashed line hits **every** angle with that sine/cosine/tangent. Work out which orange point is the answer, then reveal.',
      setup(c, L) { rangeExplorer(c, L, { key: 'sin', keys: ['sin', 'cos', 'tan'] }); },
      tasks: r`1. Do $\arcsin(-\tfrac12)$ and $\arccos(-\tfrac12)$. Same input, different answers — why?
2. Press **Random one** ten times. Say the answer out loud before revealing.`
    },
    practice: [
      { q: r`Find without a calculator: $\arccos(-1)$`, hint: 'Which angle in [0, π] has cosine −1?', answer: r`$\pi$`, solution: r`$\cos\pi = -1$ and $\pi$ is in $[0, \pi]$.` },
      { q: r`Find without a calculator: $\arctan(-\sqrt3)$`, hint: 'tan(π/3) = √3. Negative input, right half.', answer: r`$-\tfrac{\pi}{3}$`, solution: r`Reference angle $\tfrac{\pi}{3}$. arctan's range is $(-\tfrac{\pi}{2}, \tfrac{\pi}{2})$, so a negative input gives a Quadrant IV angle: $-\tfrac{\pi}{3}$. (Not $\tfrac{2\pi}{3}$ — that has tangent $-\sqrt3$ too, but it's out of range.)` },
      { q: r`Find without a calculator: $\arccos 1$`, hint: 'Which angle in [0, π] has cosine 1?', answer: r`$0$`, solution: r`$\cos 0 = 1$, and $0$ is in $[0, \pi]$. (Not $2\pi$ — out of range.)` },
      { q: r`Find without a calculator: $\arcsin\!\left(-\tfrac12\right)$`, hint: 'sin(π/6) = 1/2. Negative input, right half.', answer: r`$-\tfrac{\pi}{6}$`, solution: r`Reference $\tfrac{\pi}{6}$; arcsin's range is $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$, so a negative input lands in Quadrant IV: $-\tfrac{\pi}{6}$. Not $\tfrac{7\pi}{6}$ or $\tfrac{11\pi}{6}$.` },
      { q: r`Find without a calculator: $\arccos\!\left(-\tfrac{\sqrt3}{2}\right)$`, hint: 'cos(π/6) = √3/2. Negative input, top half.', answer: r`$\tfrac{5\pi}{6}$`, solution: r`Reference $\tfrac{\pi}{6}$; arccos answers in Quadrant II for a negative input: $\pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}$.` },
      { q: r`Find without a calculator: $\arctan\tfrac{\sqrt3}{3}$`, hint: 'Which special angle has tangent √3/3 = 1/√3?', answer: r`$\tfrac{\pi}{6}$`, solution: r`$\tan\tfrac{\pi}{6} = \tfrac{\sin}{\cos} = \tfrac{1/2}{\sqrt3/2} = \tfrac{1}{\sqrt3} = \tfrac{\sqrt3}{3}$.` },
      { q: r`Find without a calculator: $\arcsin 2$`, hint: 'What values can sine take?', answer: 'undefined', solution: r`Sine is always between $-1$ and $1$; $2$ is outside arcsin's domain.` },
      { q: r`Find $\arccos\!\left(-\tfrac{\sqrt2}{2}\right)$ in **degrees**.`, hint: 'Reference 45°, top half.', answer: r`$135^\circ$`, solution: r`$180^\circ - 45^\circ = 135^\circ$ (Quadrant II).` }
    ],
    quiz: [genExact(['sin', 'cos', 'tan']), genExact(['sin', 'cos', 'tan']), genWrongRange(['sin', 'cos', 'tan']), genDegrees(['sin', 'cos', 'tan']), genDefined(['sin', 'cos'], BAD)],
    quizCount: 8
  });

  // ======================= 4-6b arccot, arcsec, arccsc =======================
  sec.topics.push({
    id: '4-6-recip', title: 'Exact values: arccot, arcsec, arccsc',
    notes: r`## Two ways to do these

**A. Directly.** $\operatorname{arcsec} x$ = the angle in $[0, \pi]$ (not $\tfrac{\pi}{2}$) whose secant is $x$. Same for the others with their ranges.

**B. Flip to a familiar one** (usually easier):

$$\operatorname{arcsec} x = \arccos\frac1x \qquad\qquad \operatorname{arccsc} x = \arcsin\frac1x$$

Both pairs share the same ranges, so these identities are always safe.

**arccot is the exception.** Its range is $(0, \pi)$ but arctan's is $(-\tfrac{\pi}{2}, \tfrac{\pi}{2})$, so:

- $x > 0$: $\operatorname{arccot} x = \arctan\tfrac1x$ ✓
- $x = 0$: $\operatorname{arccot} 0 = \tfrac{\pi}{2}$
- $x < 0$: $\operatorname{arccot} x = \pi + \arctan\tfrac1x$ — the answer must be in **Quadrant II**

Easier: think "top half". For a negative input, arccot (like arccos and arcsec) answers in Quadrant II: $\pi - \text{ref}$.

## Reciprocal values you'll see

| **$\theta$** | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{4}$ | $\tfrac{\pi}{3}$ |
| --- | --- | --- | --- |
| $\sec\theta$ | $\tfrac{2\sqrt3}{3}$ | $\sqrt2$ | $2$ |
| $\csc\theta$ | $2$ | $\sqrt2$ | $\tfrac{2\sqrt3}{3}$ |
| $\cot\theta$ | $\sqrt3$ | $1$ | $\tfrac{\sqrt3}{3}$ |

## Examples (different from the practice set)

- $\operatorname{arcsec} 2 = \arccos\tfrac12 = \tfrac{\pi}{3}$
- $\operatorname{arccsc}(-\sqrt2) = \arcsin\!\left(-\tfrac{\sqrt2}{2}\right) = -\tfrac{\pi}{4}$
- $\operatorname{arccot}(-1)$: reference $\tfrac{\pi}{4}$, top half → $\tfrac{3\pi}{4}$ (**not** $-\tfrac{\pi}{4}$)

> **Common mistake:** $\operatorname{arcsec} x = \dfrac{1}{\arccos x}$. The reciprocal goes **inside**: $\arccos\tfrac1x$.

> **Range reminder:** these answers use the precalc ranges (arcsec $[0, \pi]$, arccsc $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$, arccot $(0, \pi)$).`,
    explore: {
      type: 'custom',
      intro: 'Same unit-circle picture. For arcsec and arccsc, the readout rewrites the equation as a cosine or sine equation. The hollow ring marks the angle the range leaves out.',
      setup(c, L) { rangeExplorer(c, L, { key: 'sec', keys: ['cot', 'sec', 'csc'] }); },
      tasks: r`1. Compare $\operatorname{arccot}(-1)$ with $\arctan(-1)$ (use the previous topic). Why are they different?
2. Try $\operatorname{arcsec}(-2)$ and $\operatorname{arccsc}(-2)$. One lands in Quadrant II and one in Quadrant IV — explain from the picture.`
    },
    practice: [
      { q: r`Find without a calculator: $\operatorname{arccot}\sqrt3$`, hint: 'Which angle has cotangent √3 (tangent 1/√3)?', answer: r`$\tfrac{\pi}{6}$`, solution: r`$\cot\tfrac{\pi}{6} = \tfrac{\cos}{\sin} = \tfrac{\sqrt3/2}{1/2} = \sqrt3$, and $\tfrac{\pi}{6}$ is in $(0, \pi)$.` },
      { q: r`Find without a calculator: $\operatorname{arccsc}(-1)$`, hint: 'arccsc(−1) = arcsin(1/(−1)).', answer: r`$-\tfrac{\pi}{2}$`, solution: r`$\operatorname{arccsc}(-1) = \arcsin(-1) = -\tfrac{\pi}{2}$, which is in $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ and isn't the excluded $0$.` },
      { q: r`Find without a calculator: $\operatorname{arcsec}(-\sqrt2)$`, hint: 'Flip: cos θ = −1/√2 = −√2/2, with θ in [0, π].', answer: r`$\tfrac{3\pi}{4}$`, solution: r`$\operatorname{arcsec}(-\sqrt2) = \arccos\!\left(-\tfrac{1}{\sqrt2}\right) = \arccos\!\left(-\tfrac{\sqrt2}{2}\right) = \pi - \tfrac{\pi}{4} = \tfrac{3\pi}{4}$.` },
      { q: r`Find without a calculator: $\operatorname{arccot}(-\sqrt3)$`, hint: 'Negative input, top half (Quadrant II).', answer: r`$\tfrac{5\pi}{6}$`, solution: r`Reference $\tfrac{\pi}{6}$ (since $\cot\tfrac{\pi}{6} = \sqrt3$). Top half, negative → $\pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}$. Check: $\cot\tfrac{5\pi}{6} = \tfrac{-\sqrt3/2}{1/2} = -\sqrt3$ ✓.` },
      { q: r`Find without a calculator: $\operatorname{arcsec}\!\left(-\tfrac{2\sqrt3}{3}\right)$`, hint: 'Flip and rationalize: 1/(−2/√3) = −√3/2.', answer: r`$\tfrac{5\pi}{6}$`, solution: r`$\arccos\!\left(-\tfrac{\sqrt3}{2}\right) = \pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}$.` },
      { q: r`Find without a calculator: $\operatorname{arccsc} 2$`, hint: 'arcsin(1/2).', answer: r`$\tfrac{\pi}{6}$`, solution: r`$\operatorname{arccsc} 2 = \arcsin\tfrac12 = \tfrac{\pi}{6}$.` },
      { q: r`Find without a calculator: $\operatorname{arcsec}\tfrac12$`, hint: 'Can a secant be 1/2?', answer: 'undefined', solution: r`$|\sec\theta| \ge 1$ always. Equivalently $\arccos 2$ doesn't exist.` }
    ],
    quiz: [genExact(['cot', 'sec', 'csc']), genExact(['cot', 'sec', 'csc']), genWrongRange(['cot', 'sec', 'csc']), genDegrees(['cot', 'sec', 'csc']), genDefined(['sec', 'csc'], BAD),
      function (rng) {
        const k = rng.pick(['sec', 'csc', 'cot']);
        const right = { sec: '\\arccos\\tfrac1x', csc: '\\arcsin\\tfrac1x', cot: '\\arctan\\tfrac1x \\text{ (only for } x > 0)' }[k];
        const opts = ['\\arccos\\tfrac1x', '\\arcsin\\tfrac1x', '\\dfrac{1}{\\arccos x}', '\\dfrac{1}{\\arcsin x}', '\\arctan\\tfrac1x \\text{ (only for } x > 0)'];
        const choices = [right].concat(rng.shuffle(opts.filter(o => o !== right)).slice(0, 3)).map(o => ({ text: '$' + o + '$', correct: o === right }));
        return { type: 'mc', prompt: 'Which equals $' + INV[k].tex + ' x$?', choices, explanation: 'The reciprocal goes **inside**: if $\\sec\\theta = x$ then $\\cos\\theta = \\tfrac1x$. arcsec/arccos (and arccsc/arcsin) share ranges, so the identity always holds. For arccot it only works when $x > 0$, because arctan’s range differs.' };
      }],
    quizCount: 8
  });

  // ======================= 4-6c compositions =======================
  const ANG = [-PI, -5 * PI / 6, -3 * PI / 4, -2 * PI / 3, -PI / 2, -PI / 3, -PI / 4, -PI / 6, 0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6, PI, 7 * PI / 6, 5 * PI / 4, 4 * PI / 3, 3 * PI / 2, 5 * PI / 3, 7 * PI / 4, 11 * PI / 6];
  function composeGen(sameOnly) {
    return function (rng) {
      for (let tries = 0; tries < 200; tries++) {
        const g = rng.pick(ORDER), f = sameOnly ? g : rng.pick(ORDER);
        const th = rng.pick(ANG);
        const val = TRIG[g](th);
        if (!isFinite(val) || Math.abs(val) > 1e6) continue;
        const raw = INV[f].f(Math.abs(val) < 1e-12 ? 0 : val);
        if (!isFinite(raw) || isNaN(raw)) continue;
        const fr = M.asPiFraction(raw, 12);
        if (!fr) continue;
        const ans = fr.n * PI / fr.d;
        if (sameOnly && Math.abs(ans - th) < 1e-9) continue;     // want the "doesn't cancel" trap
        if (!sameOnly && f === g) continue;
        const inner = TRIG_TEX[g] + argTex(th);
        return {
          type: 'number', parse: 'angle', prompt: 'Find exactly (radians): $' + INV[f].tex + '\\left(' + inner + '\\right)$',
          answer: ans, tol: 0.005, answerText: M.formatPi(ans),
          explanation: 'Inside first: $' + inner + ' = ' + U4.valueTex(val) + '$. Then $' + INV[f].tex + '\\left(' + U4.valueTex(val) + '\\right) = ' + M.texPi(ans) + '$. ' + (sameOnly ? 'It does **not** cancel to $' + M.texPi(th) + '$, because $' + M.texPi(th) + '$ is outside the range of ' + INV[f].name + ' (' + INV[f].rangeText + ').' : rangeHint(f, val))
        };
      }
      return { type: 'number', parse: 'angle', prompt: 'Find exactly: $\\arcsin\\left(\\cos\\tfrac{\\pi}{6}\\right)$', answer: PI / 3, tol: 0.005, answerText: 'π/3', explanation: '$\\cos\\tfrac{\\pi}{6} = \\tfrac{\\sqrt3}{2}$, and $\\arcsin\\tfrac{\\sqrt3}{2} = \\tfrac{\\pi}{3}$.' };
    };
  }
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  function triangleGen(rng) {
    const [a, b, c] = rng.pick(TRIPLES);
    const g = rng.pick(['sin', 'cos', 'tan']);
    const f = rng.pick(['sin', 'cos', 'tan'].filter(x => x !== g));
    const sgn = rng.pick([1, -1]);
    const x = g === 'sin' ? sgn * a / c : g === 'cos' ? sgn * b / c : sgn * a / b;
    const xTex = (sgn < 0 ? '-' : '') + '\\tfrac{' + (g === 'sin' ? a : g === 'cos' ? b : a) + '}{' + (g === 'tan' ? b : c) + '}';
    const th = INV[g].f(x);
    const ans = TRIG[f](th);
    const ansT = U4.fracText(ans, 30);
    return {
      type: 'number', parse: 'any', prompt: 'Find exactly: $' + TRIG_TEX[f] + '\\left(' + INV[g].tex + '\\left(' + xTex + '\\right)\\right)$. (A fraction like `4/5`.)',
      answer: ans, tol: 0.002, answerText: ansT,
      explanation: 'Let $\\theta = ' + INV[g].tex + '(' + xTex + ')$. Draw a right triangle with sides $' + a + ', ' + b + ', ' + c + '$ so that $' + TRIG_TEX[g] + '\\theta = ' + xTex + '$. ' + rangeHint(g, x) + ' In that quadrant $' + TRIG_TEX[f] + '\\theta$ is ' + (ans > 0 ? 'positive' : 'negative') + ', so the answer is $' + U4.fracTex(ans, 30) + '$.'
    };
  }

  sec.topics.push({
    id: '4-6-compose', title: 'Compositions: arcsin(cos π/6), arcsec(sec(−π/3)), …',
    notes: r`## Work from the inside out

1. Evaluate the **inner** function exactly.
2. Evaluate the **outer** function on that number — if the outer one is an inverse, the answer must be in **its range**.

Example: $\arccos\!\left(\sin\tfrac{\pi}{3}\right) = \arccos\tfrac{\sqrt3}{2} = \tfrac{\pi}{6}$.

## The "it should cancel" trap

$\operatorname{arc}f\big(f(\theta)\big) = \theta$ **only when $\theta$ is already in the range of $\operatorname{arc}f$.** Otherwise, go inside-out:

- $\arccos\!\left(\cos\tfrac{4\pi}{3}\right) = \arccos\!\left(-\tfrac12\right) = \tfrac{2\pi}{3}$ — not $\tfrac{4\pi}{3}$.
- $\arctan\!\left(\tan\tfrac{3\pi}{4}\right) = \arctan(-1) = -\tfrac{\pi}{4}$ — not $\tfrac{3\pi}{4}$.

The other order is safer: $f\big(\operatorname{arc}f(x)\big) = x$ whenever $x$ is in the domain of $\operatorname{arc}f$. So $\sin(\arcsin 0.3) = 0.3$, but $\sin(\arcsin 2)$ is undefined.

## Trig of an inverse: draw the triangle

To find something like $\cos\!\left(\arctan\tfrac34\right)$:

{{fig:u4-triangle}}

1. Let $\theta = \arctan\tfrac34$, so $\tan\theta = \tfrac34$: opposite $3$, adjacent $4$.
2. Pythagoras: hypotenuse $5$.
3. $\cos\theta = \tfrac45$.
4. **Sign check:** $\theta$ is in arctan's range. Positive input → Quadrant I → cosine positive.

With a negative input, e.g. $\tan\!\left(\arccos\!\left(-\tfrac{5}{13}\right)\right)$: $\theta$ is in Quadrant II (arccos, negative input), where tangent is negative, so the answer is $-\tfrac{12}{5}$.

> **Common mistake:** "cancelling" $\operatorname{arcsec}(\sec(-\tfrac{\pi}{3}))$ to $-\tfrac{\pi}{3}$. arcsec never gives a negative angle.`,
    explore: {
      type: 'custom',
      intro: 'When you evaluate the outer inverse, this is the picture to have in mind: the answer has to sit on the highlighted half-circle.',
      setup(c, L) { rangeExplorer(c, L, { key: 'sin' }); }
    },
    practice: [
      { q: r`Find without a calculator: $\arcsin\!\left(\cos\tfrac{\pi}{6}\right)$`, hint: 'Inside first: cos(π/6) = ?', answer: r`$\tfrac{\pi}{3}$`, solution: r`$\cos\tfrac{\pi}{6} = \tfrac{\sqrt3}{2}$. $\arcsin\tfrac{\sqrt3}{2} = \tfrac{\pi}{3}$ (in $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$).` },
      { q: r`Find without a calculator: $\operatorname{arcsec}\!\left(\sec\!\left(-\tfrac{\pi}{3}\right)\right)$`, hint: 'Is −π/3 in arcsec’s range? If not, evaluate inside first.', answer: r`$\tfrac{\pi}{3}$`, solution: r`$-\tfrac{\pi}{3}$ is not in $[0, \pi]$, so it can't be the answer. Inside: $\sec(-\tfrac{\pi}{3}) = \tfrac{1}{\cos(-\pi/3)} = \tfrac{1}{1/2} = 2$. Then $\operatorname{arcsec} 2 = \arccos\tfrac12 = \tfrac{\pi}{3}$.` },
      { q: r`Find: $\arccos\!\left(\cos\tfrac{4\pi}{3}\right)$`, hint: '4π/3 is not in [0, π].', answer: r`$\tfrac{2\pi}{3}$`, solution: r`$\cos\tfrac{4\pi}{3} = -\tfrac12$, and $\arccos(-\tfrac12) = \tfrac{2\pi}{3}$.` },
      { q: r`Find: $\arctan\!\left(\tan\tfrac{3\pi}{4}\right)$`, hint: '3π/4 is not in (−π/2, π/2).', answer: r`$-\tfrac{\pi}{4}$`, solution: r`$\tan\tfrac{3\pi}{4} = -1$; $\arctan(-1) = -\tfrac{\pi}{4}$.` },
      { q: r`Find: $\operatorname{arccsc}\!\left(\csc\tfrac{5\pi}{6}\right)$`, hint: 'csc(5π/6) = 1/sin(5π/6).', answer: r`$\tfrac{\pi}{6}$`, solution: r`$\csc\tfrac{5\pi}{6} = \tfrac{1}{1/2} = 2$. $\operatorname{arccsc} 2 = \arcsin\tfrac12 = \tfrac{\pi}{6}$.` },
      { q: r`Find: $\sin\!\left(\arccos\!\left(-\tfrac35\right)\right)$`, hint: 'Triangle: adjacent −3, hypotenuse 5. Which quadrant?', answer: r`$\tfrac45$`, solution: r`$\theta = \arccos(-\tfrac35)$ is in Quadrant II (top half, negative input). Opposite side $= 4$. Sine is positive in QII: $\tfrac45$.` },
      { q: r`Find: $\tan\!\left(\arcsin\!\left(-\tfrac{5}{13}\right)\right)$`, hint: 'θ is in Quadrant IV.', answer: r`$-\tfrac{5}{12}$`, solution: r`Opposite $-5$, hypotenuse $13$, adjacent $12$ (positive in QIV). $\tan\theta = -\tfrac{5}{12}$.` },
      { q: r`Find: $\cos\!\left(\arcsin\tfrac12\right)$ and $\sin(\arcsin 2)$.`, hint: 'The second one: is 2 in arcsin’s domain?', answer: r`$\tfrac{\sqrt3}{2}$; undefined`, solution: r`$\arcsin\tfrac12 = \tfrac{\pi}{6}$ and $\cos\tfrac{\pi}{6} = \tfrac{\sqrt3}{2}$. $\arcsin 2$ doesn't exist, so the whole expression is undefined (it does **not** "cancel" to 2).` }
    ],
    quiz: [composeGen(false), composeGen(false), composeGen(true), triangleGen,
      function (rng) {
        const k = rng.pick(['sin', 'cos', 'tan', 'sec']);
        const pool = { sin: [[0.3, '0.3'], [-0.7, '-0.7'], [1.2, '1.2'], [-3, '-3']], cos: [[0.4, '0.4'], [-0.9, '-0.9'], [2, '2'], [-1.5, '-1.5']], tan: [[5, '5'], [-2.4, '-2.4'], [0.6, '0.6']], sec: [[3, '3'], [-1.5, '-1.5'], [0.4, '0.4'], [-0.5, '-0.5']] }[k];
        const [x, xTex] = rng.pick(pool);
        const ok = isFinite(INV[k].f(x)) && !isNaN(INV[k].f(x));
        return {
          type: 'text', mentionsUndefined: true, placeholder: 'a number, or "undefined"',
          prompt: 'Evaluate, or type **undefined**: $' + TRIG_TEX[k] + '\\left(' + INV[k].tex + '(' + xTex + ')\\right)$',
          check: s => ok ? (!undefOk(s) && Math.abs(M.parseFraction(s) - x) < 0.001) : undefOk(s),
          answerText: ok ? xTex : 'undefined',
          explanation: ok ? '$' + xTex + '$ is in the domain of ' + INV[k].name + ', so $' + TRIG_TEX[k] + '(' + INV[k].tex + ' x) = x$.' : '$' + xTex + '$ is not in the domain of ' + INV[k].name + ' (' + INV[k].domainText + '), so the inside doesn’t exist.'
        };
      }],
    quizCount: 8
  });
})();
