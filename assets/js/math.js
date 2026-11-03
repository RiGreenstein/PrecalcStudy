/* Math helpers shared by graphs, widgets, quizzes, and unit content. */
(function () {
  const DEG = Math.PI / 180;

  function degToRad(d) { return d * DEG; }
  function radToDeg(r) { return r / DEG; }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { [a, b] = [b, a % b]; }
    return a || 1;
  }

  function approxEqual(a, b, tol) {
    if (tol === undefined) tol = 1e-6;
    return Math.abs(a - b) <= tol;
  }

  function round(x, places) {
    const p = Math.pow(10, places === undefined ? 4 : places);
    return Math.round(x * p) / p;
  }

  // Format a number nicely: trims trailing zeros, handles -0.
  function fmt(x, places) {
    if (!isFinite(x)) return String(x);
    const r = round(x, places === undefined ? 4 : places);
    if (Object.is(r, -0) || r === 0) return '0';
    return String(r);
  }

  // Try to express x as (n/d)·π with small d. Returns {n, d} or null.
  function asPiFraction(x, maxDen) {
    maxDen = maxDen || 36;
    const k = x / Math.PI;
    for (let d = 1; d <= maxDen; d++) {
      const n = Math.round(k * d);
      if (Math.abs(n / d - k) < 1e-9) {
        const g = gcd(n, d);
        return { n: n / g, d: d / g };
      }
    }
    return null;
  }

  // Plain-text π fraction, e.g. "5π/6", "-π/2", "2π", "0".
  function formatPi(x, maxDen) {
    const f = asPiFraction(x, maxDen);
    if (!f) return fmt(x);
    if (f.n === 0) return '0';
    const sign = f.n < 0 ? '-' : '';
    const n = Math.abs(f.n);
    const num = n === 1 ? 'π' : n + 'π';
    return f.d === 1 ? sign + num : sign + num + '/' + f.d;
  }

  // LaTeX π fraction, e.g. "\frac{5\pi}{6}".
  function texPi(x, maxDen) {
    const f = asPiFraction(x, maxDen);
    if (!f) return fmt(x);
    if (f.n === 0) return '0';
    const sign = f.n < 0 ? '-' : '';
    const n = Math.abs(f.n);
    const num = n === 1 ? '\\pi' : n + '\\pi';
    return f.d === 1 ? sign + num : sign + '\\frac{' + num + '}{' + f.d + '}';
  }

  // Parse user input like "5pi/6", "5π/6", "-pi/2", "2pi", "pi", "1.57", "3/4 pi", "0.5π".
  function parsePi(str) {
    if (str === null || str === undefined) return NaN;
    let s = String(str).trim().toLowerCase()
      .replace(/\s+/g, '')
      .replace(/π/g, 'pi')
      .replace(/×|\*/g, '');
    if (s === '') return NaN;
    if (!s.includes('pi')) {
      const v = parseFraction(s);
      return v;
    }
    // Forms: [coef]pi[/den]  or  [num]/[den]pi  or  pi[num]/[den]
    let m = s.match(/^(-?)(\d*\.?\d*)pi(?:\/(\d+\.?\d*))?$/);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const coef = m[2] === '' ? 1 : parseFloat(m[2]);
      const den = m[3] ? parseFloat(m[3]) : 1;
      return sign * coef * Math.PI / den;
    }
    m = s.match(/^(-?\d*\.?\d*)\/(\d+\.?\d*)pi$/);
    if (m) {
      const num = m[1] === '' || m[1] === '-' ? (m[1] === '-' ? -1 : 1) : parseFloat(m[1]);
      return num * Math.PI / parseFloat(m[2]);
    }
    m = s.match(/^(-?)pi(\d+\.?\d*)\/(\d+\.?\d*)$/);
    if (m) {
      return (m[1] === '-' ? -1 : 1) * parseFloat(m[2]) * Math.PI / parseFloat(m[3]);
    }
    // number divided by π, e.g. "36/pi"
    m = s.match(/^(-?\d*\.?\d+)\/pi$/);
    if (m) return parseFloat(m[1]) / Math.PI;
    return NaN;
  }

  // Parse "3/4", "-1/2", "0.75", "2".
  function parseFraction(s) {
    s = String(s).trim().replace(/\s+/g, '');
    const m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
    if (m) return parseFloat(m[1]) / parseFloat(m[2]);
    const v = parseFloat(s);
    return isNaN(v) ? NaN : v;
  }

  // Parse exact-value style input: "sqrt(3)/2", "√3/2", "-√2/2", "1/2", "0", "-1", "0.866", "sqrt3/2", "root 3 over 2".
  function parseExact(str) {
    if (str === null || str === undefined) return NaN;
    let s = String(str).trim().toLowerCase()
      .replace(/\s+/g, '')
      .replace(/√/g, 'sqrt')
      .replace(/root/g, 'sqrt')
      .replace(/over/g, '/')
      .replace(/sqrt\((\d+)\)/g, 'sqrt$1')
      .replace(/sqrt\[(\d+)\]/g, 'sqrt$1');
    if (s === '') return NaN;
    // (-)?(coef)?sqrtN(/den)?
    let m = s.match(/^(-?)(\d*)sqrt(\d+)(?:\/(\d+))?$/);
    if (m) {
      const sign = m[1] === '-' ? -1 : 1;
      const coef = m[2] === '' ? 1 : parseInt(m[2], 10);
      const rad = parseInt(m[3], 10);
      const den = m[4] ? parseInt(m[4], 10) : 1;
      return sign * coef * Math.sqrt(rad) / den;
    }
    // -1/sqrt2 style
    m = s.match(/^(-?\d+)\/sqrt(\d+)$/);
    if (m) return parseInt(m[1], 10) / Math.sqrt(parseInt(m[2], 10));
    return parseFraction(s);
  }

  // Exact value display for the common unit-circle values; falls back to decimal.
  const EXACT = [
    { v: 0, t: '0', tex: '0' },
    { v: 0.5, t: '1/2', tex: '\\tfrac{1}{2}' },
    { v: Math.SQRT2 / 2, t: '√2/2', tex: '\\tfrac{\\sqrt{2}}{2}' },
    { v: Math.sqrt(3) / 2, t: '√3/2', tex: '\\tfrac{\\sqrt{3}}{2}' },
    { v: 1, t: '1', tex: '1' },
    { v: Math.sqrt(3) / 3, t: '√3/3', tex: '\\tfrac{\\sqrt{3}}{3}' },
    { v: Math.sqrt(3), t: '√3', tex: '\\sqrt{3}' },
    { v: 2 * Math.sqrt(3) / 3, t: '2√3/3', tex: '\\tfrac{2\\sqrt{3}}{3}' },
    { v: Math.SQRT2, t: '√2', tex: '\\sqrt{2}' },
    { v: 2, t: '2', tex: '2' }
  ];
  function formatExact(x, tex) {
    if (!isFinite(x)) return tex ? '\\text{undefined}' : 'undefined';
    const a = Math.abs(x);
    for (const e of EXACT) {
      if (Math.abs(a - e.v) < 1e-9) {
        const s = tex ? e.tex : e.t;
        return (x < 0 ? '-' : '') + s;
      }
    }
    return fmt(x, 4);
  }

  // Degrees ↔ degrees/minutes/seconds.
  function toDMS(deg) {
    const sign = deg < 0 ? -1 : 1;
    let total = Math.abs(deg) * 3600;
    total = Math.round(total);
    const d = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return { sign, d, m, s };
  }
  function formatDMS(deg, withSeconds) {
    const o = toDMS(deg);
    let out = (o.sign < 0 ? '-' : '') + o.d + '°' + String(o.m).padStart(2, '0') + "'";
    if (withSeconds) out += String(o.s).padStart(2, '0') + '"';
    return out;
  }
  // Parse "32°15'", "32 15", "32d15m", "32°15'30\"", "-12° 30'".
  function parseDMS(str) {
    if (str === null || str === undefined) return NaN;
    let s = String(str).trim().toLowerCase().replace(/[°º]/g, 'd').replace(/[′']/g, 'm').replace(/[″"]/g, 's');
    s = s.replace(/\s+/g, ' ');
    let m = s.match(/^(-?)\s*(\d+\.?\d*)\s*d?\s*(\d+\.?\d*)?\s*m?\s*(\d+\.?\d*)?\s*s?$/);
    if (!m) return NaN;
    const sign = m[1] === '-' ? -1 : 1;
    const d = parseFloat(m[2]);
    const mi = m[3] ? parseFloat(m[3]) : 0;
    const se = m[4] ? parseFloat(m[4]) : 0;
    return sign * (d + mi / 60 + se / 3600);
  }

  function normalizeDeg(t) { return ((t % 360) + 360) % 360; }
  function normalizeRad(t) { const T = 2 * Math.PI; return ((t % T) + T) % T; }
  function quadrant(deg) {
    const t = normalizeDeg(deg);
    if (t === 0 || t === 90 || t === 180 || t === 270) return 0; // quadrantal
    return t < 90 ? 1 : t < 180 ? 2 : t < 270 ? 3 : 4;
  }
  function referenceAngle(deg) {
    const t = normalizeDeg(deg);
    if (t <= 90) return t;
    if (t <= 180) return 180 - t;
    if (t <= 270) return t - 180;
    return 360 - t;
  }

  // Seeded RNG (mulberry32) so quiz questions can be replayed.
  function rng(seed) {
    let a = seed >>> 0;
    const next = function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
    return {
      next,
      int(lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      pick(arr) { return arr[Math.floor(next() * arr.length)]; },
      shuffle(arr) {
        const a2 = arr.slice();
        for (let i = a2.length - 1; i > 0; i--) {
          const j = Math.floor(next() * (i + 1));
          [a2[i], a2[j]] = [a2[j], a2[i]];
        }
        return a2;
      },
      sign() { return next() < 0.5 ? -1 : 1; },
      bool(p) { return next() < (p === undefined ? 0.5 : p); }
    };
  }

  // Parse a list of numbers like "30, 150" or "30 and 150" → sorted array.
  function parseNumberList(str) {
    if (!str) return [];
    return String(str).replace(/°/g, '').split(/[,;]|\band\b|\s+/).map(s => s.trim()).filter(Boolean).map(parseFraction).filter(x => !isNaN(x)).sort((a, b) => a - b);
  }
  function sameNumberSet(a, b, tol) {
    if (a.length !== b.length) return false;
    const sa = a.slice().sort((x, y) => x - y), sb = b.slice().sort((x, y) => x - y);
    return sa.every((x, i) => approxEqual(x, sb[i], tol === undefined ? 0.05 : tol));
  }

  // Degree symbol helper for display.
  function deg(x, places) { return fmt(x, places === undefined ? 2 : places) + '°'; }

  window.M = {
    DEG, degToRad, radToDeg, gcd, approxEqual, round, fmt,
    asPiFraction, formatPi, texPi, parsePi, parseFraction, parseExact, formatExact,
    toDMS, formatDMS, parseDMS, normalizeDeg, normalizeRad, quadrant, referenceAngle,
    rng, parseNumberList, sameNumberSet, deg
  };
})();
