/* Unit 4 — 4-8: solving equations that contain inverse circular functions (take a trig function of both sides, then CHECK). */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { INV, PI, TRIG } = U4;
  const r = String.raw;
  const sec = { id: '4-8', title: 'Equations with inverse functions', topics: [] };
  U.sections.push(sec);

  const at = Math.atan, as = v => INV.sin.f(v), ac = v => INV.cos.f(v);
  const S = U4.surd, ST = v => U4.surd(v, true);
  const listText = xs => xs.length ? xs.map(v => S(v)).join(', ') : 'no solution';
  const listTex = xs => xs.map(ST).join(',\\; ');
  const ft = v => U4.fracTex(v, 400);
  const kx = k => (k === 1 ? '' : k === -1 ? '-' : String(k)) + 'x';
  const dec = v => M.fmt(v, 4);
  const ANS = ' List **every** solution separated by commas (exact values like `sqrt(3)/2` or `2 - sqrt(3)`), or type `no solution`.';
  const PH = 'e.g. 1/6, -sqrt(3)/2';
  function poly(A, B, C) {
    const term = (c, v, first) => {
      if (c === 0) return '';
      const sg = c < 0 ? '-' : first ? '' : '+';
      const m = Math.abs(c) === 1 && v ? '' : String(Math.abs(c));
      return (first ? sg : ' ' + sg + ' ') + m + v;
    };
    let s = term(A, 'x^2', true);
    s += term(B, 'x', !s);
    s += term(C, '', !s);
    return s + ' = 0';
  }
  const textQ = (prompt, answers, explanation, verify) => ({
    type: 'text', mentionsUndefined: false, placeholder: PH, prompt: prompt + ANS,
    check: U4.valuesCheck(answers), answerText: listText(answers), explanation, verify
  });

  // ======================= figure =======================
  window.FIGURES['u4-complement'] = () => {
    const SV = U4.SV;
    return SV.open(420, 220, 'Right triangle: the two acute angles are arcsin x and arccos x, and they add to pi over 2') +
      SV.path('M40,180 L300,180 L300,40 Z', 'fill-soft') +
      SV.path('M286,180 L286,166 L300,166', 'thin') +
      SV.arc(40, 180, 42, 0, 28, 'acc3') + SV.text(98, 172, 'arccos x', 't-sm t-acc3', 'start') +
      SV.arc(300, 40, 34, 208, 270, 'acc') + SV.text(262, 92, 'arcsin x', 't-sm t-acc', 'end') +
      SV.text(170, 200, 'adjacent to the bottom angle: x', 't-sm') +
      SV.text(150, 100, '1', 't-b', 'end') +
      SV.text(308, 116, '√(1 − x²)', 't-sm', 'start') +
      SV.text(210, 26, 'the two acute angles add to π/2', 't-b t-acc2') +
      SV.close;
  };

  // ======================= explorer =======================
  const sq2 = Math.SQRT2, sq3 = Math.sqrt(3);
  const PRESETS = [
    { tex: r`\arctan(2x) + \arctan(3x) = \arctan 1`, L: x => at(2 * x) + at(3 * x), R: () => PI / 4, view: [-2.5, 2.5, -3.3, 3.3], xStep: 0.5, cands: [1 / 6, -1], note: 'Squaring is not involved, but tan(A+B) can’t tell a sum of π/4 from a sum of π/4 − π. x = −1 makes the sum −3π/4.' },
    { tex: r`2\arcsin x - \arccos(2x^2 - 1) = 0`, L: x => 2 * as(x), R: x => ac(2 * x * x - 1), view: [-1.3, 1.3, -3.5, 3.5], xStep: 0.25, cands: [sq2 / 2, -sq2 / 2], note: 'The right side is never negative, so a negative x (which makes the left side negative) can’t work.' },
    { tex: r`\operatorname{arcsec} x - \operatorname{arccsc} x = \tfrac{\pi}{6}`, L: x => INV.sec.f(x) - INV.csc.f(x), R: () => PI / 6, view: [-6, 6, -2, 3.5], xStep: 1, cands: [2], note: 'Using arcsec x + arccsc x = π/2 turns this into one equation with one answer.' },
    { tex: r`\arctan\dfrac{2x}{1-x^2} = \tfrac{\pi}{4} - \arctan x`, L: x => at(2 * x / (1 - x * x)), R: x => PI / 4 - at(x), view: [-6, 6, -2, 3], xStep: 1, ldom: [[-Infinity, -1], [-1, 1], [1, Infinity]], cands: [2 - sq3, 2 + sq3], note: 'Both candidates check! The left side jumps at x = ±1, and the right branch happens to meet the right side too.' },
    { tex: r`2\arctan x = \arcsin\tfrac45`, L: x => 2 * at(x), R: () => as(0.8), view: [-4, 4, -3.3, 3.3], xStep: 1, cands: [0.5, 2], note: 'sin(2·arctan 2) is also 4/5, but 2·arctan 2 ≈ 2.21 is past π/2, and arcsin never is.' },
    { tex: r`\arcsin x = \arctan(2x)`, L: x => as(x), R: x => at(2 * x), view: [-1.3, 1.3, -2, 2], xStep: 0.25, cands: [0, sq3 / 2, -sq3 / 2], note: 'Three solutions. Dividing by x would lose x = 0.' },
    { tex: r`\arccos x = \arcsin(\sqrt3\,x)`, L: x => ac(x), R: x => as(sq3 * x), view: [-1.3, 1.3, -2, 3.5], xStep: 0.25, cands: [0.5, -0.5], note: 'Squaring created x = −1/2. There the left side is 2π/3 and the right side is −π/3.' }
  ];
  function eqExplorer(container, L) {
    const { Graph, R } = L;
    const st = { i: 0, cands: true };
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
    const sel = R.el('select', { class: 'select' });
    PRESETS.forEach((p, i) => sel.appendChild(R.el('option', { value: String(i), text: 'Equation ' + (i + 1) })));
    top.appendChild(sel);
    const sw = R.el('div', { class: 'toggles' }); top.appendChild(sw);
    Graph.toggle(sw, 'Show the candidates from the algebra', true, v => { st.cands = v; draw(); });
    const eq = R.el('div', { class: 'equation' }); root.appendChild(eq);
    const box = R.el('div'); root.appendChild(box);
    const g = new Graph(box, { xUnit: 'num', yUnit: 'rad', height: 340, interactive: false, yStep: PI / 2 });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);
    sel.addEventListener('change', () => { st.i = +sel.value; draw(); });
    function draw() {
      const p = PRESETS[st.i], pal = g.palette || {};
      const [x0, x1, y0, y1] = p.view;
      g.update({ xMin: x0, xMax: x1, yMin: y0, yMax: y1, xStep: p.xStep });
      const fns = (p.ldom || [[-Infinity, Infinity]]).map((d, i) => ({ f: p.L, domain: d, width: 3, color: pal.accent, label: i ? undefined : 'left side' }));
      fns.push({ f: p.R, width: 3, dashed: true, color: pal.accent2, label: 'right side' });
      const points = [], vlines = [];
      let rows = '';
      p.cands.forEach(c => {
        const a = p.L(c), b = p.R(c), ok = Math.abs(a - b) < 1e-9;
        if (st.cands) {
          if (ok) points.push({ x: c, y: a, color: pal.accent3, r: 6, label: 'x = ' + S(c) });
          else { vlines.push({ x: c, color: pal.accent2 }); points.push({ x: c, y: a, hollow: true, color: pal.accent }); points.push({ x: c, y: b, hollow: true, color: pal.accent2, label: 'x = ' + S(c) + ' ✗' }); }
          rows += '<div class="info-row"><span>x = ' + S(c) + '</span><strong>' + M.fmt(a, 4) + ' vs ' + M.fmt(b, 4) + (ok ? ' ✓ solution' : ' ✗ extraneous') + '</strong></div>';
        }
      });
      g.update({ fns, points, vlines });
      eq.innerHTML = R.tex(p.tex, true);
      info.innerHTML = st.cands ? rows + '<div class="info-note">' + R.escapeHtml(p.note) + '</div>' : '<div class="info-note">Solutions are where the solid and dashed curves cross. Predict them, then show the candidates.</div>';
    }
    draw();
  }

  // ======================= generators: take a trig function of both sides =======================
  function genSum(rng) {
    const [a, b] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [1, 5], [2, 5], [3, 4], [1, 6]]);
    const ab = a * b, ms = [];
    for (let m = 2; m <= 9; m++) if (m * m > ab) ms.push(m);
    const m = rng.pick(ms), s = rng.sign();
    let P = (a + b) * s * m, Q = m * m - ab;
    const g = M.gcd(P, Q); P /= g; Q /= g;
    const c = P / Q, x0 = s / m, x1 = -s * m / ab;
    const rhs = Math.abs(c) === 1 && rng.bool(0.6) ? (c < 0 ? '-' : '') + '\\frac{\\pi}{4}' : '\\arctan\\left(' + ft(c) + '\\right)';
    const L = x => at(a * x) + at(b * x);
    return textQ('Solve: $\\arctan(' + kx(a) + ') + \\arctan(' + kx(b) + ') = ' + rhs + '$.', [x0],
      'Take $\\tan$ of both sides with $\\tan(A+B) = \\frac{\\tan A + \\tan B}{1 - \\tan A\\tan B}$: $\\frac{' + (a + b) + 'x}{1 - ' + (ab === 1 ? '' : ab) + 'x^2} = ' + ft(c) + '$. Clear fractions: $' + poly(ab * P, (a + b) * Q, -P) + '$, so $x = ' + ST(x0) + '$ or $x = ' + ST(x1) + '$.\n\n**Check** $x = ' + ST(x1) + '$: the left side is $\\approx ' + dec(L(x1)) + '$ but the right side is $\\approx ' + dec(at(c)) + '$. Extraneous (the two arctans add past $\\pm\\frac{\\pi}{2}$). $x = ' + ST(x0) + '$ checks. **Answer:** $x = ' + ST(x0) + '$.',
      { f: x => L(x) - at(c), lo: -30, hi: 30 });
  }
  function genDiff(rng) {
    for (let tries = 0; tries < 100; tries++) {
      const [a, b] = rng.pick([[2, 1], [3, 1], [4, 1], [3, 2], [6, 1], [5, 1]]);
      const [p, q] = rng.pick([[1, 1], [1, 2], [1, 3], [2, 1], [3, 1], [2, 3], [3, 2], [1, 4]]);
      const ab = a * b;
      if (ab * p * p === q * q) continue;
      const s = rng.sign();
      let P = s * (a - b) * p * q, Q = ab * p * p + q * q;
      const g = M.gcd(P, Q); P /= g; Q /= g;
      const c = P / Q, r1 = s * p / q, r2 = s * q / (ab * p);
      const L = x => at(a * x) - at(b * x);
      return textQ('Solve: $\\arctan(' + kx(a) + ') - \\arctan(' + kx(b) + ') = \\arctan\\left(' + ft(c) + '\\right)$.', [r1, r2],
        'Take $\\tan$ of both sides with $\\tan(A-B) = \\frac{\\tan A - \\tan B}{1 + \\tan A\\tan B}$: $\\frac{' + (a - b === 1 ? '' : a - b) + 'x}{1 + ' + (ab === 1 ? '' : ab) + 'x^2} = ' + ft(c) + '$. Clear fractions: $' + poly(ab * P, -(a - b) * Q, P) + '$, so $x = ' + ST(r1) + '$ or $x = ' + ST(r2) + '$.\n\n**Check both.** Each has the same sign as the right side, and when $x$ has one sign the difference of the two arctans stays between $-\\frac{\\pi}{2}$ and $\\frac{\\pi}{2}$, so **both** work. (Not every equation has an extraneous root. You still have to check.)',
        { f: x => L(x) - at(c), lo: -30, hi: 30 });
    }
    return genSum(rng);
  }
  function genSinCos(rng) {
    const a = rng.int(1, 3), b = rng.int(1, 3), flip = rng.bool();
    const x0 = 1 / Math.sqrt(a * a + b * b);
    const left = '\\arcsin(' + kx(a) + ')', right = '\\arccos(' + kx(b) + ')';
    return textQ('Solve: $' + (flip ? right + ' = ' + left : left + ' = ' + right) + '$.', [x0],
      'Take $\\sin$ of both sides. $\\sin(\\arccos(' + kx(b) + ')) = \\sqrt{1 - ' + (b * b === 1 ? '' : b * b) + 'x^2}$ (triangle). So $' + kx(a) + ' = \\sqrt{1 - ' + (b * b === 1 ? '' : b * b) + 'x^2}$. Square: $' + (a * a + b * b) + 'x^2 = 1$, so $x = \\pm' + ST(x0) + '$.\n\n**Check** the negative one: $\\arcsin$ of a negative number is negative, but $\\arccos$ of a negative number is between $\\frac{\\pi}{2}$ and $\\pi$. Extraneous (squaring created it). **Answer:** $x = ' + ST(x0) + '$.',
      { f: x => as(a * x) - ac(b * x), lo: -1, hi: 1 });
  }
  function genSinTan(rng) {
    const [a, b] = rng.pick([[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [2, 5]]);
    const x0 = Math.sqrt(b * b - a * a) / (a * b);
    return textQ('Solve: $\\arcsin(' + kx(a) + ') = \\arctan(' + kx(b) + ')$.', [0, x0, -x0],
      'Take $\\sin$ of both sides. From the triangle, $\\sin(\\arctan(' + kx(b) + ')) = \\frac{' + kx(b) + '}{\\sqrt{1 + ' + b * b + 'x^2}}$. So $' + kx(a) + ' = \\frac{' + kx(b) + '}{\\sqrt{1+' + b * b + 'x^2}}$.\n\n**Don’t divide by $x$.** Either $x = 0$, or $\\sqrt{1 + ' + b * b + 'x^2} = \\frac{' + b + '}{' + a + '}$, which gives $x^2 = \\frac{' + (b * b - a * a) + '}{' + a * a * b * b + '}$ and $x = \\pm' + ST(x0) + '$.\n\n**Check:** both sides are right-half functions with the sign of $x$, and each candidate makes the sines equal, so all three work. **Answer:** $x = 0, \\pm' + ST(x0) + '$.',
      { f: x => as(a * x) - at(b * x), lo: -1 / a, hi: 1 / a });
  }
  function genDouble(rng) {
    if (rng.bool()) {
      const [c, cT, x0] = rng.pick([[0.5, '\\tfrac12', 0.5], [0, '0', sq2 / 2], [-0.5, '-\\tfrac12', sq3 / 2], [-1, '-1', 1]]);
      const form = rng.bool() ? '2\\arcsin x = \\arccos(' + cT + ')' : '2\\arcsin x - \\arccos(' + cT + ') = 0';
      return textQ('Solve: $' + form + '$.', [x0],
        'Take $\\cos$ of both sides. $\\cos(2\\arcsin x) = 1 - 2\\sin^2(\\arcsin x) = 1 - 2x^2$. So $1 - 2x^2 = ' + cT + '$, $x^2 = ' + ST(x0 * x0) + '$, $x = \\pm' + ST(x0) + '$.\n\n**Check:** $\\arccos(' + cT + ') \\ge 0$, but a negative $x$ makes $2\\arcsin x$ negative. Extraneous. **Answer:** $x = ' + ST(x0) + '$.',
        { f: x => 2 * as(x) - ac(c), lo: -1, hi: 1 });
    }
    const [p, q] = rng.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]), sg = rng.sign();
    const sv = sg * 2 * p * q / (p * p + q * q), x0 = sg * p / q, x1 = sg * q / p;
    return textQ('Solve: $2\\arctan x = \\arcsin\\left(' + ft(sv) + '\\right)$.', [x0],
      'Take $\\sin$ of both sides. With $\\theta = \\arctan x$: $\\sin 2\\theta = 2\\sin\\theta\\cos\\theta = 2\\cdot\\frac{x}{\\sqrt{1+x^2}}\\cdot\\frac{1}{\\sqrt{1+x^2}} = \\frac{2x}{1+x^2}$. So $\\frac{2x}{1+x^2} = ' + ft(sv) + '$, giving $x = ' + ST(x0) + '$ or $x = ' + ST(x1) + '$.\n\n**Check** $x = ' + ST(x1) + '$: $|x| > 1$ makes $|2\\arctan x| > \\frac{\\pi}{2}$ ($\\approx ' + dec(2 * at(x1)) + '$), but $\\arcsin$ never goes past $\\frac{\\pi}{2}$. Extraneous. **Answer:** $x = ' + ST(x0) + '$.',
      { f: x => 2 * at(x) - as(sv), lo: -30, hi: 30 });
  }

  // ======================= generators: complementary pairs =======================
  const COF = { sin: 'cos', cos: 'sin', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  const PHI = {
    sin: [-PI / 2, -PI / 3, -PI / 4, -PI / 6, 0, PI / 6, PI / 4, PI / 3, PI / 2],
    cos: [0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6, PI],
    tan: [-PI / 3, -PI / 4, -PI / 6, 0, PI / 6, PI / 4, PI / 3],
    cot: [PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6],
    sec: [0, PI / 6, PI / 4, PI / 3, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6, PI],
    csc: [-PI / 2, -PI / 3, -PI / 4, -PI / 6, PI / 6, PI / 4, PI / 3, PI / 2]
  };
  const clean = v => Math.abs(v) < 1e-12 ? 0 : v;
  const arcK = (F, k) => INV[F].tex + '(' + kx(k) + ')';
  const IDENT = { sin: '\\arcsin u + \\arccos u', cos: '\\arcsin u + \\arccos u', tan: '\\arctan u + \\operatorname{arccot} u', cot: '\\arctan u + \\operatorname{arccot} u', sec: '\\operatorname{arcsec} u + \\operatorname{arccsc} u', csc: '\\operatorname{arcsec} u + \\operatorname{arccsc} u' };
  function genComp(rng) {
    const F = rng.pick(Object.keys(COF)), G = COF[F], k = rng.pick([1, 1, 2, 3]);
    const rg = INV[F].rng;
    const phi = rng.pick(PHI[F].filter(p => Math.abs(p - rg.lo) > 1e-9 && Math.abs(p - rg.hi) > 1e-9));
    const u = clean(TRIG[F](phi)), x0 = u / k, c = 2 * phi - PI / 2;
    const eq = Math.abs(c) < 1e-12 ? arcK(F, k) + ' = ' + arcK(G, k) : arcK(F, k) + ' - ' + arcK(G, k) + ' = ' + M.texPi(c);
    return textQ('Solve: $' + eq + '$.', [x0],
      'Use $' + IDENT[F] + ' = \\frac{\\pi}{2}$ with $u = ' + kx(k) + '$: replace $' + arcK(G, k) + '$ by $\\frac{\\pi}{2} - ' + arcK(F, k) + '$. Then $2\\,' + arcK(F, k) + ' - \\frac{\\pi}{2} = ' + M.texPi(c) + '$, so $' + arcK(F, k) + ' = ' + M.texPi(phi) + '$. That means $' + kx(k) + ' = ' + TRIG_TEX(F) + M.texPi(phi) + ' = ' + ST(u) + '$' + (k === 1 ? '' : ', so $x = ' + ST(x0) + '$') + '. (It is in the range of ' + INV[F].name + ', so it checks.)',
      { f: x => INV[F].f(k * x) - INV[G].f(k * x) - c, lo: -12, hi: 12 });
  }
  function TRIG_TEX(F) { return '\\' + F + ' '; }
  function genMultiple(rng) {
    const F = rng.pick(['sin', 'cos', 'tan', 'cot', 'sec', 'csc']), G = COF[F];
    const [m, mT] = rng.pick([[2, '2'], [0.5, '\\tfrac12'], [1, '']]);
    const phi = m * PI / (2 * (1 + m)), u = TRIG[F](phi);
    return textQ('Solve: $' + INV[F].tex + ' x = ' + mT + INV[G].tex + ' x$.', [u],
      'Replace $' + INV[G].tex + ' x$ with $\\frac{\\pi}{2} - ' + INV[F].tex + ' x$: $' + INV[F].tex + ' x = ' + mT + '\\left(\\frac{\\pi}{2} - ' + INV[F].tex + ' x\\right)$. Collect: $' + (m === 1 ? '2' : m === 2 ? '3' : '\\tfrac32') + INV[F].tex + ' x = ' + M.texPi(m * PI / 2) + '$, so $' + INV[F].tex + ' x = ' + M.texPi(phi) + '$ and $x = ' + TRIG_TEX(F) + M.texPi(phi) + ' = ' + ST(u) + '$.',
      { f: x => INV[F].f(x) - m * INV[G].f(x), lo: -12, hi: 12 });
  }
  function genRange(rng) {
    const kind = rng.pick(['sum', 'range', 'ok', 'ok']);
    if (kind === 'sum') {
      const F = rng.pick(['sin', 'tan', 'sec']), G = COF[F], c = rng.pick([PI / 3, PI, PI / 4, 2 * PI / 3, 0]);
      return textQ('Solve: $' + INV[F].tex + ' x + ' + INV[G].tex + ' x = ' + M.texPi(c) + '$.', [],
        'For every $x$ in the domain, $' + INV[F].tex + ' x + ' + INV[G].tex + ' x = \\frac{\\pi}{2}$. It can never equal $' + M.texPi(c) + '$. **No solution.**',
        { f: x => INV[F].f(x) + INV[G].f(x) - c, lo: -12, hi: 12 });
    }
    const F = rng.pick(['sin', 'cos', 'tan', 'cot', 'sec', 'csc']), k = rng.pick([1, 2, 3]);
    if (kind === 'range') {
      const BAD = { sin: [2 * PI / 3, -3 * PI / 4, PI], cos: [-PI / 3, -PI / 6, 3 * PI / 2], tan: [PI / 2, -PI / 2, 2 * PI / 3], cot: [0, PI, -PI / 4], sec: [PI / 2, -PI / 3, 3 * PI / 2], csc: [0, 2 * PI / 3, -PI] }[F];
      const v = rng.pick(BAD);
      return textQ('Solve: $' + arcK(F, k) + ' = ' + M.texPi(v) + '$.', [],
        'The range of ' + INV[F].name + ' is ' + INV[F].rangeText + '. $' + M.texPi(v) + '$ is not in it, so **no solution**. (Taking $\\' + F + '$ of both sides would give a wrong "answer" — the range check catches it.)',
        { f: x => INV[F].f(k * x) - v, lo: -12, hi: 12 });
    }
    const phi = rng.pick(PHI[F].filter(p => INV[F].f(TRIG[F](p)) !== undefined));
    const u = clean(TRIG[F](phi));
    return textQ('Solve: $' + arcK(F, k) + ' = ' + M.texPi(phi) + '$.', [u / k],
      '$' + M.texPi(phi) + '$ is in the range of ' + INV[F].name + ', so $' + kx(k) + ' = ' + TRIG_TEX(F) + M.texPi(phi) + ' = ' + ST(u) + '$' + (k === 1 ? '' : ' and $x = ' + ST(u / k) + '$') + '.',
      { f: x => INV[F].f(k * x) - phi, lo: -12, hi: 12 });
  }

  // ======================= 4-8a take a trig function of both sides =======================
  sec.topics.push({
    id: '4-8-solve', title: 'Solving: take a trig function of both sides, then check',
    notes: r`## The strategy

1. **Arrange** the equation so each side is an angle (one inverse function, or a sum of them).
2. **Take the same trig function of both sides.** Pick the one that simplifies best:
   - arctan sums or differences → $\tan$, using $\tan(A \pm B)$
   - a side that's an arccos → $\cos$
   - a side that's an arcsin → $\sin$
3. **Simplify.** $\sin(\arcsin u) = u$, and use the triangle for "mixed" ones like $\cos(\arcsin u)$.
4. **Solve** the algebra (usually a quadratic).
5. **Check every candidate in the original equation.** This step is required.

## Why checking is required

Taking a trig function is **not reversible**. $\tan A = \tan B$ doesn't mean $A = B$ (they could differ by $\pi$), and squaring adds sign errors. So the algebra can hand you **extraneous** candidates. Check each one with a calculator or exact values, or by looking at signs and ranges.

## Toolkit

**Trig of an inverse** (from the triangles):

| **** | **$\arcsin x$** | **$\arccos x$** | **$\arctan x$** |
| --- | --- | --- | --- |
| $\sin$ | $x$ | $\sqrt{1-x^2}$ | $\frac{x}{\sqrt{1+x^2}}$ |
| $\cos$ | $\sqrt{1-x^2}$ | $x$ | $\frac{1}{\sqrt{1+x^2}}$ |
| $\tan$ | $\frac{x}{\sqrt{1-x^2}}$ | $\frac{\sqrt{1-x^2}}{x}$ | $x$ |

**Sum, difference, and double-angle formulas:**

- $\sin(A \pm B) = \sin A\cos B \pm \cos A\sin B$
- $\cos(A \pm B) = \cos A\cos B \mp \sin A\sin B$
- $\tan(A \pm B) = \dfrac{\tan A \pm \tan B}{1 \mp \tan A\tan B}$
- $\sin 2A = 2\sin A\cos A$, $\quad\cos 2A = 1 - 2\sin^2 A = 2\cos^2 A - 1$, $\quad\tan 2A = \dfrac{2\tan A}{1 - \tan^2 A}$

## Worked example 1: $\arctan(x+1) + \arctan(x-1) = \arctan 2$

Take $\tan$: $\dfrac{(x+1) + (x-1)}{1 - (x+1)(x-1)} = 2 \Rightarrow \dfrac{2x}{2 - x^2} = 2 \Rightarrow x^2 + x - 2 = 0$, so $x = 1$ or $x = -2$.

- $x = 1$: $\arctan 2 + \arctan 0 = \arctan 2$ ✓
- $x = -2$: $\arctan(-1) + \arctan(-3) \approx -0.785 - 1.249 = -2.03$, but $\arctan 2 \approx 1.107$ ✗ (it differs by exactly $\pi$)

**Answer:** $x = 1$.

## Worked example 2: $\arccos x = \arcsin(\sqrt3\,x)$

Take $\sin$: $\sin(\arccos x) = \sqrt{1-x^2}$, so $\sqrt{1-x^2} = \sqrt3\,x$. Square: $1 - x^2 = 3x^2$, so $x = \pm\frac12$.

- $x = \frac12$: $\arccos\frac12 = \frac{\pi}{3}$ and $\arcsin\frac{\sqrt3}{2} = \frac{\pi}{3}$ ✓
- $x = -\frac12$: $\frac{2\pi}{3}$ vs. $-\frac{\pi}{3}$ ✗ (squaring hid the sign)

**Answer:** $x = \frac12$.

> **Shortcut for checking:** compare the **sign or quadrant** of each side. arccos is never negative. arcsin and arctan have the sign of their input. A sum of two arctans is between $-\pi$ and $\pi$.

> **Common mistake:** dividing both sides by $x$. You lose $x = 0$. Move everything to one side and factor.

> **Answer format:** exact values. Fractions, radicals like \`sqrt(3)/2\`, or \`2 - sqrt(3)\`. No decimals unless the problem allows them.`,
    explore: {
      type: 'custom',
      intro: 'Each side of the equation is drawn as a curve. **Solutions are where they cross.** Turn on the candidates to see which algebra answers are real and which are extraneous.',
      setup(c, L) { eqExplorer(c, L); },
      tasks: r`1. Equation 1: at the extraneous candidate, how far apart are the two sides? Why exactly that amount?
2. Equation 4: both candidates work. Find where the left curve jumps, and explain why the far-right candidate still works.
3. Equation 6: before showing candidates, count the crossings. Which algebra step could lose one of them?`
    },
    practice: [
      { q: r`Solve: $\arctan(2x) + \arctan(3x) = \arctan(1)$.`, hint: 'Take tan of both sides. tan(A + B) = (tan A + tan B)/(1 − tan A tan B).', answer: r`$x = \tfrac16$`, solution: r`$\frac{2x + 3x}{1 - 6x^2} = 1 \Rightarrow 5x = 1 - 6x^2 \Rightarrow 6x^2 + 5x - 1 = 0 \Rightarrow (6x - 1)(x + 1) = 0$. So $x = \frac16$ or $x = -1$.

**Check** $x = -1$: $\arctan(-2) + \arctan(-3) < 0$, but $\arctan 1 = \frac{\pi}{4} > 0$ ✗. (It's $-\frac{3\pi}{4}$, off by $\pi$.)

**Check** $x = \frac16$: $\arctan\frac13 + \arctan\frac12 = \frac{\pi}{4}$ ✓.` },
      { q: r`Solve: $2\arcsin(x) - \arccos(2x^2 - 1) = 0$.`, hint: 'Move the arccos over and take cos of both sides. cos(2A) = 1 − 2sin²A.', answer: r`$x = \tfrac{\sqrt2}{2}$`, solution: r`$2\arcsin x = \arccos(2x^2 - 1)$. Take $\cos$: $\cos(2\arcsin x) = 1 - 2\sin^2(\arcsin x) = 1 - 2x^2$. So $1 - 2x^2 = 2x^2 - 1$, $x^2 = \frac12$, $x = \pm\frac{\sqrt2}{2}$.

**Check** $x = \frac{\sqrt2}{2}$: $2\cdot\frac{\pi}{4} = \frac{\pi}{2}$ and $\arccos(0) = \frac{\pi}{2}$ ✓.

**Check** $x = -\frac{\sqrt2}{2}$: left $= -\frac{\pi}{2}$, but arccos is never negative ✗.` },
      { q: r`Solve: $\operatorname{arcsec} x - \operatorname{arccsc} x = \dfrac{\pi}{6}$.`, hint: 'arcsec x + arccsc x = π/2. (See the next topic.)', answer: r`$x = 2$`, solution: r`Replace $\operatorname{arccsc} x$ with $\frac{\pi}{2} - \operatorname{arcsec} x$: $2\operatorname{arcsec} x - \frac{\pi}{2} = \frac{\pi}{6}$, so $\operatorname{arcsec} x = \frac{\pi}{3}$ and $x = \sec\frac{\pi}{3} = 2$.

**Another way:** $\operatorname{arcsec} x = \arccos\frac1x$ and $\operatorname{arccsc} x = \arcsin\frac1x$, then use $\arcsin u + \arccos u = \frac{\pi}{2}$.

Check: $\frac{\pi}{3} - \frac{\pi}{6} = \frac{\pi}{6}$ ✓.` },
      { q: r`Solve: $\arctan\left(\dfrac{2x}{1-x^2}\right) = \dfrac{\pi}{4} - \arctan x$.`, hint: 'Take tan of both sides. Right side: tan(π/4 − B) = (1 − tan B)/(1 + tan B).', answer: r`$x = 2 - \sqrt3$ and $x = 2 + \sqrt3$ (both work)`, solution: r`Left: $\frac{2x}{1-x^2}$. Right: $\tan(\frac{\pi}{4} - \arctan x) = \frac{1 - x}{1 + x}$.

$\frac{2x}{(1-x)(1+x)} = \frac{1-x}{1+x} \Rightarrow 2x = (1-x)^2 \Rightarrow x^2 - 4x + 1 = 0 \Rightarrow x = 2 \pm \sqrt3$.

**Check** $x = 2 - \sqrt3 = \tan\frac{\pi}{12}$: $\frac{2x}{1-x^2} = \tan\frac{\pi}{6}$, so the left side is $\frac{\pi}{6}$. Right: $\frac{\pi}{4} - \frac{\pi}{12} = \frac{\pi}{6}$ ✓.

**Check** $x = 2 + \sqrt3 = \tan\frac{5\pi}{12}$: $\frac{2x}{1-x^2} = \tan\frac{5\pi}{6} = -\frac{\sqrt3}{3}$, so the left side is $\arctan(-\frac{\sqrt3}{3}) = -\frac{\pi}{6}$. Right: $\frac{\pi}{4} - \frac{5\pi}{12} = -\frac{\pi}{6}$ ✓.

Both work. Don't throw one away without checking.` },
      { q: r`Solve: $2\arctan x = \arcsin\tfrac45$.`, hint: 'Take sin. sin(2θ) = 2 sin θ cos θ, with θ = arctan x.', answer: r`$x = \tfrac12$`, solution: r`$\sin(2\arctan x) = 2\cdot\frac{x}{\sqrt{1+x^2}}\cdot\frac{1}{\sqrt{1+x^2}} = \frac{2x}{1+x^2}$. So $\frac{2x}{1+x^2} = \frac45 \Rightarrow 4x^2 - 10x + 4 = 0 \Rightarrow (2x - 1)(x - 2) = 0$.

**Check** $x = 2$: $2\arctan 2 \approx 2.21 > \frac{\pi}{2}$, but $\arcsin\frac45 \approx 0.93$ ✗. **Check** $x = \frac12$: $2\arctan\frac12 \approx 0.927$ ✓.` },
      { q: r`Solve: $\arcsin x = \arctan(2x)$.`, hint: 'Take sin of both sides. Don’t divide by x.', answer: r`$x = 0,\ \pm\tfrac{\sqrt3}{2}$`, solution: r`$x = \frac{2x}{\sqrt{1+4x^2}} \Rightarrow x\left(1 - \frac{2}{\sqrt{1+4x^2}}\right) = 0$. So $x = 0$ or $\sqrt{1+4x^2} = 2 \Rightarrow x^2 = \frac34$.

Check $x = \frac{\sqrt3}{2}$: $\arcsin\frac{\sqrt3}{2} = \frac{\pi}{3} = \arctan\sqrt3$ ✓. By symmetry $-\frac{\sqrt3}{2}$ works too, and $x = 0$ obviously does.` }
    ],
    quiz: [genSum, genSum, genDiff, genSinCos, genSinTan, genDouble, genDouble],
    quizCount: 7
  });

  // ======================= 4-8b complementary pairs =======================
  sec.topics.push({
    id: '4-8-complement', title: 'Shortcut: arcsin x + arccos x = π/2 (and friends)',
    notes: r`## Three identities

$$\arcsin x + \arccos x = \frac{\pi}{2} \qquad \arctan x + \operatorname{arccot} x = \frac{\pi}{2} \qquad \operatorname{arcsec} x + \operatorname{arccsc} x = \frac{\pi}{2}$$

Each one holds for **every** $x$ in the domain (with the precalc ranges).

**Why:** in a right triangle, the two acute angles add to $\frac{\pi}{2}$. If one acute angle has sine $x$, the other has cosine $x$.

{{fig:u4-complement}}

## How to use them

When an equation has a function **and its partner** with the **same input**, replace the partner:

$$\arccos u \;\to\; \frac{\pi}{2} - \arcsin u, \quad \operatorname{arccot} u \;\to\; \frac{\pi}{2} - \arctan u, \quad \operatorname{arccsc} u \;\to\; \frac{\pi}{2} - \operatorname{arcsec} u$$

Now there's only one inverse function. Solve for it, then undo it.

## Worked example: $\arctan x - \operatorname{arccot} x = \frac{\pi}{6}$

$\arctan x - \left(\frac{\pi}{2} - \arctan x\right) = \frac{\pi}{6} \Rightarrow 2\arctan x = \frac{2\pi}{3} \Rightarrow \arctan x = \frac{\pi}{3} \Rightarrow x = \sqrt3$.

## Worked example: $\arcsin x = 2\arccos x$

$\arcsin x = 2\left(\frac{\pi}{2} - \arcsin x\right) \Rightarrow 3\arcsin x = \pi \Rightarrow \arcsin x = \frac{\pi}{3} \Rightarrow x = \frac{\sqrt3}{2}$.

## "No solution" traps

- $\arcsin x + \arccos x = \frac{\pi}{3}$: the left side is **always** $\frac{\pi}{2}$, so there's **no solution**.
- $\arccos(2x) = -\frac{\pi}{4}$: arccos is never negative, so there's **no solution**. Taking cos of both sides would give $x = \frac{\sqrt2}{4}$, which is wrong. Check the range first.

> **Common mistake:** using the identity when the inputs are different, like $\arcsin x + \arccos 2x$. The shortcut only works when both functions have the **same** input.`,
    explore: {
      type: 'custom',
      intro: 'Equation 3 is the arcsec/arccsc example. Compare the left side with the line $y = \\frac{\\pi}{6}$, then think about the graph of $\\operatorname{arcsec} x + \\operatorname{arccsc} x$. (It would be a flat line at $\\frac{\\pi}{2}$.)',
      setup(c, L) { eqExplorer(c, L); }
    },
    practice: [
      { q: r`Solve: $\arccos x - \arcsin x = -\dfrac{\pi}{6}$.`, hint: 'Replace arccos x with π/2 − arcsin x.', answer: r`$x = \tfrac{\sqrt3}{2}$`, solution: r`$\frac{\pi}{2} - 2\arcsin x = -\frac{\pi}{6} \Rightarrow \arcsin x = \frac{\pi}{3} \Rightarrow x = \frac{\sqrt3}{2}$. Check: $\frac{\pi}{6} - \frac{\pi}{3} = -\frac{\pi}{6}$ ✓.` },
      { q: r`Solve: $\arcsin(2x) = \arccos(2x)$.`, hint: 'Both have input 2x.', answer: r`$x = \tfrac{\sqrt2}{4}$`, solution: r`$\arcsin(2x) = \frac{\pi}{2} - \arcsin(2x) \Rightarrow \arcsin(2x) = \frac{\pi}{4} \Rightarrow 2x = \frac{\sqrt2}{2} \Rightarrow x = \frac{\sqrt2}{4}$.` },
      { q: r`Solve: $\operatorname{arccot} x = 2\arctan x$.`, hint: 'arccot x = π/2 − arctan x.', answer: r`$x = \tfrac{\sqrt3}{3}$`, solution: r`$\frac{\pi}{2} - \arctan x = 2\arctan x \Rightarrow \arctan x = \frac{\pi}{6} \Rightarrow x = \frac{\sqrt3}{3}$.` },
      { q: r`Solve: $\operatorname{arcsec} x + \operatorname{arccsc} x = \pi$.`, hint: 'What does the left side always equal?', answer: 'No solution', solution: r`The left side is $\frac{\pi}{2}$ for every $x$ in the domain. It's never $\pi$.` },
      { q: r`Solve: $\operatorname{arcsec}(3x) = \dfrac{\pi}{2}$.`, hint: 'Is π/2 in the range of arcsec?', answer: 'No solution', solution: r`arcsec's range is $[0, \pi]$ **except** $\frac{\pi}{2}$ (that would need $\cos = 0$, i.e. $\sec$ undefined).` },
      { q: r`Solve: $\operatorname{arccsc} x - \operatorname{arcsec} x = \dfrac{\pi}{6}$.`, hint: 'Replace arcsec x with π/2 − arccsc x.', answer: r`$x = \tfrac{2\sqrt3}{3}$`, solution: r`$2\operatorname{arccsc} x - \frac{\pi}{2} = \frac{\pi}{6} \Rightarrow \operatorname{arccsc} x = \frac{\pi}{3} \Rightarrow x = \csc\frac{\pi}{3} = \frac{2}{\sqrt3} = \frac{2\sqrt3}{3}$.` }
    ],
    quiz: [genComp, genComp, genComp, genMultiple, genRange, genRange],
    quizCount: 7
  });
})();
