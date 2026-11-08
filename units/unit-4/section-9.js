/* Unit 4 — 4-9: trig inequalities on [0, 2π) (boundary points from inverse functions, then a sign chart). */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { PI } = U4;
  const r = String.raw;
  const sec = { id: '4-9', title: 'Trig inequalities', topics: [] };
  U.sections.push(sec);

  const TWO = 2 * PI;
  const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan };
  const OPS = { '<': '<', '<=': '\\le', '>': '>', '>=': '\\ge' };
  const OPW = { '<': '<', '<=': '≤', '>': '>', '>=': '≥' };
  const uniq = a => a.slice().sort((p, q) => p - q).filter((v, i, s) => i === 0 || v - s[i - 1] > 1e-9);
  const norm = v => { const t = ((v % TWO) + TWO) % TWO; return TWO - t < 1e-12 ? 0 : t; };
  const SPECIAL = {
    sin: [[-1, '-1'], [-Math.sqrt(3) / 2, '-\\tfrac{\\sqrt3}{2}'], [-Math.SQRT2 / 2, '-\\tfrac{\\sqrt2}{2}'], [-0.5, '-\\tfrac12'], [0, '0'], [0.5, '\\tfrac12'], [Math.SQRT2 / 2, '\\tfrac{\\sqrt2}{2}'], [Math.sqrt(3) / 2, '\\tfrac{\\sqrt3}{2}']],
    tan: [[-Math.sqrt(3), '-\\sqrt3'], [-1, '-1'], [-Math.sqrt(3) / 3, '-\\tfrac{\\sqrt3}{3}'], [0, '0'], [Math.sqrt(3) / 3, '\\tfrac{\\sqrt3}{3}'], [1, '1'], [Math.sqrt(3), '\\sqrt3']]
  };
  SPECIAL.cos = SPECIAL.sin.concat([[1, '1']]);

  // x in [0, 2π) with f(b·x + c) = k, and where f(b·x + c) is undefined (tan)
  function baseRoots(f, k) {
    if (f === 'sin') { if (Math.abs(k) > 1) return []; const a = Math.asin(k); return uniq([norm(a), norm(PI - a)]); }
    if (f === 'cos') { if (Math.abs(k) > 1) return []; const a = Math.acos(k); return uniq([norm(a), norm(-a)]); }
    const a = Math.atan(k); return uniq([norm(a), norm(a + PI)]);
  }
  function spread(base, b, c) {
    const out = [];
    base.forEach(r0 => { for (let m = -4; m <= 2 * b + 4; m++) { const x = (r0 + TWO * m - c) / b; if (x > -1e-9 && x < TWO - 1e-9) out.push(Math.max(0, x)); } });
    return uniq(out);
  }
  const rootsX = (f, k, b, c) => spread(baseRoots(f, k), b || 1, c || 0);
  const undefX = (f, b, c) => f === 'tan' ? spread([PI / 2, 3 * PI / 2], b || 1, c || 0) : [];

  const PH = 'e.g. [0, pi/6] U (5pi/6, 2pi)';
  const ASK = ' on $0 \\le x < 2\\pi$. Answer in interval notation, like `[0, pi/6] U (5pi/6, 2pi)`.';
  const listTex = xs => xs.map(x => M.texPi(x, 24)).join(',\\ ');
  function ineqQ(prompt, sol, explanation, verify, label) {
    return {
      type: 'text', placeholder: PH, prompt: prompt + ASK,
      check: U4.intervalsCheck(sol), answerText: U4.intervalsText(sol, label),
      explanation, verify
    };
  }
  function wrapUp(sol, label) {
    return 'Keep the pieces where it holds: $x \\in ' + U4.intervalsText(sol, label, true) + '$. Square brackets where a boundary point counts ($\\le, \\ge$). Parentheses at asymptotes, strict inequalities, and $2\\pi$.';
  }
  const fx = (f, arg) => '\\' + f + (arg === 'x' ? ' x' : '\\left(' + arg + '\\right)');
  // "2 sin x − 1 ≥ 0"-style display of f(arg) ⋚ k
  function linearForm(f, arg, kTex, k, op) {
    const T = fx(f, arg);
    const forms = {
      '\\tfrac12': '2' + T + ' - 1', '-\\tfrac12': '2' + T + ' + 1',
      '\\tfrac{\\sqrt2}{2}': '2' + T + ' - \\sqrt2', '-\\tfrac{\\sqrt2}{2}': '2' + T + ' + \\sqrt2',
      '\\tfrac{\\sqrt3}{2}': '2' + T + ' - \\sqrt3', '-\\tfrac{\\sqrt3}{2}': '2' + T + ' + \\sqrt3',
      '\\tfrac{\\sqrt3}{3}': '3' + T + ' - \\sqrt3', '-\\tfrac{\\sqrt3}{3}': '3' + T + ' + \\sqrt3',
      '\\sqrt3': T + ' - \\sqrt3', '-\\sqrt3': T + ' + \\sqrt3', '1': T + ' - 1', '-1': T + ' + 1', '0': T
    };
    return forms[kTex] + ' ' + OPS[op] + ' 0';
  }

  // ======================= generators =======================
  function genBasic(rng) {
    const f = rng.pick(['sin', 'sin', 'cos', 'cos', 'tan']), op = rng.pick(Object.keys(OPS));
    const [k, kTex] = rng.pick(SPECIAL[f].filter(v => Math.abs(v[0]) < 1 || f === 'tan' || rng.bool(0.2)));
    const cr = rootsX(f, k), ud = undefX(f);
    const g = x => F[f](x) - k;
    const sol = U4.solveIneq(g, op, cr, { undef: ud });
    return ineqQ('Solve $' + linearForm(f, 'x', kTex, k, op) + '$', sol,
      'Isolate: $' + fx(f, 'x') + ' ' + OPS[op] + ' ' + kTex + '$. **Boundary points:** $' + fx(f, 'x') + ' = ' + kTex + '$ at $x = ' + listTex(cr) + '$' + (ud.length ? '. tan has asymptotes at $x = ' + listTex(ud) + '$' : '') + '. Test a point in each piece, or picture the graph. ' + wrapUp(sol),
      { g, op, undef: ud });
  }
  function genNonSpecial(rng) {
    const f = rng.pick(['sin', 'cos', 'tan']), op = rng.pick(Object.keys(OPS));
    const k = f === 'tan' ? rng.pick([-4, -3, -2, -0.5, 0.5, 2, 3, 4]) : rng.pick([-0.8, -0.7, -0.6, -0.4, -0.3, -0.2, 0.2, 0.3, 0.4, 0.6, 0.7, 0.8]);
    const ak = Math.abs(k), kt = String(ak), name = 'arc' + f;
    const lab = {};
    const put = (x, t, tex) => { lab[norm(x).toFixed(9)] = { t, tex }; };
    const inv = (s, tex) => tex ? '\\' + name + '(' + s + ')' : name + '(' + s + ')';
    const both = (x, a, b) => put(x, a(false), a(true));
    if (f === 'sin') {
      const a = Math.asin(ak);
      if (k > 0) { both(a, t => inv(kt, t)); both(PI - a, t => (t ? '\\pi - ' : 'π − ') + inv(kt, t)); }
      else { both(PI + a, t => (t ? '\\pi + ' : 'π + ') + inv(kt, t)); both(TWO - a, t => (t ? '2\\pi - ' : '2π − ') + inv(kt, t)); }
    } else if (f === 'cos') {
      const a = Math.acos(k), ks = M.fmt(k, 2);
      both(a, t => inv(ks, t)); both(TWO - a, t => (t ? '2\\pi - ' : '2π − ') + inv(ks, t));
    } else {
      const a = Math.atan(ak);
      if (k > 0) { both(a, t => inv(kt, t)); both(PI + a, t => (t ? '\\pi + ' : 'π + ') + inv(kt, t)); }
      else { both(PI - a, t => (t ? '\\pi - ' : 'π − ') + inv(kt, t)); both(TWO - a, t => (t ? '2\\pi - ' : '2π − ') + inv(kt, t)); }
    }
    const label = x => lab[norm(x).toFixed(9)] || { t: M.formatPi(x, 24), tex: M.texPi(x, 24) };
    const cr = rootsX(f, k), ud = undefX(f), g = x => F[f](x) - k;
    const sol = U4.solveIneq(g, op, cr, { undef: ud });
    const shown = f === 'tan' ? (Number.isInteger(k) ? fx(f, 'x') + ' ' + OPS[op] + ' ' + M.fmt(k) : '2' + fx(f, 'x') + ' ' + OPS[op] + ' ' + M.fmt(2 * k)) : '10' + fx(f, 'x') + ' ' + OPS[op] + ' ' + M.fmt(10 * k);
    return ineqQ('Solve $' + shown + '$', sol,
      'Isolate: $' + fx(f, 'x') + ' ' + OPS[op] + ' ' + M.fmt(k) + '$. It isn’t a special value, so the boundary points come from the inverse function: $x = ' + cr.map(x => label(x).tex + ' \\approx ' + M.fmt(x, 3)).join(',\\ ') + '$' + (ud.length ? '. tan has asymptotes at $\\frac{\\pi}{2}, \\frac{3\\pi}{2}$' : '') + '. ' + wrapUp(sol, label) + ' Decimals: $' + U4.intervalsText(sol, null, true) + '$.',
      { g, op, undef: ud }, label);
  }
  function genSquare(rng) {
    const f = rng.pick(['sin', 'cos', 'tan']), op = rng.pick(Object.keys(OPS));
    const opts = f === 'tan' ? [[1, '\\tan^2 x - 1', 1], [3, '\\tan^2 x - 3', Math.sqrt(3)], [1 / 3, '3\\tan^2 x - 1', Math.sqrt(3) / 3]]
      : [[0.25, '4\\' + f + '^2 x - 1', 0.5], [0.5, '2\\' + f + '^2 x - 1', Math.SQRT2 / 2], [0.75, '4\\' + f + '^2 x - 3', Math.sqrt(3) / 2]];
    const [k2, tex, k] = rng.pick(opts);
    const cr = uniq(rootsX(f, k).concat(rootsX(f, -k))), ud = undefX(f), g = x => F[f](x) * F[f](x) - k2;
    const sol = U4.solveIneq(g, op, cr, { undef: ud });
    const kT = U4.surd(k, true);
    const inside = op === '<' || op === '<=';
    return ineqQ('Solve $' + tex + ' ' + OPS[op] + ' 0$', sol,
      '$\\' + f + '^2 x ' + OPS[op] + ' ' + U4.surd(k2, true) + '$ means ' + (inside ? '$-' + kT + ' ' + OPS[op] + ' \\' + f + ' x ' + OPS[op] + ' ' + kT + '$ (between the two values)' : '$\\' + f + ' x ' + OPS[op] + ' ' + kT + '$ **or** $\\' + f + ' x ' + OPS[op === '>' ? '<' : '<='] + ' -' + kT + '$ (outside them)') + '. **Boundary points:** $x = ' + listTex(cr) + '$' + (ud.length ? '; tan has asymptotes at $\\frac{\\pi}{2}, \\frac{3\\pi}{2}$' : '') + '. ' + wrapUp(sol),
      { g, op, undef: ud });
  }
  const SHIFTS = [[PI / 6, '\\frac{\\pi}{6}'], [PI / 4, '\\frac{\\pi}{4}'], [PI / 3, '\\frac{\\pi}{3}'], [PI / 2, '\\frac{\\pi}{2}'], [2 * PI / 3, '\\frac{2\\pi}{3}']];
  function genArg(rng) {
    const f = rng.pick(['sin', 'cos']), op = rng.pick(Object.keys(OPS));
    const [k, kTex] = rng.pick(SPECIAL[f].filter(v => Math.abs(v[0]) < 1 && v[0] !== 0));
    const b = rng.pick([1, 1, 2]);
    let c = 0, cTex = '';
    if (b === 1 || rng.bool(0.4)) { const [cv, ct] = rng.pick(SHIFTS); const sg = rng.sign(); c = sg * cv; cTex = (sg > 0 ? ' + ' : ' - ') + ct; }
    const arg = (b === 1 ? 'x' : '2x') + cTex;
    const cr = rootsX(f, k, b, c), g = x => F[f](b * x + c) - k;
    const sol = U4.solveIneq(g, op, cr);
    const uLo = c, uHi = TWO * b + c;
    return ineqQ('Solve $' + linearForm(f, arg, kTex, k, op) + '$', sol,
      'Let $u = ' + arg + '$. As $x$ runs over $[0, 2\\pi)$, $u$ runs over $[' + M.texPi(uLo, 24) + ', ' + M.texPi(uHi, 24) + ')$' + (b === 2 ? ' (two laps around the circle)' : '') + '. Solve $\\' + f + ' u = ' + kTex + '$ there, then convert back with $x = ' + (b === 1 ? 'u' : '\\frac{u}{2}') + (c ? (c > 0 ? ' - ' : ' + ') + (b === 1 ? '' : '\\tfrac12\\cdot') + M.texPi(Math.abs(c), 24) : '') + '$. **Boundary points:** $x = ' + listTex(cr) + '$. ' + wrapUp(sol),
      { g, op, undef: [] });
  }
  const QROOTS = [[-1, 1, '-1'], [-1, 2, '-\\tfrac12'], [0, 1, '0'], [1, 2, '\\tfrac12'], [1, 1, '1']];
  function genQuad(rng) {
    const f = rng.pick(['sin', 'cos']), op = rng.pick(Object.keys(OPS));
    const [r1, r2] = rng.shuffle(QROOTS).slice(0, 2).sort((p, q) => p[0] / p[1] - q[0] / q[1]);
    const A = r1[1] * r2[1], B = -(r1[1] * r2[0] + r2[1] * r1[0]), C = r1[0] * r2[0];
    const term = (cf, v, first) => cf === 0 ? '' : (cf < 0 ? (first ? '-' : ' - ') : first ? '' : ' + ') + (Math.abs(cf) === 1 && v ? '' : Math.abs(cf)) + v;
    let poly = term(A, '\\' + f + '^2 x', true); poly += term(B, '\\' + f + ' x', !poly); poly += term(C, '', !poly);
    const k1 = r1[0] / r1[1], k2 = r2[0] / r2[1];
    const fac = v => (v[1] === 1 ? '' : v[1]) + '\\' + f + ' x' + (v[0] === 0 ? '' : (v[0] > 0 ? ' - ' : ' + ') + Math.abs(v[0]));
    const cr = uniq(rootsX(f, k1).concat(rootsX(f, k2)));
    const g = x => A * F[f](x) ** 2 + B * F[f](x) + C;
    const sol = U4.solveIneq(g, op, cr);
    const between = (op === '<' || op === '<=') === (A > 0);
    return ineqQ('Solve $' + poly + ' ' + OPS[op] + ' 0$', sol,
      'It’s a quadratic in $\\' + f + ' x$. Factor: $(' + fac(r1) + ')(' + fac(r2) + ') ' + OPS[op] + ' 0$. The parabola is ' + (A > 0 ? 'negative' : 'positive') + ' between its roots, so we need $\\' + f + ' x$ ' + (between ? 'between $' + r1[2] + '$ and $' + r2[2] + '$' : 'outside $[' + r1[2] + ', ' + r2[2] + ']$') + ' (endpoints ' + (op.length === 2 ? 'included' : 'excluded') + '). **Boundary points:** $x = ' + listTex(cr) + '$. ' + wrapUp(sol),
      { g, op, undef: [] });
  }
  // [a, b, c] for a·P² x ⋚ b + c·Q² x, which reduces to P² x ⋚ (b + c)/(a + c) ∈ {1/4, 1/2, 3/4}
  const IDS = [[2, 1, 2], [1, 0, 1], [3, 0, 1], [3, 2, 1], [1, 0, 3], [5, 2, 1]];
  function genIdentity(rng) {
    const [a, b, c] = rng.pick(IDS), op = rng.pick(Object.keys(OPS)), swap = rng.bool();
    const P = swap ? 'cos' : 'sin', Q = swap ? 'sin' : 'cos';
    const k2 = (b + c) / (a + c), k = Math.sqrt(k2);
    const lhs = (a === 1 ? '' : a) + '\\' + P + '^2 x', rhs = (b ? b + ' + ' : '') + (c === 1 ? '' : c) + '\\' + Q + '^2 x';
    const g = x => a * F[P](x) ** 2 - b - c * F[Q](x) ** 2;
    const cr = uniq(rootsX(P, k).concat(rootsX(P, -k)));
    const sol = U4.solveIneq(g, op, cr);
    return ineqQ('Solve $' + lhs + ' ' + OPS[op] + ' ' + rhs + '$', sol,
      'Get one function: $\\' + Q + '^2 x = 1 - \\' + P + '^2 x$. Then $' + lhs + ' ' + OPS[op] + ' ' + (b ? b + ' + ' : '') + (c === 1 ? '' : c) + '(1 - \\' + P + '^2 x)$, so $' + (a + c) + '\\' + P + '^2 x ' + OPS[op] + ' ' + (b + c) + '$ and $\\' + P + '^2 x ' + OPS[op] + ' ' + U4.surd(k2, true) + '$, i.e. $|\\' + P + ' x| ' + OPS[op] + ' ' + U4.surd(k, true) + '$. **Boundary points:** $x = ' + listTex(cr) + '$. ' + wrapUp(sol),
      { g, op, undef: [] });
  }
  function genSquareMC(rng) {
    const f = rng.pick(['sin', 'cos']), [k2, k] = rng.pick([['\\tfrac14', '\\tfrac12'], ['\\tfrac34', '\\tfrac{\\sqrt3}{2}'], ['\\tfrac12', '\\tfrac{\\sqrt2}{2}']]);
    const le = rng.bool(), o = le ? '\\le' : '\\ge', F_ = '\\' + f + ' x';
    const between = '$-' + k + ' \\le ' + F_ + ' \\le ' + k + '$', outside = '$' + F_ + ' \\le -' + k + '$ or $' + F_ + ' \\ge ' + k + '$';
    const choices = [
      { text: between, correct: le }, { text: outside, correct: !le },
      { text: '$' + F_ + ' ' + o + ' ' + k + '$ only', correct: false }, { text: '$' + F_ + ' ' + o + ' \\pm' + k + '$', correct: false }
    ];
    return { type: 'mc', prompt: 'Which is the same as $\\' + f + '^2 x ' + o + ' ' + k2 + '$?', choices, explanation: 'Taking a square root gives an **absolute value**: $|' + F_ + '| ' + o + ' ' + k + '$. ' + (le ? '"Absolute value ≤" means **between** $-' + k + '$ and $' + k + '$.' : '"Absolute value ≥" means **outside**: at most $-' + k + '$ or at least $' + k + '$.') + ' Writing only the positive root loses half the solutions.' };
  }

  // ======================= explorer =======================
  const S3 = Math.sqrt(3), S2 = Math.SQRT2;
  const PRE = [
    { name: 'Custom: f(x) vs. k', custom: true },
    { name: '#1  4cos²(x − π/3) − 3 ≤ 0', tex: r`4\cos^2\left(x - \tfrac{\pi}{3}\right) - 3 \le 0`, L: x => 4 * Math.cos(x - PI / 3) ** 2 - 3, R: () => 0, op: '<=', crit: [PI / 6, PI / 2, 7 * PI / 6, 3 * PI / 2], y: [-3.5, 1.5, 1] },
    { name: '#2  2sin²x ≤ 1 + 2cos²x', tex: r`2\sin^2 x \le 1 + 2\cos^2 x`, L: x => 2 * Math.sin(x) ** 2, R: x => 1 + 2 * Math.cos(x) ** 2, op: '<=', crit: [PI / 3, 2 * PI / 3, 4 * PI / 3, 5 * PI / 3], y: [-0.5, 3.5, 1] },
    { name: '#3  cos x + sin x ≥ √2 sin x', tex: r`\cos x + \sin x \ge \sqrt2\sin x`, L: x => Math.cos(x) + Math.sin(x), R: x => S2 * Math.sin(x), op: '>=', crit: [3 * PI / 8, 11 * PI / 8], y: [-1.8, 1.8, 0.5] },
    { name: 'sin 2x > sin x', tex: r`\sin 2x > \sin x`, L: x => Math.sin(2 * x), R: x => Math.sin(x), op: '>', crit: [0, PI / 3, PI, 5 * PI / 3], y: [-1.5, 1.5, 0.5] },
    { name: 'tan²x ≥ 3', tex: r`\tan^2 x \ge 3`, L: x => Math.tan(x) ** 2, R: () => 3, op: '>=', crit: [PI / 3, 2 * PI / 3, 4 * PI / 3, 5 * PI / 3], undef: [PI / 2, 3 * PI / 2], y: [-1, 8, 1] }
  ];
  function ineqExplorer(container, L, cfg) {
    const { Graph, R } = L;
    const st = { p: cfg.preset || 0, f: 'sin', op: '>=', k: 0.5, show: true };
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
    const sel = R.el('select', { class: 'select' });
    PRE.forEach((p, i) => sel.appendChild(R.el('option', { value: String(i), text: p.name })));
    sel.value = String(st.p);
    top.appendChild(sel);
    const sw = R.el('div', { class: 'explorer-switches' }); top.appendChild(sw);
    Graph.segmented(sw, ['sin', 'cos', 'tan'].map(v => ({ label: v + ' x', value: v })), st.f, v => { st.f = v; if (v === 'tan') { st.k = Math.max(-4, Math.min(4, st.k)); } else st.k = Math.max(-1.2, Math.min(1.2, st.k)); kS.setRange(v === 'tan' ? -4 : -1.2, v === 'tan' ? 4 : 1.2); kS.set(st.k); draw(); });
    Graph.segmented(sw, Object.keys(OPW).map(v => ({ label: OPW[v], value: v })), st.op, v => { st.op = v; draw(); });
    const eq = R.el('div', { class: 'equation' }); root.appendChild(eq);
    const box = R.el('div'); root.appendChild(box);
    const g = new Graph(box, { xUnit: 'rad', yUnit: 'num', height: 340, interactive: false, xMin: -0.25, xMax: TWO + 0.25, xStep: PI / 4, yMin: -1.6, yMax: 1.6, yStep: 0.5 });
    const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
    const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
    const kS = Graph.slider(sl, { label: 'k', min: -1.2, max: 1.2, step: 0.05, value: st.k, format: v => M.fmt(v, 2), onInput: v => { st.k = v; draw(); } });
    const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
    Graph.toggle(tg, 'Show the solution set', true, v => { st.show = v; draw(); });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);
    sel.addEventListener('change', () => { st.p = +sel.value; draw(); });

    function draw() {
      const p = PRE[st.p], pal = g.palette || {};
      sw.style.display = p.custom ? '' : 'none';
      kS.row.style.display = p.custom ? '' : 'none';
      let Lf, Rf, op, crit, ud, yv, texEq;
      if (p.custom) {
        Lf = F[st.f]; Rf = () => st.k; op = st.op; crit = rootsX(st.f, st.k); ud = undefX(st.f);
        yv = st.f === 'tan' ? [-5, 5, 1] : [-1.6, 1.6, 0.5];
        texEq = '\\' + st.f + ' x ' + OPS[op] + ' ' + M.fmt(st.k, 2);
      } else { Lf = p.L; Rf = p.R; op = p.op; crit = p.crit; ud = p.undef || []; yv = p.y; texEq = p.tex; }
      g.update({ yMin: yv[0], yMax: yv[1], yStep: yv[2] });
      const sol = U4.solveIneq(x => Lf(x) - Rf(x), op, crit, { undef: ud });
      const yBar = yv[0] + (yv[1] - yv[0]) * 0.06;
      const fns = [{ f: Lf, domain: [0, TWO], width: 3, color: pal.accent, label: 'left side', asymptotes: ud.length ? ud : undefined }, { f: Rf, domain: [0, TWO], width: 2.5, dashed: true, color: pal.accent2, label: 'right side' }];
      const points = [];
      if (st.show) sol.forEach(iv => {
        if (iv.hi - iv.lo > 1e-9) fns.push({ f: () => yBar, domain: [iv.lo, iv.hi], width: 7, color: pal.accent3, hover: false });
        points.push({ x: iv.lo, y: yBar, color: pal.accent3, hollow: !iv.loC });
        if (iv.hi - iv.lo > 1e-9) points.push({ x: iv.hi, y: yBar, color: pal.accent3, hollow: !iv.hiC });
      });
      g.update({ fns, points, vlines: [{ x: TWO, color: pal.accent2 }] });
      eq.innerHTML = R.tex(texEq + '\\quad (0 \\le x < 2\\pi)', true);
      const row = (k, v) => '<div class="info-row"><span>' + k + '</span><strong>' + v + '</strong></div>';
      info.innerHTML = row('Boundary points', crit.length ? crit.map(x => M.formatPi(x, 24)).join(', ') : 'none') +
        (ud.length ? row('Undefined at', ud.map(x => M.formatPi(x, 24)).join(', ')) : '') +
        row('Solution', st.show ? R.escapeHtml(U4.intervalsText(sol)) : '<span class="muted">hidden</span>') +
        '<div class="info-note">The green bar shows where the solid curve is ' + R.escapeHtml(({ '<': 'below', '<=': 'below or on', '>': 'above', '>=': 'above or on' })[op]) + ' the dashed one. Hollow ends are excluded.</div>';
    }
    draw();
  }

  // ======================= 4-9a basic =======================
  sec.topics.push({
    id: '4-9-basic', title: 'Inequalities: boundary points + a sign chart',
    notes: r`## The method (on $0 \le x < 2\pi$)

1. **Isolate** the trig function: $\sin x \ge \frac12$, $\tan x < 3$, …
2. **Boundary points:** solve the *equation* ($\sin x = \frac12$) on $[0, 2\pi)$. For tan, also mark where it's **undefined**: $\frac{\pi}{2}, \frac{3\pi}{2}$.
3. These points cut $[0, 2\pi)$ into pieces. In each piece the inequality is **all true or all false**. Test one point per piece, or picture the graph or unit circle.
4. **Write intervals.** Use $[\;]$ when a boundary point counts ($\le, \ge$). Use $(\;)$ for strict inequalities, asymptotes, and $2\pi$ (it isn't in $[0, 2\pi)$).

## Finding the boundary points

| **equation** | **solutions in $[0, 2\pi)$** |
| --- | --- |
| $\sin x = k$ | $\arcsin k$ and $\pi - \arcsin k$ (add $2\pi$ to a negative one) |
| $\cos x = k$ | $\arccos k$ and $2\pi - \arccos k$ |
| $\tan x = k$ | $\arctan k$ and $\arctan k + \pi$ (add $\pi$ again if negative) |

If $k$ isn't a special value, **the inverse function is the exact answer**: $\sin x = 0.3$ at $x = \arcsin 0.3 \approx 0.305$ and $\pi - \arcsin 0.3 \approx 2.837$.

## Worked examples

**1.** $2\cos x + 1 < 0 \Rightarrow \cos x < -\frac12$. Boundary points: $\frac{2\pi}{3}, \frac{4\pi}{3}$. Cosine is below $-\frac12$ on the left side of the circle: $x \in \left(\frac{2\pi}{3}, \frac{4\pi}{3}\right)$.

**2.** $\sin x \ge -0.6$. Boundary points: $\pi + \arcsin 0.6 \approx 3.785$ and $2\pi - \arcsin 0.6 \approx 5.640$. Sine only dips below $-0.6$ between them, so

$$x \in [0,\ \pi + \arcsin 0.6] \cup [2\pi - \arcsin 0.6,\ 2\pi) \approx [0, 3.785] \cup [5.640, 2\pi)$$

**3.** $\tan x > 1$. Boundary points: $\frac{\pi}{4}, \frac{5\pi}{4}$. Undefined: $\frac{\pi}{2}, \frac{3\pi}{2}$. Tangent climbs from $1$ toward $+\infty$ right before each asymptote:

$$x \in \left(\tfrac{\pi}{4}, \tfrac{\pi}{2}\right) \cup \left(\tfrac{5\pi}{4}, \tfrac{3\pi}{2}\right)$$

> **Common mistake:** writing only one interval for sine or cosine. Draw the whole period. There are often two pieces, one wrapping around through $0$/$2\pi$.

> **Typing answers:** \`[0, pi/6] U (5pi/6, 2pi)\`. For non-special boundaries you can type \`arcsin(0.3)\`, \`pi - arcsin(0.3)\`, or decimals to 3 places.`,
    explore: {
      type: 'custom',
      intro: 'Pick $f$, the inequality sign, and $k$. The green bar on the bottom is the solution set: solid dots are included, hollow ones aren’t. The other presets are the problems from your review sheet.',
      setup(c, L) { ineqExplorer(c, L, { preset: 0 }); },
      tasks: r`1. $\sin x \ge k$: slide $k$ from $-1.2$ to $1.2$. When is the answer one interval? Two? All of $[0, 2\pi)$? Empty?
2. $\cos x < 0.3$: what are the boundary points in terms of arccos?
3. $\tan x \le k$: why are there always three pieces?`
    },
    practice: [
      { q: r`Solve $2\sin x - \sqrt3 > 0$ on $0 \le x < 2\pi$.`, hint: 'sin x > √3/2. Where on the circle is sine that high?', answer: r`$\left(\tfrac{\pi}{3}, \tfrac{2\pi}{3}\right)$`, solution: r`Boundary points $\frac{\pi}{3}$ and $\frac{2\pi}{3}$. Sine is above $\frac{\sqrt3}{2}$ only between them. Strict inequality, so use parentheses.` },
      { q: r`Solve $\cos x \le \frac{\sqrt2}{2}$ on $0 \le x < 2\pi$.`, hint: 'Boundary points π/4 and 7π/4.', answer: r`$\left[\tfrac{\pi}{4}, \tfrac{7\pi}{4}\right]$`, solution: r`Cosine is above $\frac{\sqrt2}{2}$ only near $0$ and $2\pi$. Everything from $\frac{\pi}{4}$ to $\frac{7\pi}{4}$ works, and the endpoints count ($\le$).` },
      { q: r`Solve $\tan x \le -1$ on $0 \le x < 2\pi$.`, hint: 'Boundary points 3π/4, 7π/4. Undefined at π/2, 3π/2.', answer: r`$\left(\tfrac{\pi}{2}, \tfrac{3\pi}{4}\right] \cup \left(\tfrac{3\pi}{2}, \tfrac{7\pi}{4}\right]$`, solution: r`Right after each asymptote, tangent starts at $-\infty$ and climbs. It stays $\le -1$ until $\frac{3\pi}{4}$ (or $\frac{7\pi}{4}$). Asymptotes get parentheses.` },
      { q: r`Solve $5\sin x - 2 > 0$ on $0 \le x < 2\pi$. Give exact boundaries and decimals.`, hint: 'sin x > 0.4. Not a special value: use arcsin.', answer: r`$(\arcsin 0.4,\ \pi - \arcsin 0.4) \approx (0.412,\ 2.730)$`, solution: r`$\sin x = 0.4$ at $x = \arcsin 0.4 \approx 0.4115$ and $\pi - \arcsin 0.4 \approx 2.7301$. Sine is above $0.4$ between them.` },
      { q: r`Solve $\tan x < 3$ on $0 \le x < 2\pi$.`, hint: 'Boundary points arctan 3 and π + arctan 3. Three pieces.', answer: r`$[0, \arctan 3) \cup \left(\tfrac{\pi}{2}, \pi + \arctan 3\right) \cup \left(\tfrac{3\pi}{2}, 2\pi\right)$`, solution: r`$\arctan 3 \approx 1.249$ and $\pi + \arctan 3 \approx 4.391$. Tangent is below $3$ from $0$ up to $\arctan 3$, then again from each asymptote until it reaches $3$. Note $[0$: at $x = 0$, $\tan 0 = 0 < 3$ ✓.` },
      { q: r`Solve $2\cos x + 1 \ge 0$ on $0 \le x < 2\pi$.`, hint: 'cos x ≥ −1/2. Boundary 2π/3 and 4π/3.', answer: r`$\left[0, \tfrac{2\pi}{3}\right] \cup \left[\tfrac{4\pi}{3}, 2\pi\right)$`, solution: r`Cosine is at least $-\frac12$ everywhere except the left part of the circle, $(\frac{2\pi}{3}, \frac{4\pi}{3})$. The piece through $0$ is split by the interval: $[0, \frac{2\pi}{3}]$ and $[\frac{4\pi}{3}, 2\pi)$.` }
    ],
    quiz: [genBasic, genBasic, genBasic, genNonSpecial, genNonSpecial, genSquareMC],
    quizCount: 7
  });

  // ======================= 4-9b rewrite first =======================
  sec.topics.push({
    id: '4-9-rewrite', title: 'Rewrite first: squares, shifted angles, identities',
    notes: r`## Goal: one trig function of one angle

Then use the boundary-point method from the last topic. The tools:

- **Squares give two cases.** $\cos^2 u \le \frac34 \iff |\cos u| \le \frac{\sqrt3}{2} \iff -\frac{\sqrt3}{2} \le \cos u \le \frac{\sqrt3}{2}$. And $\cos^2 u \ge \frac34 \iff \cos u \le -\frac{\sqrt3}{2}$ or $\cos u \ge \frac{\sqrt3}{2}$.
- **Pythagorean identity:** replace $\cos^2 x$ with $1 - \sin^2 x$ (or the reverse) to get one function.
- **Quadratic in $\sin x$ or $\cos x$:** factor it, then use a sign chart on the factors.
- **Shifted or doubled angle:** let $u = x - \frac{\pi}{3}$ (or $u = 2x$). Find the interval $u$ runs over as $x$ goes from $0$ to $2\pi$, solve there, then convert back. A doubled angle goes around **twice**, so you get twice as many pieces.
- **$a\sin x + b\cos x$:** rewrite as **one** sinusoid, $R\sin(x + \alpha)$ with $R = \sqrt{a^2+b^2}$, $\cos\alpha = \frac{a}{R}$, $\sin\alpha = \frac{b}{R}$. For example, $\sin x + \cos x = \sqrt2\sin\left(x + \frac{\pi}{4}\right)$.

## Worked example: $4\sin^2 x - 1 < 0$

$\sin^2 x < \frac14 \Rightarrow -\frac12 < \sin x < \frac12$. Boundary points $\frac{\pi}{6}, \frac{5\pi}{6}, \frac{7\pi}{6}, \frac{11\pi}{6}$. Sine is small near $0$, $\pi$, and $2\pi$:

$$x \in \left[0, \tfrac{\pi}{6}\right) \cup \left(\tfrac{5\pi}{6}, \tfrac{7\pi}{6}\right) \cup \left(\tfrac{11\pi}{6}, 2\pi\right)$$

## Worked example: $2\cos 2x \ge 1$

Let $u = 2x$, so $u \in [0, 4\pi)$ and we need $\cos u \ge \frac12$: $u \in [0, \frac{\pi}{3}] \cup [\frac{5\pi}{3}, \frac{7\pi}{3}] \cup [\frac{11\pi}{3}, 4\pi)$. Halve:

$$x \in \left[0, \tfrac{\pi}{6}\right] \cup \left[\tfrac{5\pi}{6}, \tfrac{7\pi}{6}\right] \cup \left[\tfrac{11\pi}{6}, 2\pi\right)$$

## Worked example: $\sin x + \cos x > 1$

$\sqrt2\sin(x + \frac{\pi}{4}) > 1 \Rightarrow \sin u > \frac{\sqrt2}{2}$ with $u = x + \frac{\pi}{4} \in [\frac{\pi}{4}, \frac{9\pi}{4})$. So $u \in (\frac{\pi}{4}, \frac{3\pi}{4})$, which gives $x \in \left(0, \frac{\pi}{2}\right)$.

> **Common mistake:** $\sin^2 x \le \frac14 \Rightarrow \sin x \le \frac12$. Taking the square root needs an absolute value, so you need **both** $\pm\frac12$.

> **Common mistake:** dividing by $\sin x$ or $\cos x$. Its sign changes, which would flip the inequality on some pieces. Factor instead.`,
    explore: {
      type: 'custom',
      intro: 'Presets #1–#3 are the review-sheet problems. Compare the green solution bar with your answer, especially at the ends: is each one included or not?',
      setup(c, L) { ineqExplorer(c, L, { preset: 1 }); },
      tasks: r`1. #1: where are the boundary points? Which of them come from $+\frac{\sqrt3}{2}$, and which from $-\frac{\sqrt3}{2}$?
2. #3: the boundaries are at $\frac{3\pi}{8}$ and $\frac{11\pi}{8}$, which aren't special angles. Where do they come from? (See practice problem 3.)
3. $\sin 2x > \sin x$: why isn't $x = 0$ included, even though the bar seems to start there?`
    },
    practice: [
      { q: r`Solve $4\cos^2\left(x - \dfrac{\pi}{3}\right) - 3 \le 0$ on $0 \le x < 2\pi$.`, hint: 'Let u = x − π/3. Then |cos u| ≤ √3/2, and u runs over [−π/3, 5π/3).', answer: r`$\left[0, \tfrac{\pi}{6}\right] \cup \left[\tfrac{\pi}{2}, \tfrac{7\pi}{6}\right] \cup \left[\tfrac{3\pi}{2}, 2\pi\right)$`, solution: r`$\cos^2 u \le \frac34 \iff -\frac{\sqrt3}{2} \le \cos u \le \frac{\sqrt3}{2}$, i.e. $u$ is at least $\frac{\pi}{6}$ away from $0$ and $\pi$: $u \in [\frac{\pi}{6}, \frac{5\pi}{6}] \cup [\frac{7\pi}{6}, \frac{11\pi}{6}]$, plus coterminal copies.

$x = u + \frac{\pi}{3}$ gives $[\frac{\pi}{2}, \frac{7\pi}{6}] \cup [\frac{3\pi}{2}, \frac{13\pi}{6}]$. The last piece runs past $2\pi$, so wrap it around: $[\frac{3\pi}{2}, 2\pi)$ and $[0, \frac{\pi}{6}]$.

Check $x = 0$: $4\cos^2(-\frac{\pi}{3}) - 3 = 4\cdot\frac14 - 3 = -2 \le 0$ ✓.` },
      { q: r`Solve $2\sin^2 x \le 1 + 2\cos^2 x$ on $0 \le x < 2\pi$.`, hint: 'Replace cos²x with 1 − sin²x.', answer: r`$\left[0, \tfrac{\pi}{3}\right] \cup \left[\tfrac{2\pi}{3}, \tfrac{4\pi}{3}\right] \cup \left[\tfrac{5\pi}{3}, 2\pi\right)$`, solution: r`$2\sin^2 x \le 1 + 2(1 - \sin^2 x) \Rightarrow 4\sin^2 x \le 3 \Rightarrow |\sin x| \le \frac{\sqrt3}{2}$.

Sine is bigger than $\frac{\sqrt3}{2}$ only on $(\frac{\pi}{3}, \frac{2\pi}{3})$, and smaller than $-\frac{\sqrt3}{2}$ only on $(\frac{4\pi}{3}, \frac{5\pi}{3})$. Remove those from $[0, 2\pi)$.

(Or use $\sin^2 x - \cos^2 x = -\cos 2x$: the inequality becomes $\cos 2x \ge -\frac12$.)` },
      { q: r`Solve $\cos x + \sin x \ge \sqrt2\sin x$ on $0 \le x < 2\pi$.`, hint: 'Get cos x ≥ (√2 − 1) sin x, and notice √2 − 1 = tan(π/8). Don’t divide by sin x or cos x.', answer: r`$\left[0, \tfrac{3\pi}{8}\right] \cup \left[\tfrac{11\pi}{8}, 2\pi\right)$`, solution: r`Rearrange: $\cos x - (\sqrt2 - 1)\sin x \ge 0$.

**Key fact:** $\tan\frac{\pi}{8} = \sqrt2 - 1$. (Half-angle: $\tan\frac{\theta}{2} = \frac{1 - \cos\theta}{\sin\theta}$ with $\theta = \frac{\pi}{4}$ gives $\frac{1 - \sqrt2/2}{\sqrt2/2} = \sqrt2 - 1$.)

So $\cos x - \frac{\sin(\pi/8)}{\cos(\pi/8)}\sin x \ge 0$. Multiply by $\cos\frac{\pi}{8} > 0$ (the sign stays the same):

$$\cos x\cos\tfrac{\pi}{8} - \sin x\sin\tfrac{\pi}{8} \ge 0 \iff \cos\left(x + \tfrac{\pi}{8}\right) \ge 0$$

With $u = x + \frac{\pi}{8} \in [\frac{\pi}{8}, \frac{17\pi}{8})$: $\cos u \ge 0$ for $u \in [\frac{\pi}{8}, \frac{\pi}{2}] \cup [\frac{3\pi}{2}, \frac{17\pi}{8})$. Subtract $\frac{\pi}{8}$: $x \in [0, \frac{3\pi}{8}] \cup [\frac{11\pi}{8}, 2\pi)$.

**Check** $x = \frac{\pi}{2}$: $0 + 1 \ge \sqrt2$? No ✓ (excluded). $x = \pi$: $-1 \ge 0$? No ✓. $x = \frac{3\pi}{2}$: $-1 \ge -\sqrt2$ ✓ (included).` },
      { q: r`Solve $\sin 2x > \sin x$ on $0 \le x < 2\pi$.`, hint: 'sin 2x = 2 sin x cos x. Move everything to one side and factor. Don’t divide by sin x.', answer: r`$\left(0, \tfrac{\pi}{3}\right) \cup \left(\pi, \tfrac{5\pi}{3}\right)$`, solution: r`$2\sin x\cos x - \sin x > 0 \Rightarrow \sin x\,(2\cos x - 1) > 0$. The factors change sign at $0, \pi$ (sine) and $\frac{\pi}{3}, \frac{5\pi}{3}$ (cosine $= \frac12$).

| **piece** | **$\sin x$** | **$2\cos x - 1$** | **product** |
| --- | --- | --- | --- |
| $(0, \frac{\pi}{3})$ | $+$ | $+$ | $+$ ✓ |
| $(\frac{\pi}{3}, \pi)$ | $+$ | $-$ | $-$ |
| $(\pi, \frac{5\pi}{3})$ | $-$ | $-$ | $+$ ✓ |
| $(\frac{5\pi}{3}, 2\pi)$ | $-$ | $+$ | $-$ |

At $x = 0$ the product is $0$, which isn't $> 0$.` },
      { q: r`Solve $2\cos^2 x + \cos x - 1 < 0$ on $0 \le x < 2\pi$.`, hint: 'Factor: (2cos x − 1)(cos x + 1).', answer: r`$\left(\tfrac{\pi}{3}, \pi\right) \cup \left(\pi, \tfrac{5\pi}{3}\right)$`, solution: r`$(2\cos x - 1)(\cos x + 1) < 0 \iff -1 < \cos x < \frac12$. Cosine is below $\frac12$ on $(\frac{\pi}{3}, \frac{5\pi}{3})$, but it equals $-1$ at $x = \pi$, which must be removed. Hence the gap at $\pi$.` },
      { q: r`Solve $\tan^2 x \ge 3$ on $0 \le x < 2\pi$.`, hint: '|tan x| ≥ √3. Watch the asymptotes.', answer: r`$\left[\tfrac{\pi}{3}, \tfrac{\pi}{2}\right) \cup \left(\tfrac{\pi}{2}, \tfrac{2\pi}{3}\right] \cup \left[\tfrac{4\pi}{3}, \tfrac{3\pi}{2}\right) \cup \left(\tfrac{3\pi}{2}, \tfrac{5\pi}{3}\right]$`, solution: r`Tangent is large in size near each asymptote: from $\frac{\pi}{3}$ up to $\frac{\pi}{2}$ (going to $+\infty$) and from just after $\frac{\pi}{2}$ (coming from $-\infty$) to $\frac{2\pi}{3}$. Same around $\frac{3\pi}{2}$. The asymptotes themselves are excluded.` }
    ],
    quiz: [genSquare, genArg, genArg, genQuad, genQuad, genIdentity, genSquareMC],
    quizCount: 7
  });

  U4.ineq = { rootsX, undefX, baseRoots };
})();
