/* Unit 4 — grading tools shared by the conversion / equation / inequality topics and the final test (extends window.U4):
   - compile(str): a small, safe expression evaluator (x, π, √, abs, trig and all six inverse functions; implicit multiplication)
   - convCheck: grades "express arcF x using arcG" answers by comparing values at sample points
   - valuesCheck: grades a list of exact solutions ("2 ± sqrt(3)", "1/6", "no solution")
   - parseIntervals / intervalsCheck / solveIneq / intervalsText: interval-notation answers for trig inequalities on [0, 2π) */
(function () {
  const U4 = window.U4;
  const { INV, PI } = U4;

  // ======================= expression evaluator =======================
  const near1 = v => Math.abs(v) <= 1 + 1e-9;
  const clamp1 = v => Math.max(-1, Math.min(1, v));
  const FUN = {
    sqrt: v => v < 0 && v > -1e-12 ? 0 : Math.sqrt(v),
    abs: Math.abs,
    sin: Math.sin, cos: Math.cos, tan: Math.tan,
    cot: v => Math.cos(v) / Math.sin(v), sec: v => 1 / Math.cos(v), csc: v => 1 / Math.sin(v),
    arcsin: v => near1(v) ? Math.asin(clamp1(v)) : NaN,
    arccos: v => near1(v) ? Math.acos(clamp1(v)) : NaN,
    arctan: Math.atan,
    arccot: v => PI / 2 - Math.atan(v),
    arcsec: v => Math.abs(v) >= 1 - 1e-9 ? Math.acos(clamp1(1 / v)) : NaN,
    arccsc: v => Math.abs(v) >= 1 - 1e-9 ? Math.asin(clamp1(1 / v)) : NaN
  };
  const NAMES = Object.keys(FUN).concat(['pi', 'x']).sort((a, b) => b.length - a.length);

  function normalize(str) {
    return String(str).toLowerCase()
      .replace(/[−–—]/g, '-').replace(/[×·∙⋅]/g, '*').replace(/÷/g, '/')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/²/g, '^2').replace(/⁻¹/g, '^-1')
      .replace(/\barc\s+(sin|cos|tan|cot|sec|csc)/g, 'arc$1')
      .replace(/\b(sin|cos|tan|cot|sec|csc)\s*\^\s*\(?\s*-\s*1\s*\)?/g, 'arc$1')
      .replace(/\ba(sin|cos|tan|cot|sec|csc)\b/g, 'arc$1')
      .replace(/\b(sin|cos|tan|cot|sec|csc)\s*inverse/g, 'arc$1');
  }

  function tokenize(s) {
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/\s/.test(c)) { i++; continue; }
      if (/[0-9.]/.test(c)) {
        const m = s.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
        if (!m) return null;
        out.push({ t: 'num', v: parseFloat(m[1]) }); i += m[1].length; continue;
      }
      if (/[a-z]/.test(c)) {
        const word = s.slice(i).match(/^[a-z]+/)[0];
        // split run-together names like "2pix" or "xsqrt" into known pieces
        let w = word;
        while (w.length) {
          const n = NAMES.find(nm => w.startsWith(nm));
          if (!n) return null;
          out.push(n === 'pi' ? { t: 'num', v: PI } : n === 'x' ? { t: 'x' } : { t: 'fn', v: n });
          w = w.slice(n.length);
        }
        i += word.length; continue;
      }
      if ('+-*/^()'.includes(c)) { out.push({ t: c }); i++; continue; }
      return null;
    }
    return out;
  }

  // recursive descent → closure f(x); records which functions were used
  function compile(str) {
    const toks = tokenize(normalize(str));
    if (!toks || !toks.length) return null;
    let p = 0;
    const used = new Set();
    const peek = () => toks[p], take = () => toks[p++];
    const startsPrimary = t => t && (t.t === 'num' || t.t === 'x' || t.t === 'fn' || t.t === '(');
    function expr() {
      let f = term();
      while (peek() && (peek().t === '+' || peek().t === '-')) {
        const op = take().t, a = f, b = term();
        f = op === '+' ? x => a(x) + b(x) : x => a(x) - b(x);
      }
      return f;
    }
    function term() {
      let f = unary();
      for (;;) {
        const t = peek();
        if (t && (t.t === '*' || t.t === '/')) { take(); const a = f, b = unary(); f = t.t === '*' ? x => a(x) * b(x) : x => a(x) / b(x); }
        else if (startsPrimary(t)) { const a = f, b = power(); f = x => a(x) * b(x); }
        else return f;
      }
    }
    function unary() {
      const t = peek();
      if (t && t.t === '-') { take(); const a = unary(); return x => -a(x); }
      if (t && t.t === '+') { take(); return unary(); }
      return power();
    }
    function power() {
      const base = primary();
      if (peek() && peek().t === '^') { take(); const e = unary(); return x => Math.pow(base(x), e(x)); }
      return base;
    }
    function primary() {
      const t = take();
      if (!t) throw new Error('end');
      if (t.t === 'num') return () => t.v;
      if (t.t === 'x') return x => x;
      if (t.t === '(') { const f = expr(); if (!peek() || take().t !== ')') throw new Error(')'); return f; }
      if (t.t === 'fn') {
        used.add(t.v);
        const fn = FUN[t.v];
        // "arcsin(x)" or "arcsin x" / "sqrt3" (no parentheses: the argument is the next power-level term)
        const a = peek() && peek().t === '(' ? primary() : (() => { if (peek() && peek().t === '-') { take(); const b = power(); return x => -b(x); } return power(); })();
        return x => fn(a(x));
      }
      throw new Error('unexpected');
    }
    try {
      const f = expr();
      if (p !== toks.length) return null;
      return { f, fns: used, hasX: toks.some(t => t.t === 'x') };
    } catch (e) { return null; }
  }
  const evalNum = s => { const c = compile(s); return c && !c.hasX ? c.f(0) : NaN; };

  // ======================= answer checkers =======================
  // Sample inputs inside a region of arcF's domain. region: 'pos' | 'neg' | 'all'
  function samples(key, region) {
    const D = { sin: [0.13, 0.42, 0.71, 0.93], cos: [0.13, 0.42, 0.71, 0.93], tan: [0.3, 1.1, 2.6, 7.5], cot: [0.3, 1.1, 2.6, 7.5], sec: [1.15, 1.7, 3.2, 9], csc: [1.15, 1.7, 3.2, 9] }[key];
    if (region === 'pos') return D;
    if (region === 'neg') return D.map(v => -v);
    return D.concat(D.map(v => -v));
  }
  const isUndefText = s => /undef|dne|does not|no solution|none|n\/?a/i.test(String(s));
  // Student's expression must use arcG (and no other inverse function) and equal arcF(x) on the region.
  function convCheck(F, G, region) {
    const xs = samples(F, region);
    return s => {
      const c = compile(s);
      if (!c || !c.hasX) return false;
      const inv = Array.from(c.fns).filter(n => /^arc/.test(n));
      if (!inv.length || inv.some(n => n !== 'arc' + G)) return false;
      return xs.every(x => { const v = c.f(x); return isFinite(v) && Math.abs(v - INV[F].f(x)) < 1e-6; });
    };
  }

  // A list of exact values, any order: "1/6", "2+sqrt(3), 2-sqrt(3)", "2 ± √3", "x = √2/2", "no solution".
  function splitValues(str) {
    const s = String(str).trim();
    if (/^(no\s*(real\s*)?solutions?|none|∅|\{\s*\}|empty( set)?)$/i.test(s)) return [];
    const parts = s.replace(/[{}]/g, '').split(/[,;]|\bor\b|\band\b/i).map(p => p.replace(/^\s*x\s*=\s*/i, '').trim()).filter(Boolean);
    if (!parts.length) return null;
    const vals = [];
    for (const part of parts) {
      const pm = part.split(/±|\+\/-|\+-/);
      const pieces = pm.length === 2 ? [pm[0] + '+' + pm[1], pm[0] + '-' + pm[1]] : [part];
      for (const piece of pieces) { const v = evalNum(piece); if (!isFinite(v)) return null; vals.push(v); }
    }
    return vals;
  }
  function sameSet(a, b, tol) {
    const dedupe = arr => arr.slice().sort((p, q) => p - q).filter((v, i, s) => i === 0 || Math.abs(v - s[i - 1]) > tol);
    const A = dedupe(a), B = dedupe(b);
    return A.length === B.length && A.every((v, i) => Math.abs(v - B[i]) <= tol);
  }
  function valuesCheck(answers, tol) {
    tol = tol || 0.005;
    return s => { const v = splitValues(s); return v !== null && sameSet(v, answers, tol); };
  }

  // ======================= intervals =======================
  // "[0, pi/6] U (pi/2, 7pi/6] ∪ [3π/2, 2π)", "{pi/2}", "0 <= x < pi/3 or ...", "no solution"
  function parseIntervals(str) {
    let s = String(str).trim();
    if (/^(no\s*(real\s*)?solutions?|none|∅|\{\s*\}|empty( set)?)$/i.test(s)) return [];
    s = s.replace(/∪|\bunion\b|\bU\b|\bu\b|\bor\b/g, ' ; ');
    if (!/[\[\]({]/.test(s.replace(/\b[a-z]+\s*\(/gi, ''))) return parseChains(s);
    const out = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[\s;,]/.test(c)) { i++; continue; }
      if (c === '{') {
        const j = s.indexOf('}', i);
        if (j < 0) return null;
        for (const part of s.slice(i + 1, j).split(/[,;]/)) { const v = evalNum(part); if (!isFinite(v)) return null; out.push({ lo: v, hi: v, loC: true, hiC: true }); }
        i = j + 1; continue;
      }
      if (c !== '[' && c !== '(') return null;
      let depth = 0, k = i + 1, comma = -1, end = -1;
      for (; k < s.length; k++) {
        const d = s[k];
        if (d === '(') depth++;
        else if (d === ')' && depth > 0) depth--;
        else if (depth === 0 && d === ',' && comma < 0) comma = k;
        else if (depth === 0 && (d === ']' || d === ')')) { end = k; break; }
      }
      if (end < 0 || comma < 0) return null;
      const lo = evalNum(s.slice(i + 1, comma)), hi = evalNum(s.slice(comma + 1, end));
      if (!isFinite(lo) || !isFinite(hi) || hi < lo - 1e-9) return null;
      out.push({ lo, hi, loC: c === '[', hiC: s[end] === ']' });
      i = end + 1;
    }
    return out;
  }
  function parseChains(s) {
    const out = [];
    for (const piece of s.split(';').map(p => p.trim()).filter(Boolean)) {
      const m = piece.replace(/≤/g, '<=').replace(/≥/g, '>=').match(/^(.+?)(<=?)\s*x\s*(<=?)(.+)$/i);
      if (m) {
        const lo = evalNum(m[1]), hi = evalNum(m[4]);
        if (!isFinite(lo) || !isFinite(hi)) return null;
        out.push({ lo, hi, loC: m[2] === '<=', hiC: m[3] === '<=' });
        continue;
      }
      const e = piece.match(/^x\s*=\s*(.+)$/i);
      if (e) { const v = evalNum(e[1]); if (!isFinite(v)) return null; out.push({ lo: v, hi: v, loC: true, hiC: true }); continue; }
      return null;
    }
    return out;
  }
  function normIntervals(list, tol) {
    const a = list.slice().sort((p, q) => p.lo - q.lo || (q.loC - p.loC));
    const out = [];
    for (const iv of a) {
      const last = out[out.length - 1];
      if (last && (iv.lo < last.hi - tol || (Math.abs(iv.lo - last.hi) <= tol && (last.hiC || iv.loC)))) {
        if (iv.hi > last.hi + tol) { last.hi = iv.hi; last.hiC = iv.hiC; }
        else if (Math.abs(iv.hi - last.hi) <= tol) last.hiC = last.hiC || iv.hiC;
      } else out.push(Object.assign({}, iv));
    }
    return out;
  }
  function sameIntervals(a, b, tol) {
    const A = normIntervals(a, tol), B = normIntervals(b, tol);
    return A.length === B.length && A.every((p, i) => Math.abs(p.lo - B[i].lo) <= tol && Math.abs(p.hi - B[i].hi) <= tol && p.loC === B[i].loC && p.hiC === B[i].hiC);
  }
  function intervalsCheck(answer, tol) {
    tol = tol || 0.01;
    return s => { const v = parseIntervals(s); return v !== null && sameIntervals(v, answer, tol); };
  }

  // Solve g(x) op 0 on [lo, hi) given every x where g can change sign (zeros) or is undefined (opts.undef).
  function solveIneq(g, op, crit, opts) {
    opts = opts || {};
    const lo = opts.lo === undefined ? 0 : opts.lo, hi = opts.hi === undefined ? 2 * PI : opts.hi;
    const undef = (opts.undef || []).filter(u => u >= lo - 1e-9 && u <= hi + 1e-9);
    const isUndef = x => undef.some(u => Math.abs(u - x) < 1e-9);
    const holds = x => {
      if (isUndef(x)) return false;
      const v = g(x);
      if (!isFinite(v)) return false;
      if (Math.abs(v) < 1e-9) return op === '<=' || op === '>=';
      return (op === '<' || op === '<=') ? v < 0 : v > 0;
    };
    const pts = [lo, hi].concat(crit, undef).filter(x => x >= lo - 1e-9 && x <= hi + 1e-9).sort((a, b) => a - b)
      .filter((x, i, s) => i === 0 || x - s[i - 1] > 1e-9);
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      if (holds((a + b) / 2)) out.push({ lo: a, hi: b, loC: holds(a), hiC: b < hi - 1e-9 ? holds(b) : false });
    }
    // isolated solutions (e.g. sin x ≥ 1 only at π/2)
    pts.forEach(x => { if (x < hi - 1e-9 && holds(x) && !out.some(iv => x >= iv.lo - 1e-9 && x <= iv.hi + 1e-9)) out.push({ lo: x, hi: x, loC: true, hiC: true }); });
    return normIntervals(out, 1e-9);
  }

  // Format an interval list. label(x) → { t: plain text, tex } (defaults to multiples of π, else 3 decimals).
  function defaultLabel(x) {
    const f = M.asPiFraction(x, 24);
    if (f) return { t: M.formatPi(x, 24), tex: M.texPi(x, 24) };
    return { t: M.fmt(x, 3), tex: M.fmt(x, 3) };
  }
  function intervalsText(list, label, tex) {
    label = label || defaultLabel;
    if (!list.length) return tex ? '\\varnothing' : 'no solution';
    return list.map(iv => {
      const a = label(iv.lo), b = label(iv.hi);
      if (Math.abs(iv.hi - iv.lo) < 1e-9) return tex ? '\\{' + a.tex + '\\}' : '{' + a.t + '}';
      return tex ? (iv.loC ? '[' : '(') + a.tex + ', ' + b.tex + (iv.hiC ? ']' : ')')
        : (iv.loC ? '[' : '(') + a.t + ', ' + b.t + (iv.hiC ? ']' : ')');
    }).join(tex ? ' \\cup ' : ' ∪ ');
  }

  // Exact-looking text for numbers like √3/2, 2√3/3, 1/6 (plain or TeX). Falls back to 4 decimals.
  function surd(v, tex) {
    if (Math.abs(v) < 1e-12) return '0';
    for (const r of [1, 2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30]) {
      const q = v / Math.sqrt(r);
      for (let d = 1; d <= 30; d++) {
        const n = Math.round(q * d);
        if (n !== 0 && Math.abs(n / d - q) < 1e-9) {
          const g = M.gcd(n, d), nn = Math.abs(n / g), dd = d / g, sg = n < 0 ? '-' : '';
          const rad = r === 1 ? '' : tex ? '\\sqrt{' + r + '}' : '√' + r;
          const num = r === 1 ? String(nn) : (nn === 1 ? '' : nn) + rad;
          if (dd === 1) return sg + num;
          return tex ? sg + '\\tfrac{' + num + '}{' + dd + '}' : sg + num + '/' + dd;
        }
      }
    }
    return M.fmt(v, 4);
  }

  Object.assign(U4, { compile, evalNum, convCheck, samples, valuesCheck, splitValues, sameSet, parseIntervals, intervalsCheck, sameIntervals, normIntervals, solveIneq, intervalsText, surd, isUndefText, FUN });
})();
