/* Unit 4 — meta + shared helpers (window.U4) + vector figures (window.FIGURES). Sections are pushed in by section-*.js.
   Notation: arcsin/arccos/… (matches the class). Ranges use the common precalc convention:
   arccot (0, π) · arcsec [0, π], y ≠ π/2 · arccsc [−π/2, π/2], y ≠ 0. */
(function () {
  window.UNIT_DATA = window.UNIT_DATA || {};
  window.FIGURES = window.FIGURES || {};
  const PI = Math.PI;

  window.UNIT_DATA['unit-4'] = {
    title: 'Unit 4 — Angular Velocity & Inverse Circular Functions',
    intro: String.raw`Three ideas on this test:

- **4-4 Angular & linear velocity.** How fast something *spins* ($\omega = \theta/t$) vs. how fast a point on it *moves* ($v = a/t$), linked by $v = r\omega$.
- **4-5 Inverse circular function graphs.** The six inverse functions — memorize each one's domain, range, excluded values, and shape — then sketch transformed versions like $y = 2\pi + 3\arcsin\tfrac{x}{4}$.
- **4-6 Exact values.** Evaluate things like $\operatorname{arcsec}(-\sqrt2)$ or $\arcsin(\cos\tfrac{\pi}{6})$ without a calculator.

Notation: $\arcsin x$ and $\sin^{-1}x$ mean the same thing here — the one **principal value**.`,
    sections: []
  };

  // ---------------- the six inverse functions ----------------
  const INF = Infinity;
  const INV = {
    sin: {
      key: 'sin', name: 'arcsin', tex: '\\arcsin', trig: '\\sin', f: Math.asin, group: 'right', dir: 1,
      dom: [{ lo: -1, hi: 1, loC: true, hiC: true }], rng: { lo: -PI / 2, hi: PI / 2, loC: true, hiC: true }, excl: null, hAsym: [],
      key3: [[-1, -PI / 2], [0, 0], [1, PI / 2]], ends: [[-1, -PI / 2], [1, PI / 2]],
      domainText: '−1 ≤ x ≤ 1', rangeText: '−π/2 ≤ y ≤ π/2', na: 'No output for |x| > 1 (sine never leaves [−1, 1]).',
      shape: 'Increasing S-curve through the origin, from (−1, −π/2) to (1, π/2). Vertical tangents at the endpoints.'
    },
    cos: {
      key: 'cos', name: 'arccos', tex: '\\arccos', trig: '\\cos', f: Math.acos, group: 'top', dir: -1,
      dom: [{ lo: -1, hi: 1, loC: true, hiC: true }], rng: { lo: 0, hi: PI, loC: true, hiC: true }, excl: null, hAsym: [],
      key3: [[-1, PI], [0, PI / 2], [1, 0]], ends: [[-1, PI], [1, 0]],
      domainText: '−1 ≤ x ≤ 1', rangeText: '0 ≤ y ≤ π', na: 'No output for |x| > 1.',
      shape: 'Decreasing S-curve from (−1, π) through (0, π/2) down to (1, 0).'
    },
    tan: {
      key: 'tan', name: 'arctan', tex: '\\arctan', trig: '\\tan', f: Math.atan, group: 'right', dir: 1,
      dom: [{ lo: -INF, hi: INF, loC: false, hiC: false }], rng: { lo: -PI / 2, hi: PI / 2, loC: false, hiC: false }, excl: null, hAsym: [-PI / 2, PI / 2],
      key3: [[-1, -PI / 4], [0, 0], [1, PI / 4]], ends: [],
      domainText: 'all real numbers', rangeText: '−π/2 < y < π/2', na: 'Every x works. y = ±π/2 are never reached (horizontal asymptotes).',
      shape: 'Increasing through the origin, leveling off toward y = π/2 (right) and y = −π/2 (left).'
    },
    cot: {
      key: 'cot', name: 'arccot', tex: '\\operatorname{arccot}', trig: '\\cot', f: x => PI / 2 - Math.atan(x), group: 'top', dir: -1,
      dom: [{ lo: -INF, hi: INF, loC: false, hiC: false }], rng: { lo: 0, hi: PI, loC: false, hiC: false }, excl: null, hAsym: [0, PI],
      key3: [[-1, 3 * PI / 4], [0, PI / 2], [1, PI / 4]], ends: [],
      domainText: 'all real numbers', rangeText: '0 < y < π', na: 'Every x works. y = 0 and y = π are never reached (horizontal asymptotes).',
      shape: 'Decreasing through (0, π/2), leveling off toward y = π (left) and y = 0 (right).'
    },
    sec: {
      key: 'sec', name: 'arcsec', tex: '\\operatorname{arcsec}', trig: '\\sec', f: x => Math.abs(x) >= 1 ? Math.acos(1 / x) : NaN, group: 'top', dir: 1,
      dom: [{ lo: -INF, hi: -1, loC: false, hiC: true }, { lo: 1, hi: INF, loC: true, hiC: false }], rng: { lo: 0, hi: PI, loC: true, hiC: true }, excl: PI / 2, hAsym: [PI / 2],
      key3: [[-2, 2 * PI / 3], [-1, PI], [1, 0], [2, PI / 3]], ends: [[-1, PI], [1, 0]],
      domainText: 'x ≤ −1 or x ≥ 1', rangeText: '0 ≤ y ≤ π, y ≠ π/2', na: 'No output for −1 < x < 1. y = π/2 is never reached (horizontal asymptote).',
      shape: 'Two branches: from (1, 0) rising toward π/2 as x → ∞; and rising from π/2 (far left) up to (−1, π).'
    },
    csc: {
      key: 'csc', name: 'arccsc', tex: '\\operatorname{arccsc}', trig: '\\csc', f: x => Math.abs(x) >= 1 ? Math.asin(1 / x) : NaN, group: 'right', dir: -1,
      dom: [{ lo: -INF, hi: -1, loC: false, hiC: true }, { lo: 1, hi: INF, loC: true, hiC: false }], rng: { lo: -PI / 2, hi: PI / 2, loC: true, hiC: true }, excl: 0, hAsym: [0],
      key3: [[-2, -PI / 6], [-1, -PI / 2], [1, PI / 2], [2, PI / 6]], ends: [[-1, -PI / 2], [1, PI / 2]],
      domainText: 'x ≤ −1 or x ≥ 1', rangeText: '−π/2 ≤ y ≤ π/2, y ≠ 0', na: 'No output for −1 < x < 1. y = 0 is never reached (horizontal asymptote).',
      shape: 'Two branches: from (1, π/2) falling toward 0 as x → ∞; and falling from 0 (far left) down to (−1, −π/2).'
    }
  };
  const ORDER = ['sin', 'cos', 'tan', 'cot', 'sec', 'csc'];

  // ---------------- number formatting ----------------
  function fracText(v, maxDen) {
    if (!isFinite(v)) return v > 0 ? '∞' : '−∞';
    maxDen = maxDen || 12;
    for (let d = 1; d <= maxDen; d++) {
      const n = Math.round(v * d);
      if (Math.abs(n / d - v) < 1e-9) {
        if (d === 1) return String(n).replace('-', '−');
        return (n < 0 ? '−' : '') + Math.abs(n) + '/' + d;
      }
    }
    return M.fmt(v, 3).replace('-', '−');
  }
  function fracTex(v, maxDen) {
    if (!isFinite(v)) return v > 0 ? '\\infty' : '-\\infty';
    maxDen = maxDen || 12;
    for (let d = 1; d <= maxDen; d++) {
      const n = Math.round(v * d);
      if (Math.abs(n / d - v) < 1e-9) return d === 1 ? String(n) : (n < 0 ? '-' : '') + '\\tfrac{' + Math.abs(n) + '}{' + d + '}';
    }
    return M.fmt(v, 3);
  }
  const yText = v => M.formatPi(v, 24).replace(/^-/, '−');
  const yTex = v => M.texPi(v, 24);

  // ---------------- y = a + b·arcF(c(x + d)) ----------------
  function transform(key, a, b, c, d) {
    const P = INV[key];
    const X = u => u / c - d;
    const Y = v => a + b * v;
    const dom = P.dom.map(iv => {
      let lo = X(iv.lo), hi = X(iv.hi), loC = iv.loC, hiC = iv.hiC;
      if (c < 0) { [lo, hi] = [hi, lo]; [loC, hiC] = [hiC, loC]; }
      return { lo, hi, loC, hiC };
    }).sort((p, q) => p.lo - q.lo);
    let rlo = Y(P.rng.lo), rhi = Y(P.rng.hi), rloC = P.rng.loC, rhiC = P.rng.hiC;
    if (b < 0) { [rlo, rhi] = [rhi, rlo]; [rloC, rhiC] = [rhiC, rloC]; }
    return {
      key, a, b, c, d, P,
      f: x => a + b * P.f(c * (x + d)),
      dom, rng: { lo: rlo, hi: rhi, loC: rloC, hiC: rhiC },
      excl: P.excl === null ? null : Y(P.excl),
      hAsym: P.hAsym.map(Y),
      keys: P.key3.map(([u, v]) => [X(u), Y(v)]),
      ends: P.ends.map(([u, v]) => [X(u), Y(v)]),
      dir: P.dir * Math.sign(b) * Math.sign(c)
    };
  }
  function domainText(info) {
    const parts = info.dom.map(iv => {
      if (!isFinite(iv.lo) && !isFinite(iv.hi)) return 'all real numbers';
      if (!isFinite(iv.lo)) return 'x ' + (iv.hiC ? '≤' : '<') + ' ' + fracText(iv.hi);
      if (!isFinite(iv.hi)) return 'x ' + (iv.loC ? '≥' : '>') + ' ' + fracText(iv.lo);
      return fracText(iv.lo) + ' ' + (iv.loC ? '≤' : '<') + ' x ' + (iv.hiC ? '≤' : '<') + ' ' + fracText(iv.hi);
    });
    return parts.join('  or  ');
  }
  function rangeText(info) {
    const r = info.rng;
    return yText(r.lo) + ' ' + (r.loC ? '≤' : '<') + ' y ' + (r.hiC ? '≤' : '<') + ' ' + yText(r.hi) + (info.excl !== null ? ',  y ≠ ' + yText(info.excl) : '');
  }
  function eqTex(key, a, b, c, d) {
    const P = INV[key];
    let s = 'y = ';
    const hasA = Math.abs(a) > 1e-12;
    if (hasA) s += yTex(a) + ' ';
    const ab = Math.abs(b);
    if (hasA) s += b < 0 ? '- ' : '+ ';
    else if (b < 0) s += '-';
    if (Math.abs(ab - 1) > 1e-12) s += fracTex(ab) + '\\,';
    let inner;
    const dPart = Math.abs(d) < 1e-12 ? 'x' : 'x ' + (d > 0 ? '+ ' : '- ') + fracTex(Math.abs(d));
    if (Math.abs(c - 1) < 1e-12) inner = dPart;
    else if (Math.abs(c + 1) < 1e-12) inner = Math.abs(d) < 1e-12 ? '-x' : '-(' + dPart + ')';
    else inner = fracTex(c) + (Math.abs(d) < 1e-12 ? 'x' : '(' + dPart + ')');
    return s + P.tex + '\\left(' + inner + '\\right)';
  }

  // Draws a (transformed) inverse function with endpoints, asymptotes and optional key-point labels.
  function drawInverse(container, opts) {
    const o = Object.assign({ key: 'sin', a: 0, b: 1, c: 1, d: 0, labels: true, parent: false, height: 300, view: null }, opts);
    const info = transform(o.key, o.a, o.b, o.c, o.d);
    const v = o.view || autoView(info);
    const g = new Graph(container, Object.assign({ xUnit: 'num', yUnit: 'rad', height: o.height, interactive: false }, v));
    const pal = () => g.palette || {};
    const fns = [];
    if (o.parent) INV[o.key].dom.forEach(iv => fns.push({ f: INV[o.key].f, domain: [iv.lo, iv.hi], ghost: true }));
    info.dom.forEach((iv, i) => fns.push({ f: info.f, domain: [iv.lo, iv.hi], width: 3, label: i === 0 && o.legend ? o.legend : undefined }));
    const points = [];
    const lbl = (x, y) => o.labels ? '(' + fracText(x) + ', ' + yText(y) + ')' : '';
    info.ends.forEach(([x, y]) => points.push({ x, y, label: lbl(x, y), color: pal().accent }));
    info.keys.forEach(([x, y]) => { if (!info.ends.some(e => Math.abs(e[0] - x) < 1e-9)) points.push({ x, y, label: lbl(x, y), r: 3.5 }); });
    g.update({ fns, points, hlines: info.hAsym.map(y => ({ y, dashed: true })) });
    return { graph: g, info };
  }
  function niceStep(span, cands) { for (const c of cands) if (span / c <= 10) return c; return cands[cands.length - 1]; }
  function autoView(info) {
    let xlo, xhi;
    const fin = info.dom.filter(iv => isFinite(iv.lo) && isFinite(iv.hi));
    const cx = -info.d, half = 3.2 / Math.abs(info.c);
    if (fin.length === info.dom.length) {
      xlo = Math.min.apply(null, fin.map(i => i.lo)); xhi = Math.max.apply(null, fin.map(i => i.hi));
      const w = xhi - xlo, pad = Math.max(0.4, 0.3 * w);
      xlo -= pad; xhi += pad;
    } else { xlo = cx - half; xhi = cx + half; }
    const ys = [info.rng.lo, info.rng.hi].concat(info.hAsym);
    let ylo = Math.min.apply(null, ys), yhi = Math.max.apply(null, ys);
    const ypad = Math.max(0.35, 0.18 * (yhi - ylo));
    ylo -= ypad; yhi += ypad;
    if (ylo > -0.3) ylo = Math.min(ylo, -0.3);
    if (yhi < 0.3) yhi = Math.max(yhi, 0.3);
    const yStep = niceStep(yhi - ylo, [PI / 4, PI / 2, PI, 2 * PI]);
    const xStep = niceStep(xhi - xlo, [0.25, 0.5, 1, 2, 5, 10]);
    return { xMin: xlo, xMax: xhi, yMin: ylo, yMax: yhi, xStep, yStep };
  }

  // ---------------- special values for exact evaluation ----------------
  const S2 = Math.SQRT2, S3 = Math.sqrt(3);
  const VAL = {
    sinCos: [[-1, '-1'], [-S3 / 2, '-\\tfrac{\\sqrt3}{2}'], [-S2 / 2, '-\\tfrac{\\sqrt2}{2}'], [-0.5, '-\\tfrac12'], [0, '0'], [0.5, '\\tfrac12'], [S2 / 2, '\\tfrac{\\sqrt2}{2}'], [S3 / 2, '\\tfrac{\\sqrt3}{2}'], [1, '1']],
    tanCot: [[-S3, '-\\sqrt3'], [-1, '-1'], [-S3 / 3, '-\\tfrac{\\sqrt3}{3}'], [0, '0'], [S3 / 3, '\\tfrac{\\sqrt3}{3}'], [1, '1'], [S3, '\\sqrt3']],
    secCsc: [[-2, '-2'], [-S2, '-\\sqrt2'], [-2 * S3 / 3, '-\\tfrac{2\\sqrt3}{3}'], [-1, '-1'], [1, '1'], [2 * S3 / 3, '\\tfrac{2\\sqrt3}{3}'], [S2, '\\sqrt2'], [2, '2']]
  };
  const valuesFor = key => (key === 'sin' || key === 'cos') ? VAL.sinCos : (key === 'tan' || key === 'cot') ? VAL.tanCot : VAL.secCsc;
  const TRIG = { sin: Math.sin, cos: Math.cos, tan: Math.tan, cot: x => Math.cos(x) / Math.sin(x), sec: x => 1 / Math.cos(x), csc: x => 1 / Math.sin(x) };
  // exact-ish text for a trig value (handles the reciprocal family too)
  function valueTex(v) {
    if (!isFinite(v) || Math.abs(v) > 1e6) return '\\text{undefined}';
    const table = [[0, '0'], [0.5, '\\tfrac12'], [S2 / 2, '\\tfrac{\\sqrt2}{2}'], [S3 / 2, '\\tfrac{\\sqrt3}{2}'], [1, '1'], [S3 / 3, '\\tfrac{\\sqrt3}{3}'], [S3, '\\sqrt3'], [2 * S3 / 3, '\\tfrac{2\\sqrt3}{3}'], [S2, '\\sqrt2'], [2, '2']];
    for (const [x, t] of table) if (Math.abs(Math.abs(v) - x) < 1e-9) return (v < 0 && x !== 0 ? '-' : '') + t;
    return M.fmt(v, 4);
  }

  // ---------------- SVG builder ----------------
  const DEFS = '<defs>' + ['ah', 'ah-acc', 'ah-acc2', 'ah-acc3'].map(id =>
    '<marker id="u4-' + id + '" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="' + id + '"/></marker>').join('') + '</defs>';
  const f1 = n => Math.round(n * 10) / 10;
  const SV = {
    open: (w, h, label) => '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" role="img" aria-label="' + label + '" xmlns="http://www.w3.org/2000/svg">' + DEFS,
    close: '</svg>',
    mk: a => a ? ' marker-end="url(#u4-' + a + ')"' : '',
    line: (x1, y1, x2, y2, cls, arrow) => '<line x1="' + f1(x1) + '" y1="' + f1(y1) + '" x2="' + f1(x2) + '" y2="' + f1(y2) + '" class="ln ' + (cls || '') + '"' + SV.mk(arrow) + '/>',
    circle: (cx, cy, r, cls) => '<circle cx="' + f1(cx) + '" cy="' + f1(cy) + '" r="' + f1(r) + '" class="ln ' + (cls || '') + '"/>',
    rect: (x, y, w, h, cls, rx) => '<rect x="' + f1(x) + '" y="' + f1(y) + '" width="' + f1(w) + '" height="' + f1(h) + '" rx="' + (rx || 0) + '" class="ln ' + (cls || '') + '"/>',
    path: (d, cls, arrow) => '<path d="' + d + '" class="ln ' + (cls || '') + '"' + SV.mk(arrow) + '/>',
    dot: (x, y, cls, r) => '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + (r || 4) + '" class="' + (cls || 'fill-text') + '"/>',
    text: (x, y, s, cls, anchor) => '<text x="' + f1(x) + '" y="' + f1(y) + '" text-anchor="' + (anchor || 'middle') + '" class="' + (cls || '') + '">' + s + '</text>',
    // point on a circle at angle (degrees, math orientation: counter-clockwise, y up)
    pt: (cx, cy, r, deg) => [cx + r * Math.cos(deg * PI / 180), cy - r * Math.sin(deg * PI / 180)],
    // arc from a0 to a1 (degrees); direction follows the sign of a1 − a0
    arc: (cx, cy, r, a0, a1, cls, arrow) => {
      const [x0, y0] = SV.pt(cx, cy, r, a0), [x1, y1] = SV.pt(cx, cy, r, a1);
      const large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 0 : 1;
      return SV.path('M' + f1(x0) + ',' + f1(y0) + ' A' + r + ',' + r + ' 0 ' + large + ' ' + sweep + ' ' + f1(x1) + ',' + f1(y1), cls, arrow);
    }
  };

  // ---------------- 4-4 figures ----------------
  const FIG = window.FIGURES;

  FIG['u4-def'] = () => {
    const cx = 170, cy = 160, r = 110, a0 = 20, a1 = 110;
    const [sx, sy] = SV.pt(cx, cy, r, a0), [px, py] = SV.pt(cx, cy, r, a1);
    const [ax, ay] = SV.pt(cx, cy, r + 20, 65), [tx, ty] = SV.pt(cx, cy, 50, 65);
    return SV.open(500, 300, 'Angle theta swept on a circle, arc length a, radius r, velocity v') +
      SV.circle(cx, cy, r, 'thin mut') +
      SV.line(cx, cy, sx, sy, 'mut dash') + SV.line(cx, cy, px, py, 'acc') +
      SV.arc(cx, cy, r, a0, a1, 'thick acc2') +
      SV.arc(cx, cy, 32, a0 + 4, a1 - 4, 'acc3', 'ah-acc3') +
      SV.dot(cx, cy) + SV.dot(sx, sy, 'fill-text', 3.5) + SV.dot(px, py, 'fill-acc', 5) +
      SV.line(px, py, px - 66, py + 24, 'acc', 'ah-acc') +
      SV.text(60, py + 40, 'v', 't-it t-acc') +
      SV.text(ax + 8, ay - 2, 'a (arc length)', 't-acc2 t-b', 'start') +
      SV.text(tx + 4, ty + 6, 'θ', 't-it t-acc3') +
      SV.text((cx + sx) / 2 + 4, (cy + sy) / 2 + 18, 'r', 't-it') +
      SV.text(px - 6, py - 10, 'P', 't-b', 'end') +
      SV.text(320, 80, 'In time t, point P sweeps', '', 'start') +
      SV.text(320, 98, 'angle θ and arc length a.', '', 'start') +
      SV.text(320, 140, 'ω = θ / t', 't-it t-acc3', 'start') +
      SV.text(320, 166, 'v = a / t', 't-it t-acc', 'start') +
      SV.text(320, 192, 'a = r θ   (θ in radians)', 't-it t-acc2', 'start') +
      SV.text(320, 226, 'so   v = r ω', 't-it t-b', 'start') +
      SV.close;
  };

  FIG['u4-same-disk'] = () => {
    const cx = 150, cy = 150, R = 110, r = 55, a1 = 70;
    const [Px, Py] = SV.pt(cx, cy, R, a1), [Qx, Qy] = SV.pt(cx, cy, r, a1);
    return SV.open(500, 290, 'Two points on the same spinning disk') +
      SV.circle(cx, cy, R, 'thin mut') + SV.circle(cx, cy, r, 'thin mut dash') +
      SV.line(cx, cy, cx + R, cy, 'mut dash') + SV.line(cx, cy, Px, Py, 'acc') +
      SV.arc(cx, cy, R, 0, a1, 'thick acc2') + SV.arc(cx, cy, r, 0, a1, 'thick acc3') +
      SV.arc(cx, cy, 24, 4, a1 - 6, 'thin', 'ah') +
      SV.dot(cx, cy) + SV.dot(Px, Py, 'fill-acc2', 5) + SV.dot(Qx, Qy, 'fill-acc3', 5) +
      SV.text(Px + 8, Py - 6, 'P', 't-b t-acc2', 'start') + SV.text(Qx + 8, Qy - 4, 'Q', 't-b t-acc3', 'start') +
      SV.text(cx + 34, cy - 12, 'θ', 't-it') +
      SV.text(300, 70, 'Same disk, same time:', 't-b', 'start') +
      SV.text(300, 96, '• both sweep the same angle θ', '', 'start') +
      SV.text(300, 116, '   → same ω', 't-acc3', 'start') +
      SV.text(300, 146, '• P is twice as far out, so its', '', 'start') +
      SV.text(300, 166, '   arc is twice as long', '', 'start') +
      SV.text(300, 186, '   → P has twice the v', 't-acc2', 'start') +
      SV.text(300, 226, 'v = r ω', 't-it t-b', 'start') +
      SV.close;
  };

  FIG['u4-rolling'] = () => {
    const gy = 210, r = 80, cx = 230, cy = gy - r, px = 110;
    return SV.open(500, 260, 'A wheel rolling along the ground') +
      SV.line(20, gy, 480, gy, 'thick') +
      SV.circle(px, cy, r, 'thin mut dash') + SV.dot(px, cy, 'fill-text', 3) +
      SV.circle(cx, cy, r, '') + SV.dot(cx, cy) +
      SV.line(cx, cy, cx, gy, 'thin') + SV.text(cx + 8, cy + 46, 'r', 't-it', 'start') +
      SV.arc(cx, cy, 48, 145, 35, 'acc3', 'ah-acc3') + SV.text(cx, cy - 56, 'ω', 't-it t-acc3') +
      SV.line(cx, cy, cx + 120, cy, 'acc', 'ah-acc') + SV.text(cx + 126, cy + 5, 'v = r ω', 't-it t-acc', 'start') +
      SV.dot(px, gy, 'fill-acc2', 4) + SV.dot(cx, gy, 'fill-acc2', 4) +
      SV.line(px, gy + 18, cx, gy + 18, 'thin acc2', 'ah-acc2') +
      SV.text((px + cx) / 2, gy + 38, 'distance rolled = arc length unrolled = r θ', 't-acc2 t-sm') +
      SV.text(cx + 126, cy + 26, 'axle (and the vehicle) moves', 't-sm t-mut', 'start') +
      SV.text(cx + 126, cy + 42, 'at the rim’s linear speed', 't-sm t-mut', 'start') +
      SV.close;
  };

  function beltPoints(x1, x2, y, r1, r2) {
    const al = Math.asin((r1 - r2) / (x2 - x1)), s = Math.sin(al), c = Math.cos(al);
    return { t1: [x1 + r1 * s, y - r1 * c], t2: [x2 + r2 * s, y - r2 * c], b1: [x1 + r1 * s, y + r1 * c], b2: [x2 + r2 * s, y + r2 * c] };
  }

  FIG['u4-belt'] = () => {
    const y = 130, x1 = 130, r1 = 72, x2 = 370, r2 = 36;
    const B = beltPoints(x1, x2, y, r1, r2);
    const lerp = (p, q, t) => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
    const m1 = lerp(B.t1, B.t2, 0.35), m2 = lerp(B.t1, B.t2, 0.6);
    return SV.open(520, 270, 'Two pulleys connected by a belt') +
      SV.circle(x1, y, r1, 'fill-surface') + SV.circle(x2, y, r2, 'fill-surface') +
      SV.line(B.t1[0], B.t1[1], B.t2[0], B.t2[1], 'acc thick') + SV.line(B.b1[0], B.b1[1], B.b2[0], B.b2[1], 'acc thick') +
      SV.path('M' + f1(B.t1[0]) + ',' + f1(B.t1[1]) + ' A' + r1 + ',' + r1 + ' 0 1 0 ' + f1(B.b1[0]) + ',' + f1(B.b1[1]), 'acc thick') +
      SV.path('M' + f1(B.t2[0]) + ',' + f1(B.t2[1]) + ' A' + r2 + ',' + r2 + ' 0 0 1 ' + f1(B.b2[0]) + ',' + f1(B.b2[1]), 'acc thick') +
      SV.line(m1[0], m1[1] - 12, m2[0], m2[1] - 12, 'acc2', 'ah-acc2') +
      SV.text((m1[0] + m2[0]) / 2, m1[1] - 22, 'belt moves at speed v', 't-acc2 t-b') +
      SV.dot(x1, y) + SV.dot(x2, y) +
      SV.line(x1, y, x1, y + r1, 'thin') + SV.text(x1 + 6, y + r1 / 2 + 4, 'r₁', 't-it', 'start') +
      SV.line(x2, y, x2, y + r2, 'thin') + SV.text(x2 + 6, y + r2 / 2 + 4, 'r₂', 't-it', 'start') +
      SV.arc(x1, y, 40, 140, 40, 'acc3', 'ah-acc3') + SV.text(x1, y - 46, 'ω₁', 't-it t-acc3') +
      SV.arc(x2, y, 20, 150, 30, 'acc3', 'ah-acc3') + SV.text(x2, y - 26, 'ω₂', 't-it t-acc3') +
      SV.text(260, 238, 'Same belt ⇒ same v at both rims:   r₁ ω₁ = r₂ ω₂', 't-b') +
      SV.text(260, 258, 'The smaller pulley spins faster.', 't-mut t-sm') +
      SV.close;
  };

  FIG['u4-gears'] = () => {
    const y = 120, x1 = 150, r1 = 78, r2 = 40, x2 = x1 + r1 + r2;
    const cx = x1 + r1;
    return SV.open(460, 250, 'Two wheels touching rim to rim') +
      SV.circle(x1, y, r1, 'fill-surface') + SV.circle(x2, y, r2, 'fill-surface') +
      SV.dot(x1, y) + SV.dot(x2, y) +
      SV.arc(x1, y, 50, 150, 30, 'acc3', 'ah-acc3') + SV.text(x1, y - 56, 'ω₁ (clockwise)', 't-acc3 t-sm') +
      SV.arc(x2, y, 58, -60, 60, 'acc3', 'ah-acc3') + SV.text(x2 + 64, y + 4, 'ω₂', 't-it t-acc3', 'start') +
      SV.dot(cx, y, 'fill-acc2', 5) +
      SV.line(cx, y - 8, cx + 34, y - 72, 'thin acc2') +
      SV.text(cx + 38, y - 76, 'contact point: rims move together', 't-acc2 t-sm', 'start') +
      SV.line(x1, y, x1 - r1 * 0.7, y + r1 * 0.7, 'thin') + SV.text(x1 - 34, y + 30, 'r₁', 't-it', 'end') +
      SV.line(x2, y, x2, y + r2, 'thin') + SV.text(x2 + 6, y + 26, 'r₂', 't-it', 'start') +
      SV.text(230, 226, 'No slipping ⇒ same v at the rims: r₁ω₁ = r₂ω₂ (opposite directions)', 't-b t-sm') +
      SV.close;
  };

  FIG['u4-train'] = () => {
    const cx = 220, cy = 140, k = 100 / 15, rr = 15 * k, rf = 16 * k, rail = cy + rr;
    const [rx, ry] = SV.pt(cx, cy, rr, 32), [fx, fy] = SV.pt(cx, cy, rf, -38);
    return SV.open(540, 320, 'Train wheel: rim of radius 15 inches on the rail and flange of radius 16 inches') +
      SV.rect(40, rail, 420, 24, 'thin fill-surface') + SV.text(52, rail + 16, 'rail', 't-sm t-mut', 'start') +
      SV.circle(cx, cy, rf, 'acc2 fill-soft') + SV.circle(cx, cy, rr, 'fill-bg') +
      SV.circle(cx, cy, 16, 'thin') + SV.dot(cx, cy) +
      SV.line(cx, cy, rx, ry, 'thin') + SV.text(rx + 6, ry - 4, 'rim: r = 15 in', 't-b', 'start') +
      SV.line(cx, cy, fx, fy, 'thin acc2') + SV.text(fx + 8, fy + 10, 'flange: r = 15 + 1 = 16 in', 't-b t-acc2', 'start') +
      SV.line(cx + 70, rail + 40, cx + 8, rail + 6, 'thin acc2', 'ah-acc2') +
      SV.text(cx + 74, rail + 46, 'flange sticks out 1 in past the rim', 't-sm t-acc2', 'start') +
      SV.arc(cx, cy, 42, 160, 20, 'acc3', 'ah-acc3') + SV.text(cx, cy - 48, 'ω', 't-it t-acc3') +
      SV.dot(cx, cy - rf, 'fill-acc', 5) + SV.line(cx, cy - rf, cx + 82, cy - rf, 'acc', 'ah-acc') +
      SV.text(cx + 88, cy - rf + 5, 'v of a point on the flange edge = ?', 't-acc t-b', 'start') +
      SV.line(cx - 60, 304, cx + 80, 304, '', 'ah') + SV.text(cx - 68, 308, 'train moves 60 mi/hr', '', 'end') +
      SV.text(360, 150, 'The rim rolls on the rail, so', 't-sm', 'start') +
      SV.text(360, 166, 'rim speed (around the axle)', 't-sm', 'start') +
      SV.text(360, 182, '= train speed = 60 mi/hr.', 't-sm t-b', 'start') +
      SV.close;
  };

  FIG['u4-record'] = () => {
    // side view (left) — 24 px per inch horizontally
    const k = 24, ax = 150, tTop = 56, dY = 156, sR = 8;
    const side =
      SV.text(150, 20, 'Side view', 't-b') +
      SV.text(ax, tTop - 8, 'turntable, r = 5 in', 't-sm') +
      SV.rect(ax - 5 * k, tTop, 10 * k, 12, 'fill-surface', 2) +
      SV.line(ax, tTop + 12, ax, dY, 'thick') +
      SV.text(ax + 8, tTop + 32, '33⅓ rpm', 't-acc t-b', 'start') +
      SV.text(ax + 8, tTop + 48, 'axle', 't-sm t-mut', 'start') +
      SV.rect(ax - 3 * k, dY, 6 * k, 16, 'acc fill-soft', 2) +
      SV.text(ax, dY + 34, 'large drive wheel, r = 3 in', 't-sm t-acc') +
      SV.rect(ax + 3 * k, dY, 2 * sR, 16, 'acc2 fill-acc2', 2) +
      SV.line(ax + 3 * k + sR, dY + 16, ax + 3 * k + sR, dY + 46, 'thick acc2') +
      SV.rect(ax + 3 * k + sR - 20, dY + 46, 40, 36, 'acc2 fill-surface', 4) +
      SV.text(ax + 3 * k + sR, dY + 68, 'motor', 't-sm') +
      SV.text(ax + 3 * k + sR, dY + 100, '600 rpm', 't-sm t-acc2 t-b') +
      SV.line(ax + 3 * k + 2 * sR + 4, dY - 22, ax + 3 * k + sR + 2, dY - 2, 'thin acc2') +
      SV.text(ax + 3 * k + 2 * sR + 6, dY - 26, 'small drive wheel, r = ?', 't-sm t-acc2', 'start') +
      SV.text(20, 326, 'Drive wheels drawn larger than scale.', 't-sm t-mut', 'start');
    // top view (right) — 20 px per inch
    const tx = 500, ty = 150, q = 20, sr = 10;
    const top =
      SV.text(tx, 20, 'Top view', 't-b') +
      SV.circle(tx, ty, 5 * q, 'mut dash') +
      SV.text(tx, ty - 5 * q - 8, 'turntable (r = 5 in)', 't-sm t-mut') +
      SV.circle(tx, ty, 3 * q, 'acc fill-soft') +
      SV.text(tx, ty - 4, 'large drive', 't-sm t-acc') + SV.text(tx, ty + 12, 'wheel (r = 3 in)', 't-sm t-acc') +
      SV.circle(tx + 3 * q + sr, ty, sr, 'acc2 fill-acc2') +
      SV.dot(tx + 3 * q, ty, 'fill-text', 3) +
      SV.arc(tx, ty, 4 * q, 100, 160, 'acc', 'ah-acc') +
      SV.arc(tx + 3 * q + sr, ty, sr + 8, 70, -70, 'acc2', 'ah-acc2') +
      SV.line(tx + 3 * q + 2, ty + 4, tx + 5 * q + 22, ty + 70, 'thin') +
      SV.text(tx + 5 * q + 26, ty + 76, 'contact point:', 't-sm', 'start') +
      SV.text(tx + 5 * q + 26, ty + 92, 'same v', 't-sm', 'start');
    return SV.open(700, 340, 'Record player: turntable and large drive wheel on one axle; small motor-driven wheel touches the large drive wheel') +
      side + top +
      SV.text(500, 290, 'turntable + large wheel: same axle → same ω', 't-sm t-acc') +
      SV.text(500, 308, 'large + small wheel: touching → same v at rims', 't-sm t-acc2') +
      SV.close;
  };

  FIG['u4-bike'] = () => {
    const y = 150, x1 = 130, r1 = 45, x2 = 340, r2 = 18, R = 92;
    const B = beltPoints(x1, x2, y, r1, r2);
    return SV.open(580, 260, 'Bicycle: pedal sprocket, chain, rear sprocket and rear wheel') +
      SV.circle(x2, y, R, 'mut dash') + SV.text(x2, y - R - 8, 'rear wheel, radius R', 't-sm t-mut') +
      SV.circle(x1, y, r1, 'fill-surface') + SV.circle(x2, y, r2, 'fill-surface') +
      SV.line(B.t1[0], B.t1[1], B.t2[0], B.t2[1], 'acc thick') + SV.line(B.b1[0], B.b1[1], B.b2[0], B.b2[1], 'acc thick') +
      SV.dot(x1, y) + SV.dot(x2, y) +
      SV.text(x1, y + r1 + 22, 'pedal sprocket r₁', 't-sm') +
      SV.line(x2, y, x2 + 60, y + 56, 'thin') + SV.text(x2 + 64, y + 66, 'rear sprocket r₂', 't-sm', 'start') +
      SV.text(240, 112, 'chain', 't-sm t-acc') +
      SV.text(452, 110, 'chain ⇒ same v', 't-acc t-b', 'start') +
      SV.text(452, 128, 'at both sprockets', 't-acc t-sm', 'start') +
      SV.text(452, 160, 'rear sprocket and', 't-acc3 t-b', 'start') +
      SV.text(452, 178, 'wheel share an axle', 't-acc3 t-sm', 'start') +
      SV.text(452, 194, '⇒ same ω', 't-acc3 t-sm', 'start') +
      SV.close;
  };

  // ---------------- 4-5 / 4-6 figures ----------------
  FIG['u4-range-map'] = () => {
    const r = 80, L = [135, 135], Rc = [395, 135];
    const left =
      SV.text(L[0], 22, 'arcsin · arctan · arccsc', 't-b') +
      SV.circle(L[0], L[1], r, 'thin mut') +
      SV.arc(L[0], L[1], r, -90, 90, 'thick acc3') +
      SV.line(L[0] - r - 12, L[1], L[0] + r + 12, L[1], 'thin mut') + SV.line(L[0], L[1] - r - 12, L[0], L[1] + r + 12, 'thin mut') +
      SV.text(L[0] + 10, L[1] - r - 2, 'π/2', 't-sm', 'start') + SV.text(L[0] + 10, L[1] + r + 12, '−π/2', 't-sm', 'start') +
      SV.text(L[0] + r + 6, L[1] - 6, '0', 't-sm', 'start') +
      SV.text(L[0], L[1] + r + 34, 'right half: −π/2 to π/2', 't-acc3 t-sm');
    const right =
      SV.text(Rc[0], 22, 'arccos · arccot · arcsec', 't-b') +
      SV.circle(Rc[0], Rc[1], r, 'thin mut') +
      SV.arc(Rc[0], Rc[1], r, 0, 180, 'thick acc') +
      SV.line(Rc[0] - r - 12, Rc[1], Rc[0] + r + 12, Rc[1], 'thin mut') + SV.line(Rc[0], Rc[1] - r - 12, Rc[0], Rc[1] + r + 12, 'thin mut') +
      SV.text(Rc[0] + r + 4, Rc[1] + 14, '0', 't-sm', 'start') + SV.text(Rc[0] - r - 4, Rc[1] + 14, 'π', 't-sm', 'end') +
      SV.text(Rc[0] + 8, Rc[1] - r - 2, 'π/2', 't-sm', 'start') +
      SV.text(Rc[0], Rc[1] + r + 34, 'top half: 0 to π', 't-acc t-sm');
    return SV.open(530, 280, 'Where the answers live: right half for arcsin, arctan, arccsc; top half for arccos, arccot, arcsec') +
      left + right +
      SV.text(265, 262, 'Excluded: arctan ±π/2 · arccsc 0 · arccot 0 and π · arcsec π/2', 't-sm t-mut') +
      SV.close;
  };

  FIG['u4-triangle'] = () =>
    SV.open(380, 230, 'Right triangle with legs 4 and 3, hypotenuse 5') +
    SV.path('M40,190 L290,190 L290,40 Z', 'fill-soft') +
    SV.path('M276,190 L276,176 L290,176', 'thin') +
    SV.arc(40, 190, 40, 0, 31, 'acc3') + SV.text(92, 180, 'θ', 't-it t-acc3') +
    SV.text(165, 212, 'adjacent = 4', '') + SV.text(298, 120, 'opposite = 3', '', 'start') +
    SV.text(150, 104, 'hypotenuse = 5', '', 'end') +
    SV.text(190, 26, 'θ = arctan(3/4)', 't-b t-acc') +
    SV.close;

  window.U4 = { INV, ORDER, transform, domainText, rangeText, eqTex, drawInverse, autoView, fracText, fracTex, yText, yTex, VAL, valuesFor, TRIG, valueTex, SV, beltPoints, PI };
})();
