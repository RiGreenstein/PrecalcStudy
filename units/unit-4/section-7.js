/* Unit 4 — 4-7: writing one inverse circular function in terms of another (arccos x as an arccot, …).
   Every formula is generated from the Quadrant I reference triangle, and the x < 0 fix is chosen by checking values,
   so the 30-entry reference table can't drift out of sync with the quiz grader. */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { INV, ORDER, PI, SV, TRIG } = U4;
  const r = String.raw;
  const sec = { id: '4-7', title: 'Writing one inverse function as another', topics: [] };
  U.sections.push(sec);

  const TRIG_TEX = { sin: '\\sin', cos: '\\cos', tan: '\\tan', cot: '\\cot', sec: '\\sec', csc: '\\csc' };
  const RECIP = { sin: 'csc', csc: 'sin', cos: 'sec', sec: 'cos', tan: 'cot', cot: 'tan' };

  // ---- Quadrant I reference triangle for θ = arcF x (x > 0). abs → write the x side as |x|. ----
  const X = abs => abs ? { tex: '|x|', t: 'abs(x)', u: '|x|', lin: true } : { tex: 'x', t: 'x', u: 'x', lin: true };
  const ONE = { tex: '1', t: '1', u: '1', one: true };
  const R1M = { tex: '\\sqrt{1-x^2}', t: 'sqrt(1-x^2)', u: '√(1 − x²)' };
  const R1P = { tex: '\\sqrt{1+x^2}', t: 'sqrt(1+x^2)', u: '√(1 + x²)' };
  const RM1 = { tex: '\\sqrt{x^2-1}', t: 'sqrt(x^2-1)', u: '√(x² − 1)' };
  const SIDES = {
    sin: a => ({ opp: X(a), adj: R1M, hyp: ONE }),
    cos: a => ({ opp: R1M, adj: X(a), hyp: ONE }),
    tan: a => ({ opp: X(a), adj: ONE, hyp: R1P }),
    cot: a => ({ opp: ONE, adj: X(a), hyp: R1P }),
    sec: a => ({ opp: RM1, adj: ONE, hyp: X(a) }),
    csc: a => ({ opp: ONE, adj: RM1, hyp: X(a) })
  };
  const RATIO = { sin: ['opp', 'hyp'], cos: ['adj', 'hyp'], tan: ['opp', 'adj'], cot: ['adj', 'opp'], sec: ['hyp', 'adj'], csc: ['hyp', 'opp'] };
  const SIDE_NAME = { opp: 'opposite', adj: 'adjacent', hyp: 'hypotenuse' };

  function ratio(F, G, abs) {
    const s = SIDES[F](abs), [n, d] = RATIO[G].map(k => s[k]);
    const lin = !!(n.lin || d.lin);
    if (d.one) return { tex: n.tex, t: n.t, lin };
    return { tex: '\\dfrac{' + n.tex + '}{' + d.tex + '}', t: n.t + '/' + d.t, lin };
  }
  const wrap = (G, rt) => ({ tex: INV[G].tex + '\\left(' + rt.tex + '\\right)', t: 'arc' + G + '(' + rt.t + ')' });

  // kind: 'same' (one formula for every x) · 'neg' (x < 0: −formula(|x|)) · 'pi' (x < 0: π − formula(|x|))
  function conv(F, G) {
    const rt = ratio(F, G, false);
    const pos = wrap(G, rt);
    const rf = U4.compile(rt.t).f;
    const signedOk = U4.samples(F, 'neg').every(x => Math.abs(INV[G].f(rf(x)) - INV[F].f(x)) < 1e-9);
    let neg, kind;
    if (signedOk) { neg = pos; kind = 'same'; }
    else {
      const inner = wrap(G, ratio(F, G, rt.lin));
      if (INV[F].group === 'right') { neg = { tex: '-' + inner.tex, t: '-' + inner.t }; kind = 'neg'; }
      else { neg = { tex: '\\pi - ' + inner.tex, t: 'pi - ' + inner.t }; kind = 'pi'; }
    }
    return { F, G, rt, pos, neg, kind, recip: RECIP[F] === G };
  }
  const PAIRS = [];
  ORDER.forEach(F => ORDER.forEach(G => { if (F !== G) PAIRS.push(conv(F, G)); }));
  const CONV = {};
  PAIRS.forEach(c => { CONV[c.F + '>' + c.G] = c; });

  const big = F => F === 'sec' || F === 'csc';
  const regionTex = (F, side) => side === 'pos' ? (big(F) ? 'x \\ge 1' : 'x > 0') : (big(F) ? 'x \\le -1' : 'x < 0');
  const lhs = F => INV[F].tex + ' x';
  function casesTex(c) {
    if (c.kind === 'same') return lhs(c.F) + ' = ' + c.pos.tex;
    return lhs(c.F) + ' = \\begin{cases} ' + c.pos.tex + ', & ' + regionTex(c.F, 'pos') + ' \\\\[4pt] ' + c.neg.tex + ', & ' + regionTex(c.F, 'neg') + ' \\end{cases}';
  }
  function triangleMd(F) {
    const s = SIDES[F](false), [n, d] = RATIO[F];
    return '$' + TRIG_TEX[F] + '\\theta = x = \\frac{' + s[n].tex + '}{' + s[d].tex + '}$ → ' + SIDE_NAME[n] + ' $' + s[n].tex + '$, ' + SIDE_NAME[d] + ' $' + s[d].tex + '$';
  }
  function sidesMd(F) {
    const s = SIDES[F](false);
    return 'opposite $' + s.opp.tex + '$, adjacent $' + s.adj.tex + '$, hypotenuse $' + s.hyp.tex + '$';
  }
  function negReason(c) {
    if (c.kind === 'same') return 'Both ' + INV[c.F].name + ' and ' + INV[c.G].name + ' answer on the **' + (INV[c.F].group === 'right' ? 'right' : 'top') + ' half**, and the ratio keeps the sign of $x$, so the same formula works for negative $x$ too.';
    if (c.kind === 'neg') return 'For ' + (big(c.F) ? '$x \\le -1$' : '$x < 0$') + ', $\\theta = ' + lhs(c.F) + '$ is a **negative** (Quadrant IV) angle, but the formula with $|x|$ gives the positive reference angle. So negate it.';
    return 'For ' + (big(c.F) ? '$x \\le -1$' : '$x < 0$') + ', $\\theta = ' + lhs(c.F) + '$ is in **Quadrant II**, but the formula with $|x|$ gives the Quadrant I reference angle. So subtract it from $\\pi$.';
  }

  // ======================= figures =======================
  function triGroup(F, ox, oy, w, h, title) {
    const s = SIDES[F](false);
    const bold = side => (side.lin || side.one) ? 't-b' : '';
    const ax = ox + 24, ay = oy + h - 34, bx = ox + w - 64, cy = oy + 44;
    return SV.path('M' + ax + ',' + ay + ' L' + bx + ',' + ay + ' L' + bx + ',' + cy + ' Z', 'fill-soft') +
      SV.path('M' + (bx - 11) + ',' + ay + ' L' + (bx - 11) + ',' + (ay - 11) + ' L' + bx + ',' + (ay - 11), 'thin') +
      SV.arc(ax, ay, 26, 0, Math.atan2(ay - cy, bx - ax) * 180 / PI, 'acc3') +
      SV.text(ax + 36, ay - 6, 'θ', 't-it t-acc3') +
      SV.text((ax + bx) / 2, ay + 18, s.adj.u, bold(s.adj)) +
      SV.text(bx + 6, (ay + cy) / 2 + 4, s.opp.u, bold(s.opp), 'start') +
      SV.text((ax + bx) / 2 - 8, (ay + cy) / 2 - 8, s.hyp.u, bold(s.hyp), 'end') +
      SV.text(ox + w / 2 - 10, oy + 20, title || ('θ = ' + INV[F].name + ' x'), 't-b t-acc');
  }
  window.FIGURES['u4-six-tri'] = () => {
    let out = SV.open(660, 380, 'Six reference triangles, one for each inverse function, with x > 0');
    ORDER.forEach((F, i) => { out += triGroup(F, (i % 3) * 220, Math.floor(i / 3) * 180, 220, 180); });
    return out + SV.text(330, 372, 'Bold sides come straight from the definition; the third side is from Pythagoras.', 't-sm t-mut') + SV.close;
  };
  window.FIGURES['u4-tri-cos'] = () => SV.open(260, 190, 'Triangle for theta = arccos x') + triGroup('cos', 10, 0, 240, 190) + SV.close;

  // ======================= explorer =======================
  function convExplorer(container, L, cfg) {
    const { Graph, R } = L;
    const st = { F: cfg.F, G: cfg.G, u: 60, fix: false };
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
    const pickF = R.el('div', { class: 'explorer-switches' }), pickG = R.el('div', { class: 'explorer-switches' });
    pickF.appendChild(R.el('span', { class: 'muted small', text: 'Start with' }));
    pickG.appendChild(R.el('span', { class: 'muted small', text: 'Write it using' }));
    top.appendChild(pickF); top.appendChild(pickG);
    let segG;
    Graph.segmented(pickF, ORDER.map(k => ({ label: INV[k].name, value: k })), st.F, v => { st.F = v; if (st.G === v) st.G = ORDER.find(k => k !== v); segG.set(st.G); refresh(); });
    segG = Graph.segmented(pickG, ORDER.map(k => ({ label: INV[k].name, value: k })), st.G, v => { if (v === st.F) { segG.set(st.G); return; } st.G = v; refresh(); });
    const eq = R.el('div', { class: 'equation' }); root.appendChild(eq);
    const row = R.el('div', { class: 'cv-row' }); root.appendChild(row);
    const gbox = R.el('div', { style: 'flex: 1 1 380px; min-width: 0' }); row.appendChild(gbox);
    const side = R.el('div', { class: 'cv-side', style: 'flex: 0 1 260px' }); row.appendChild(side);
    const g = new Graph(gbox, { xUnit: 'num', yUnit: 'rad', height: 340, interactive: false, xMin: -1.25, xMax: 1.25, yMin: -2.3, yMax: 3.9, xStep: 0.5, yStep: PI / 2 });
    const fig = R.el('div'); side.appendChild(fig);
    const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
    const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
    const xOf = u => big(st.F) ? (u >= 0 ? 1 + u / 25 : -1 + u / 25) : (st.F === 'sin' || st.F === 'cos') ? u / 100 : u / 20;
    Graph.slider(sl, { label: 'x', min: -100, max: 100, step: 1, value: st.u, format: u => M.fmt(xOf(u), 2), onInput: u => { st.u = u; refresh(); } });
    const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
    Graph.toggle(tg, 'Show the corrected formula for negative x', false, v => { st.fix = v; refresh(); });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);

    function refresh() {
      const c = CONV[st.F + '>' + st.G], P = INV[st.F], Q = INV[st.G];
      const x = xOf(st.u);
      const rf = U4.compile(c.rt.t).f, nf = U4.compile(c.neg.t).f;
      const naive = v => Q.f(rf(v));
      const wide = !(st.F === 'sin' || st.F === 'cos');
      g.update(wide ? { xMin: -5.5, xMax: 5.5, xStep: 1 } : { xMin: -1.25, xMax: 1.25, xStep: 0.5 });
      const pal = g.palette || {};
      const fns = [];
      P.dom.forEach(iv => fns.push({ f: P.f, domain: [iv.lo, iv.hi], width: 4, color: pal.accent, label: fns.length ? undefined : 'y = ' + P.name + ' x' }));
      P.dom.forEach((iv, i) => fns.push({ f: naive, domain: [iv.lo, iv.hi], dashed: true, color: pal.accent2, label: i ? undefined : 'y = ' + Q.name + '(x > 0 formula)' }));
      if (st.fix && c.kind !== 'same') P.dom.forEach((iv, i) => fns.push({ f: nf, domain: [Math.max(iv.lo, -1e9), Math.min(iv.hi, 0)], dashed: true, width: 3, color: pal.accent3, label: i ? undefined : 'corrected for x < 0' }));
      const th = P.f(x), nv = naive(x), ok = Math.abs(nv - th) < 1e-9;
      const points = [{ x, y: th, color: pal.accent }];
      if (isFinite(nv) && !ok) points.push({ x, y: nv, color: pal.accent2, hollow: true });
      g.update({ fns, points, hlines: [] });
      eq.innerHTML = R.tex(casesTex(c), true);
      fig.innerHTML = '<figure class="fig">' + SV.open(260, 190, 'Reference triangle') + triGroup(st.F, 10, 0, 240, 190) + SV.close + '<figcaption>Quadrant I triangle (x &gt; 0)</figcaption></figure>';
      const rv = rf(x);
      const fmtA = v => isFinite(v) ? (M.asPiFraction(v, 12) ? M.formatPi(v, 12) + ' ≈ ' : '') + M.fmt(v, 4) : 'undefined';
      const rowH = (k, v) => '<div class="info-row"><span>' + k + '</span><strong>' + v + '</strong></div>';
      let note;
      if (!isFinite(nv)) note = 'At this x the ratio (or its inverse) is undefined — pick another x.';
      else if (ok) note = 'The ' + Q.name + ' formula gives the right angle here. ✓';
      else note = 'Mismatch: ' + Q.name + ' gives ' + fmtA(nv) + ', but the true angle is ' + fmtA(th) + ' (' + (P.group === 'right' ? 'Quadrant IV — negate the reference angle' : 'Quadrant II — use π minus the reference angle') + ').';
      info.innerHTML = rowH('x', M.fmt(x, 3)) + rowH('θ = ' + P.name + ' x', fmtA(th)) + rowH(st.G + ' θ from the triangle', isFinite(rv) ? M.fmt(rv, 4) : 'undefined') +
        rowH(Q.name + '(that)', fmtA(nv)) + '<div class="info-note">' + R.escapeHtml(note) + '</div>';
    }
    refresh();
  }

  // ======================= generators =======================
  const placeholder = 'e.g. pi - arccos(abs(x)/3)';
  const typing = ' Type it like `arcsin(sqrt(1-x^2)/(2x))` or `pi - arccos(abs(x)/3)` (use parentheses).';
  const pickPair = (rng, pred) => rng.pick(PAIRS.filter(pred));

  function genPos(rng) {
    const c = pickPair(rng, p => !p.recip || rng.bool(0.15));
    return {
      type: 'text', placeholder,
      prompt: 'Write $' + lhs(c.F) + '$ using **only** ' + INV[c.G].name + ', for $' + regionTex(c.F, 'pos') + '$.' + typing,
      check: U4.convCheck(c.F, c.G, 'pos'), answerText: c.pos.t,
      explanation: 'Let $\\theta = ' + lhs(c.F) + '$. ' + triangleMd(c.F) + '; Pythagoras gives the third side, so ' + sidesMd(c.F) + '. Then $' + TRIG_TEX[c.G] + '\\theta = ' + c.rt.tex + '$, so $' + lhs(c.F) + ' = ' + c.pos.tex + '$.'
    };
  }
  function genNeg(rng) {
    const c = pickPair(rng, p => rng.bool(0.15) ? true : p.kind !== 'same');
    return {
      type: 'text', placeholder,
      prompt: 'Write $' + lhs(c.F) + '$ using **only** ' + INV[c.G].name + ', for $' + regionTex(c.F, 'neg') + '$.' + typing,
      check: U4.convCheck(c.F, c.G, 'neg'), answerText: c.neg.t,
      explanation: 'Quadrant I formula: $' + c.pos.tex + '$. ' + negReason(c) + ' Answer: $' + lhs(c.F) + ' = ' + c.neg.tex + '$ for $' + regionTex(c.F, 'neg') + '$. (Any equivalent form is accepted.)'
    };
  }
  function genWhen(rng) {
    const c = pickPair(rng, p => !p.recip || rng.bool(0.3));
    const B = big(c.F);
    const opts = [
      { text: 'For every $x$ in the domain (wherever the right side is defined)', ok: c.kind === 'same' },
      { text: 'Only for ' + (B ? '$x \\ge 1$' : '$x \\ge 0$') + ' (wherever the right side is defined)', ok: c.kind !== 'same' },
      { text: 'Only for ' + (B ? '$x \\le -1$' : '$x \\le 0$'), ok: false },
      { text: 'For no values of $x$', ok: false }
    ];
    return {
      type: 'mc', prompt: 'For which $x$ is $' + lhs(c.F) + ' = ' + c.pos.tex + '$ true?',
      choices: opts.map(o => ({ text: o.text, correct: o.ok })),
      explanation: negReason(c) + (c.kind === 'same' ? '' : ' The full answer: $' + casesTex(c) + '$.')
    };
  }
  function genRatio(rng) {
    const F = rng.pick(ORDER), G = rng.pick(ORDER.filter(k => k !== F));
    const others = rng.shuffle(ORDER.filter(k => k !== G)).slice(0, 3);
    const choice = k => '$' + ratio(F, k, false).tex + '$';
    return {
      type: 'mc', prompt: 'Let $\\theta = ' + lhs(F) + '$ with ' + (big(F) ? '$x > 1$' : '$x > 0$') + '. Draw the reference triangle. Which expression equals $' + TRIG_TEX[G] + '\\theta$?',
      choices: [{ text: choice(G), correct: true }].concat(others.map(k => ({ text: choice(k), correct: false }))),
      explanation: triangleMd(F) + '. Third side by Pythagoras: ' + sidesMd(F) + '. $' + TRIG_TEX[G] + '\\theta = \\frac{\\text{' + SIDE_NAME[RATIO[G][0]] + '}}{\\text{' + SIDE_NAME[RATIO[G][1]] + '}} = ' + ratio(F, G, false).tex + '$.'
    };
  }
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  function genValue(rng) {
    for (let tries = 0; tries < 200; tries++) {
      const grp = rng.pick([['sin', 'tan', 'csc'], ['cos', 'cot', 'sec']]);
      const F = rng.pick(grp), G = rng.pick(grp.filter(k => k !== F));
      const [p, q, h] = rng.pick(TRIPLES), legs = rng.bool() ? [p, q] : [q, p];
      const side = { opp: legs[0], adj: legs[1], hyp: h };
      const a = rng.sign() * side[RATIO[F][0]] / side[RATIO[F][1]];
      const th = INV[F].f(a), v = TRIG[G](th);
      if (!isFinite(th) || !isFinite(v) || Math.abs(INV[G].f(v) - th) > 1e-9) continue;
      return {
        type: 'number', parse: 'any', tol: 0.002,
        prompt: 'Fill in the blank with an exact number: $' + INV[F].tex + '\\left(' + U4.fracTex(a, 30) + '\\right) = ' + INV[G].tex + '\\left(\\;\\_\\_\\_\\;\\right)$. (A fraction like `-3/4`.)',
        answer: v, answerText: U4.fracText(v, 30),
        explanation: 'Let $\\theta = ' + INV[F].tex + '(' + U4.fracTex(a, 30) + ')$. Triangle sides $' + p + ', ' + q + ', ' + h + '$; ' + (a < 0 ? (INV[F].group === 'right' ? '$\\theta$ is in Quadrant IV' : '$\\theta$ is in Quadrant II') : '$\\theta$ is in Quadrant I') + ', so $' + TRIG_TEX[G] + '\\theta = ' + U4.fracTex(v, 30) + '$. Both functions answer on the same half, so $' + INV[G].tex + '(' + U4.fracTex(v, 30) + ')$ is that same $\\theta$.'
      };
    }
    return { type: 'number', parse: 'any', tol: 0.002, prompt: 'Fill in the blank: $\\arccos\\left(-\\tfrac35\\right) = \\operatorname{arccot}(\\_\\_\\_)$', answer: -0.75, answerText: '−3/4', explanation: 'Quadrant II, adjacent −3, opposite 4: $\\cot\\theta = -\\tfrac34$.' };
  }

  // ======================= reference table (all 30) =======================
  function tableFor(F) {
    let s = '### Starting from $' + lhs(F) + '$\n\n| **as…** | **' + (big(F) ? 'x ≥ 1' : 'x > 0') + '** | **' + (big(F) ? 'x ≤ −1' : 'x < 0') + '** |\n| --- | --- | --- |\n';
    ORDER.filter(G => G !== F).forEach(G => {
      const c = CONV[F + '>' + G];
      s += '| ' + INV[G].name + (c.recip ? ' (reciprocal)' : '') + ' | $' + c.pos.tex + '$ | ' + (c.kind === 'same' ? 'same formula' : '$' + c.neg.tex + '$') + ' |\n';
    });
    return s;
  }
  const FULL_TABLE = ORDER.map(tableFor).join('\n');

  // ======================= 4-7a the triangle method =======================
  sec.topics.push({
    id: '4-7-triangle', title: 'The triangle method: arccos x as an arccot, …',
    notes: r`## The idea

To write $\arccos x$ as an arccot, give the angle a name: $\theta = \arccos x$. Then $\cos\theta = x$. If you can find $\cot\theta$ in terms of $x$, then

$$\theta = \operatorname{arccot}(\cot\theta)$$

as long as $\theta$ is in arccot's range. The **triangle** finds $\cot\theta$. The **range check** (next topic) handles negative $x$.

## The routine (start with $x > 0$)

1. Let $\theta = \operatorname{arc}F\,x$, so $F(\theta) = x = \dfrac{x}{1}$.
2. Draw a right triangle with angle $\theta$. Label the two sides that $F$ uses with $x$ and $1$.
3. Find the third side with Pythagoras.
4. Read off the function you want: $G(\theta) = \dfrac{\text{side}}{\text{side}}$.
5. Write $\operatorname{arc}F\,x = \operatorname{arc}G(\text{that ratio})$.

{{fig:u4-six-tri}}

## Worked example: $\arccos x$ as an arccot

$\theta = \arccos x$, so $\cos\theta = \dfrac{x}{1}$: adjacent $x$, hypotenuse $1$, opposite $\sqrt{1-x^2}$.

{{fig:u4-tri-cos}}

$$\cot\theta = \frac{\text{adj}}{\text{opp}} = \frac{x}{\sqrt{1-x^2}} \quad\Longrightarrow\quad \arccos x = \operatorname{arccot}\frac{x}{\sqrt{1-x^2}}$$

Range check: arccos and arccot both answer on the **top half** ($0$ to $\pi$), and $\frac{x}{\sqrt{1-x^2}}$ is negative when $x$ is. So this one formula works for every $-1 < x < 1$. (At $x = \pm1$ the right side is undefined.)

## Worked example: $\arctan x$ as an arcsin

$\tan\theta = \frac{x}{1}$: opposite $x$, adjacent $1$, hypotenuse $\sqrt{1+x^2}$. So $\sin\theta = \frac{x}{\sqrt{1+x^2}}$ and

$$\arctan x = \arcsin\frac{x}{\sqrt{1+x^2}} \quad\text{for every } x.$$

Both are right-half functions, and the ratio has the sign of $x$, so it works for negative $x$ too.

## How many conversions are there?

Six functions, each written as one of the other five: $6 \times 5 = 30$.

- **6 are reciprocal pairs.** Just flip the input: $\operatorname{arcsec} x = \arccos\frac1x$, $\operatorname{arccsc} x = \arcsin\frac1x$, $\arccos x = \operatorname{arcsec}\frac1x$, and so on. (arctan ↔ arccot needs a range fix for $x < 0$.)
- **The other 24** need the triangle. Don't memorize them. Learn the routine and the range fix. The full table is in the next topic if you want to check your work.

## Typing answers in the quiz

Use parentheses: \`arccot(x/sqrt(1-x^2))\`, \`pi - arcsin(sqrt(x^2-1)/abs(x))\`. You can also type \`√\`, \`π\`, or \`cot^-1(…)\`. Any equivalent expression is accepted, as long as it uses only the function you were asked for.

> **Common mistake:** writing $\operatorname{arccot}\frac{\sqrt{1-x^2}}{x}$. That's $\tan\theta$, not $\cot\theta$. Say "cot = adjacent over opposite" before you write.

> **Common mistake:** stopping at the $x > 0$ formula. Always ask: *does this still work when $x$ is negative?* (next topic)`,
    explore: {
      type: 'custom',
      intro: 'Pick a starting function and a target. The **solid** curve is the true $y = \\operatorname{arc}F\\,x$. The **dashed** curve is the $x > 0$ triangle formula. Where they separate, the formula needs a range fix.',
      setup(c, L) { convExplorer(c, L, { F: 'cos', G: 'cot' }); },
      tasks: r`1. Start with arccos and write it using arccot. Do the curves ever separate? Why not?
2. Switch the target to arcsin. Where do the curves separate, and by how much at $x = -0.5$?
3. Try arctan → arcsin, then arctan → arccos. Which needs a fix for negative $x$?`
    },
    practice: [
      { q: r`Write $\arcsin x$ using arctan.`, hint: 'sin θ = x/1: opposite x, hypotenuse 1. Adjacent?', answer: r`$\arcsin x = \arctan\dfrac{x}{\sqrt{1-x^2}}$, for $-1 < x < 1$`, solution: r`Opposite $x$, hypotenuse $1$, adjacent $\sqrt{1-x^2}$. $\tan\theta = \frac{x}{\sqrt{1-x^2}}$. arcsin and arctan both answer on the right half, and the ratio has the sign of $x$, so it holds for all $-1 < x < 1$. (At $x = \pm1$, $\tan\theta$ is undefined.)` },
      { q: r`Write $\operatorname{arcsec} x$ using arccos.`, hint: 'This is a reciprocal pair.', answer: r`$\operatorname{arcsec} x = \arccos\dfrac{1}{x}$ (all $|x| \ge 1$)`, solution: r`$\sec\theta = x \Rightarrow \cos\theta = \frac1x$. arcsec and arccos have the same range, so this works for every $x$ in the domain.` },
      { q: r`Write $\operatorname{arccot} x$ using arccos.`, hint: 'cot θ = x/1: adjacent x, opposite 1.', answer: r`$\operatorname{arccot} x = \arccos\dfrac{x}{\sqrt{1+x^2}}$ (all $x$)`, solution: r`Adjacent $x$, opposite $1$, hypotenuse $\sqrt{1+x^2}$. $\cos\theta = \frac{x}{\sqrt{1+x^2}}$. Both are top-half functions, and the ratio has the sign of $x$, so it works for every $x$.` },
      { q: r`Write $\operatorname{arccsc} x$ using arctan, for $x \ge 1$.`, hint: 'csc θ = x/1: hypotenuse x, opposite 1.', answer: r`$\operatorname{arccsc} x = \arctan\dfrac{1}{\sqrt{x^2-1}}$ for $x > 1$`, solution: r`Hypotenuse $x$, opposite $1$, adjacent $\sqrt{x^2-1}$. $\tan\theta = \frac{1}{\sqrt{x^2-1}}$. (At $x = 1$, $\theta = \frac{\pi}{2}$ and $\tan\theta$ is undefined.)` },
      { q: r`Write $\arctan x$ using arcsec, for $x > 0$.`, hint: 'tan θ = x/1. You need sec = hyp/adj.', answer: r`$\arctan x = \operatorname{arcsec}\sqrt{1+x^2}$`, solution: r`Opposite $x$, adjacent $1$, hypotenuse $\sqrt{1+x^2}$. $\sec\theta = \frac{\sqrt{1+x^2}}{1}$.` },
      { q: r`Fill in the blank: $\arcsin\left(-\tfrac{8}{17}\right) = \arctan(\_\_\_)$.`, hint: 'Triangle 8-15-17. Quadrant IV.', answer: r`$-\tfrac{8}{15}$`, solution: r`$\theta$ is in Quadrant IV (arcsin, negative input), opposite $-8$, hypotenuse $17$, adjacent $15$. $\tan\theta = -\frac{8}{15}$. arctan also answers in Quadrant IV for negative inputs, so $\arctan(-\frac{8}{15})$ is the same angle.` }
    ],
    quiz: [genPos, genPos, genRatio, genValue, genWhen],
    quizCount: 8
  });

  // ======================= 4-7b negative x =======================
  sec.topics.push({
    id: '4-7-range', title: 'Negative x: fixing the range (all 30 conversions)',
    notes: r`## Why $x > 0$ isn't the whole story

The triangle lives in **Quadrant I**. When $x < 0$, $\theta = \operatorname{arc}F\,x$ is somewhere else:

- **arcsin, arctan, arccsc** (right half): a negative input gives a **Quadrant IV** angle, $\theta < 0$.
- **arccos, arccot, arcsec** (top half): a negative input gives a **Quadrant II** angle, $\frac{\pi}{2} < \theta \le \pi$.

{{fig:u4-range-map}}

If the target function answers on the **other** half, the Quadrant I formula can't give the right angle.

## The fix (for $x < 0$)

1. **Same half, ratio keeps the sign of $x$?** Then the same formula already works. Examples: arccos ↔ arccot, arcsin ↔ arctan.
2. **Otherwise:** use the Quadrant I formula with $|x|$ to get the **reference angle** $\alpha$, then place it:
   - right-half $F$ (Quadrant IV): $\theta = -\alpha$
   - top-half $F$ (Quadrant II): $\theta = \pi - \alpha$

## Worked example: $\arcsin x$ as an arccos

$\sin\theta = \frac{x}{1}$: adjacent $\sqrt{1-x^2}$, so for $x \ge 0$: $\arcsin x = \arccos\sqrt{1-x^2}$.

For $x < 0$, $\theta$ is negative, but arccos is never negative. $\arccos\sqrt{1-x^2}$ is the reference angle, so

$$\arcsin x = \begin{cases} \arccos\sqrt{1-x^2}, & 0 \le x \le 1 \\ -\arccos\sqrt{1-x^2}, & -1 \le x < 0 \end{cases}$$

Check $x = -\frac12$: $\arcsin(-\frac12) = -\frac{\pi}{6}$, and $-\arccos\frac{\sqrt3}{2} = -\frac{\pi}{6}$ ✓.

## Worked example: $\operatorname{arcsec} x$ as an arctan

$\sec\theta = \frac{x}{1}$: hypotenuse $x$, adjacent $1$, opposite $\sqrt{x^2-1}$. So $\tan\theta = \sqrt{x^2-1}$.

For $x \le -1$, $\theta$ is in Quadrant II, but arctan only gives $-\frac{\pi}{2}$ to $\frac{\pi}{2}$:

$$\operatorname{arcsec} x = \begin{cases} \arctan\sqrt{x^2-1}, & x \ge 1 \\ \pi - \arctan\sqrt{x^2-1}, & x \le -1 \end{cases}$$

Check $x = -2$: $\operatorname{arcsec}(-2) = \frac{2\pi}{3}$, and $\pi - \arctan\sqrt3 = \pi - \frac{\pi}{3} = \frac{2\pi}{3}$ ✓.

## The reciprocal pair that needs a fix

$$\operatorname{arccot} x = \begin{cases} \arctan\frac1x, & x > 0 \\ \frac{\pi}{2}, & x = 0 \\ \pi + \arctan\frac1x, & x < 0 \end{cases}$$

The table writes the $x < 0$ case as $\pi - \arctan\frac{1}{|x|}$. That's the same thing.

> **Self-check:** plug in one negative number (like $x = -\frac12$, or $x = -2$ for arcsec/arccsc) and evaluate both sides with exact values. If they don't match, you need the fix.

## All 30 conversions

You don't need to memorize this table. Use it to check your work. Where it says $|x|$, you can also write $-x$, since $x < 0$ there.

` + FULL_TABLE,
    explore: {
      type: 'custom',
      intro: 'Turn on **Show the corrected formula** and drag $x$ below zero. The green dashed curve lands exactly on the true function.',
      setup(c, L) { convExplorer(c, L, { F: 'sin', G: 'cos' }); },
      tasks: r`1. arcsin → arccos: at $x = -0.5$, what's the gap between the curves? Why exactly that?
2. arcsec → arcsin: the dashed curve for $x \le -1$ is a reflection. Of what, and why does $\pi - (\ldots)$ fix it?
3. Find **all** the pairs where no fix is needed. (Hint: besides the four reciprocal flips arcsin ↔ arccsc and arccos ↔ arcsec, there are 6.)`
    },
    practice: [
      { q: r`Write $\arcsin x$ using arccos. Give both cases.`, hint: 'The x > 0 triangle gives arccos√(1−x²). What happens when x < 0?', answer: r`$\arcsin x = \arccos\sqrt{1-x^2}$ for $0 \le x \le 1$; $\;-\arccos\sqrt{1-x^2}$ for $-1 \le x < 0$`, solution: r`See the worked example in the notes. arcsin gives a negative angle for $x < 0$, but arccos is never negative, so negate the reference angle.` },
      { q: r`Write $\arccos x$ using arcsin. Give both cases.`, hint: 'For x < 0, θ is in Quadrant II.', answer: r`$\arccos x = \arcsin\sqrt{1-x^2}$ for $0 \le x \le 1$; $\;\pi - \arcsin\sqrt{1-x^2}$ for $-1 \le x < 0$`, solution: r`$\cos\theta = \frac{x}{1}$, opposite $\sqrt{1-x^2}$, so $\sin\theta = \sqrt{1-x^2}$. For $x < 0$, $\theta$ is in Quadrant II and $\arcsin\sqrt{1-x^2}$ is its reference angle, so $\theta = \pi - \arcsin\sqrt{1-x^2}$. Check $x = -\frac12$: $\pi - \arcsin\frac{\sqrt3}{2} = \pi - \frac{\pi}{3} = \frac{2\pi}{3} = \arccos(-\frac12)$ ✓.` },
      { q: r`Write $\operatorname{arccot} x$ using arctan. Give every case.`, hint: 'Reciprocal pair, but the ranges differ.', answer: r`$\arctan\frac1x$ for $x > 0$; $\;\frac{\pi}{2}$ at $x = 0$; $\;\pi + \arctan\frac1x$ for $x < 0$`, solution: r`$\cot\theta = x \Rightarrow \tan\theta = \frac1x$. For $x < 0$, $\theta \in (\frac{\pi}{2}, \pi)$, but $\arctan\frac1x$ is negative. Since tangent has period $\pi$, add $\pi$. Check $x = -1$: $\pi + \arctan(-1) = \frac{3\pi}{4} = \operatorname{arccot}(-1)$ ✓.` },
      { q: r`Write $\arctan x$ using arccos. Give both cases.`, hint: 'tan θ = x/1. cos = adj/hyp.', answer: r`$\arccos\dfrac{1}{\sqrt{1+x^2}}$ for $x \ge 0$; $\;-\arccos\dfrac{1}{\sqrt{1+x^2}}$ for $x < 0$`, solution: r`Adjacent $1$, hypotenuse $\sqrt{1+x^2}$. The ratio is always positive, so $\arccos$ of it is always the Quadrant I reference angle. For $x < 0$, $\arctan x$ is negative, so negate.` },
      { q: r`Write $\operatorname{arccsc} x$ using arccos. Give both cases.`, hint: 'csc θ = x/1: hypotenuse x, opposite 1. For x ≤ −1, θ is in Quadrant IV.', answer: r`$\arccos\dfrac{\sqrt{x^2-1}}{x}$ for $x \ge 1$; $\;-\arccos\dfrac{\sqrt{x^2-1}}{|x|}$ for $x \le -1$`, solution: r`Adjacent $\sqrt{x^2-1}$, so $\cos\theta = \frac{\sqrt{x^2-1}}{x}$ in Quadrant I. For $x \le -1$, $\theta \in [-\frac{\pi}{2}, 0)$; the reference angle uses $|x|$, then negate. Check $x = -2$: $-\arccos\frac{\sqrt3}{2} = -\frac{\pi}{6} = \operatorname{arccsc}(-2)$ ✓.` },
      { q: r`True or false: $\arcsin x = \operatorname{arccsc}\dfrac1x$ for every $x$ in $[-1, 1]$.`, hint: 'Same range. What about x = 0?', answer: 'False — it fails only at $x = 0$', solution: r`For $x \ne 0$, $\csc\theta = \frac1x$ and the ranges match, so it's true. But at $x = 0$, $\frac1x$ is undefined (and arccsc never outputs $0$).` },
      { q: r`Evaluate both sides at $x = -\frac{\sqrt3}{2}$ to decide: is $\arccos x = \operatorname{arcsec}\frac{1}{x}$ true there? Is $\arccos x = \arctan\frac{\sqrt{1-x^2}}{x}$?`, hint: 'arccos(−√3/2) = 5π/6.', answer: r`First: yes ($\frac{5\pi}{6}$ both). Second: no ($\arctan(-\frac{\sqrt3}{3}) = -\frac{\pi}{6}$).`, solution: r`$\operatorname{arcsec}(-\frac{2}{\sqrt3}) = \arccos(-\frac{\sqrt3}{2}) = \frac{5\pi}{6}$ ✓. $\frac{\sqrt{1-3/4}}{-\sqrt3/2} = \frac{1/2}{-\sqrt3/2} = -\frac{1}{\sqrt3}$, and $\arctan(-\frac{1}{\sqrt3}) = -\frac{\pi}{6}$. The fix is $\pi + (-\frac{\pi}{6}) = \frac{5\pi}{6}$.` }
    ],
    quiz: [genNeg, genNeg, genNeg, genWhen, genWhen, genPos],
    quizCount: 8
  });

  U4.CONV = CONV;
  U4.convCasesTex = casesTex;
})();
