/* Unit 2 — meta + helpers shared by its section files. Sections are pushed in by sections-*.js. */
(function () {
  window.UNIT_DATA = window.UNIT_DATA || {};
  window.UNIT_DATA['unit-2'] = {
    title: 'Unit 2 — Sinusoids, Radians & Inverse Trig',
    intro: String.raw`Everything on this test comes back to one equation, written the way your book writes it:

$$y = C + A\cos\big(B(x - D)\big)$$

$A$ = amplitude, $B$ = how many cycles fit in $360^\circ$ (so period $= 360^\circ/B$), $C$ = the sinusoidal axis, $D$ = phase displacement. Learn to go **both directions**: equation → graph and graph → equation. Then radians (2-5), inverses (2-6, 2-10, 2-11), the other four functions (2-9), and word problems (2-12) are all variations on that skill.`,
    sections: []
  };

  const PI = Math.PI;
  const DEG = PI / 180;

  // Draws y = C + A·fn(B(x − D)) in a quiz/practice card without showing the equation.
  function graphOf(p) {
    return function (container) {
      const mode = p.mode || 'deg';
      const f = Explore.makeFn(p.fn, p.A, p.B, p.C, p.D, mode);
      const P = Explore.periodOf(p.fn, p.B, mode);
      const amp = Math.abs(p.A);
      const view = p.view || (mode === 'deg'
        ? { xMin: -30, xMax: 390, xStep: p.xStep || 30 }
        : { xMin: -PI / 6, xMax: 2 * PI + PI / 6, xStep: p.xStep || PI / 6 });
      const yPad = Math.max(1, amp * 0.5);
      const yMin = p.yMin !== undefined ? p.yMin : Math.floor(p.C - amp - yPad);
      const yMax = p.yMax !== undefined ? p.yMax : Math.ceil(p.C + amp + yPad);
      const g = new Graph(container, Object.assign({
        yMin, yMax, yStep: p.yStep || (yMax - yMin > 12 ? 2 : 1), xUnit: mode, height: p.height || 260, interactive: false,
        fns: [{ f, asymptotes: Explore.asymptotesOf(p.fn, p.B, p.D, mode, view.xMin, view.xMax) }],
        points: p.points === false ? [] : Explore.criticalPoints(p.fn, p.A, p.B, p.C, p.D, mode, P, true).filter(pt => pt.x >= view.xMin && pt.x <= view.xMax),
        hlines: p.axis ? [{ y: p.C }] : []
      }, view));
      return g;
    };
  }

  // Random "nice" parameter sets for sinusoid questions.
  function randomSinusoid(rng, opts) {
    opts = opts || {};
    const mode = opts.mode || 'deg';
    const fn = opts.fn || rng.pick(['sin', 'cos']);
    const A = opts.A !== undefined ? opts.A : rng.pick(opts.allowNegA ? [1, 2, 3, 4, 0.5, 1.5, -1, -2, -3] : [1, 2, 3, 4, 0.5, 1.5, 2.5]);
    const B = opts.B !== undefined ? opts.B : (mode === 'deg' ? rng.pick([0.5, 1, 2, 3, 4, 1.5]) : rng.pick([0.5, 1, 2, 3, 4]));
    const C = opts.C !== undefined ? opts.C : rng.int(-4, 5);
    let D;
    if (opts.D !== undefined) D = opts.D;
    else if (mode === 'deg') D = rng.pick([0, 30, 45, 60, 90, 120, 150, -30, -60]);
    else D = rng.pick([0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, -PI / 6, -PI / 4]);
    return { fn, A, B, C, D, mode };
  }

  const texEq = Explore.texEquation;
  const deg = v => M.fmt(v, 2) + '°';
  const degTex = v => M.fmt(v, 2) + '^\\circ';

  // Standard exact-value table (degrees → sin, cos) for generators.
  const SPECIAL = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];
  const NICE_VALUES = [
    { v: 0, tex: '0' }, { v: 0.5, tex: '\\tfrac{1}{2}' }, { v: -0.5, tex: '-\\tfrac{1}{2}' },
    { v: Math.SQRT2 / 2, tex: '\\tfrac{\\sqrt{2}}{2}' }, { v: -Math.SQRT2 / 2, tex: '-\\tfrac{\\sqrt{2}}{2}' },
    { v: Math.sqrt(3) / 2, tex: '\\tfrac{\\sqrt{3}}{2}' }, { v: -Math.sqrt(3) / 2, tex: '-\\tfrac{\\sqrt{3}}{2}' },
    { v: 1, tex: '1' }, { v: -1, tex: '-1' }
  ];
  // All θ in [0, 360) with sin θ = v (or cos θ = v), for nice v.
  function solutionsDeg(fn, v) {
    const out = [];
    for (let t = 0; t < 360; t += 15) {
      const val = fn === 'sin' ? Math.sin(t * DEG) : Math.cos(t * DEG);
      if (Math.abs(val - v) < 1e-9) out.push(t);
    }
    return out;
  }

  window.U2 = { graphOf, randomSinusoid, texEq, deg, degTex, SPECIAL, NICE_VALUES, solutionsDeg, PI, DEG };
})();
