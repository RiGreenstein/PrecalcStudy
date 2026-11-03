/* Unit 2 — sections 2-1 to 2-4: parent graphs, solving in degrees, period/amplitude, shifts, the general equation. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { graphOf, randomSinusoid, texEq, deg, degTex, NICE_VALUES, solutionsDeg, PI, DEG } = window.U2;
  const r = String.raw;

  // ======================= 2-1 =======================
  U.sections.push({
    id: '2-1', title: 'Sine & cosine graphs; solving in degrees',
    topics: [
      {
        id: '2-1-parent-graphs', title: 'Sin / cos parent graphs',
        notes: r`## The two parent graphs

Both $y = \sin x$ and $y = \cos x$ are **sinusoids**: smooth waves that repeat every $360^\circ$, bounded between $-1$ and $1$.

| **Feature** | **$y = \sin x$** | **$y = \cos x$** |
| --- | --- | --- |
| Value at $0^\circ$ | $0$ (on the axis, heading **up**) | $1$ (at a **high point**) |
| High points | $90^\circ + 360^\circ n$ | $0^\circ + 360^\circ n$ |
| Low points | $270^\circ + 360^\circ n$ | $180^\circ + 360^\circ n$ |
| Zeros | $0^\circ, 180^\circ, 360^\circ, \dots$ | $90^\circ, 270^\circ, \dots$ |
| Period | $360^\circ$ | $360^\circ$ |
| Amplitude | $1$ | $1$ |

The cosine graph **is** the sine graph slid $90^\circ$ to the left: $\cos x = \sin(x + 90^\circ)$. That's why your book usually writes the general equation with cosine: a cosine cycle *starts at a high point*, which is easy to spot on a graph.

## Five critical points per cycle

To sketch one cycle, plot the five points at quarter-period spacing and connect smoothly:

- **cos:** high → axis → low → axis → high
- **sin:** axis(up) → high → axis(down) → low → axis(up)

The high/low points are the [[critical points]]; where the graph crosses the axis are the [[points of inflection]] (the curve switches from bending down to bending up).

> **Common mistake:** drawing sharp corners at the peaks. A sinusoid is round at the top and bottom, and steepest where it crosses the axis.

## Even / odd

$\cos(-x) = \cos x$ (cosine is symmetric about the $y$-axis — *even*), while $\sin(-x) = -\sin x$ (sine has point symmetry about the origin — *odd*). This matters when you see a negative inside: $\cos(-x)$ is just $\cos x$, but $\sin(-x)$ flips the graph.`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 1, B: 1, C: 0, D: 0, sliders: ['D'], challenge: false, modeSwitch: false,
          show: { parent: true, axis: false, amplitude: false, period: true, critical: true },
          intro: 'Switch between sin and cos. Slide $D$ to see that cosine is literally sine shifted — find the $D$ that makes the sine graph land exactly on top of the dashed cosine parent.',
          tasks: r`1. Set the function to **sin**. What $D$ makes it match the dashed cosine graph? (There is more than one — why?)
2. Hover the graph. Where is $\sin x = \cos x$ in the first cycle? Does the value make sense?
3. Without looking: list the five critical points of one cycle of $y = \cos x$ starting at $0^\circ$. Then check with the "Critical points" toggle.`
        },
        practice: [
          { q: r`Sketch one full cycle of $y = \cos x$ starting at $x = 0^\circ$. Label the five critical points with coordinates.`,
            hint: 'Cosine starts at a high point. Quarter-period spacing is 90°.',
            answer: r`$(0^\circ, 1),\ (90^\circ, 0),\ (180^\circ, -1),\ (270^\circ, 0),\ (360^\circ, 1)$`,
            solution: r`Period is $360^\circ$, so quarter-steps are $90^\circ$ apart. Cosine's pattern is high → axis → low → axis → high, so the $y$-values go $1, 0, -1, 0, 1$.` },
          { q: r`At what $x$-values in $0^\circ \le x < 720^\circ$ does $y = \sin x$ reach its **minimum**?`,
            hint: 'Sine bottoms out three-quarters of the way through each cycle.',
            answer: r`$270^\circ$ and $630^\circ$`,
            solution: r`The low point of $y = \sin x$ in the first cycle is at $270^\circ$. Add one period ($360^\circ$) to get $630^\circ$. The next, $990^\circ$, is outside the interval.` },
          { q: r`True or false, and why: "The graph of $y = \cos x$ can be obtained by shifting the graph of $y = \sin x$ to the **right** by $90^\circ$."`,
            hint: r`Shifting right by $90^\circ$ means replacing $x$ with $x - 90^\circ$. Does $\sin(x - 90^\circ)$ equal $\cos x$? Test $x = 0^\circ$.`,
            answer: 'False. Shifting sine right by $90^\circ$ gives $-\cos x$. Shifting **left** by $90^\circ$ gives $\cos x$.',
            solution: r`At $x = 0^\circ$: $\sin(0^\circ - 90^\circ) = \sin(-90^\circ) = -1$, but $\cos 0^\circ = 1$. So a right shift doesn't work. Sine reaches its high point at $90^\circ$; to move that high point to $0^\circ$ you must shift left: $\cos x = \sin(x + 90^\circ)$. (Shifting right by $270^\circ$ also works — same graph.)` },
          { q: r`Without a calculator, decide which is larger: $\sin 100^\circ$ or $\sin 80^\circ$. Then: $\cos 100^\circ$ or $\cos 80^\circ$?`,
            hint: 'Picture the graphs near 90°. Sine is symmetric about its peak at 90°; cosine is crossing the axis there.',
            answer: r`$\sin 100^\circ = \sin 80^\circ$ (equal). $\cos 80^\circ > \cos 100^\circ$ (cosine is positive at $80^\circ$, negative at $100^\circ$).`,
            solution: r`$100^\circ$ and $80^\circ$ are each $10^\circ$ from sine's high point at $90^\circ$, so by symmetry $\sin 100^\circ = \sin 80^\circ$. Cosine is decreasing through zero at $90^\circ$, so $\cos 80^\circ \approx 0.17 > 0 > \cos 100^\circ \approx -0.17$.` }
        ],
        quiz: [
          // identify a parent graph (possibly reflected)
          function (rng) {
            const which = rng.pick([['sin', 1], ['cos', 1], ['sin', -1], ['cos', -1]]);
            const [fn, A] = which;
            const name = (A < 0 ? '-' : '') + fn;
            const tex = s => '$y = ' + (s.startsWith('-') ? '-' : '') + '\\' + s.replace('-', '') + ' x$';
            return {
              type: 'mc',
              prompt: 'Which equation matches this graph?',
              graph: graphOf({ fn, A, B: 1, C: 0, D: 0, mode: 'deg', xStep: 90, view: { xMin: -90, xMax: 450, xStep: 90 }, yMin: -2, yMax: 2 }),
              choices: ['sin', 'cos', '-sin', '-cos'].map(s => ({ text: tex(s), correct: s === name })),
              explanation: r`Look at $x = 0^\circ$. A graph **at a high point** there is $\cos x$; at a **low point**, $-\cos x$; **on the axis heading up**, $\sin x$; on the axis heading **down**, $-\sin x$.`
            };
          },
          // where is a feature?
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const feat = rng.pick(['high', 'low', 'zero']);
            const base = { sin: { high: 90, low: 270, zero: [0, 180] }, cos: { high: 0, low: 180, zero: [90, 270] } }[fn][feat];
            const k = rng.int(0, 2);
            const lo = 360 * k, hi = 360 * (k + 1);
            const answers = (Array.isArray(base) ? base : [base]).map(x => x + lo).filter(x => x >= lo && x < hi);
            const label = feat === 'high' ? 'high point(s)' : feat === 'low' ? 'low point(s)' : 'zero(s)';
            return {
              type: 'set',
              prompt: r`List every $x$ in $` + lo + r`^\circ \le x < ` + hi + r`^\circ$ where $y = ` + '\\' + fn + r` x$ has a ` + label + '. Separate values with commas.',
              answers, tol: 0.5,
              answerText: answers.map(a => a + '°').join(', '),
              explanation: r`One cycle of $` + '\\' + fn + r` x$ runs from $` + lo + r`^\circ$ to $` + hi + r`^\circ$. ` + (fn === 'cos' ? 'Cosine: high at the start of the cycle, zero a quarter in, low halfway, zero at three-quarters.' : 'Sine: zero at the start, high a quarter in, zero halfway, low at three-quarters.')
            };
          },
          // value comparison / sign reasoning
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const x = rng.pick([100, 170, 190, 260, 280, 350, 95, 185, 275, 10, 80]);
            const v = fn === 'sin' ? Math.sin(x * DEG) : Math.cos(x * DEG);
            const correct = v > 0 ? 'positive' : 'negative';
            return {
              type: 'mc',
              prompt: r`Without a calculator: is $` + '\\' + fn + ' ' + x + r`^\circ$ positive or negative? (Picture the graph.)`,
              choices: [{ text: 'positive', correct: correct === 'positive' }, { text: 'negative', correct: correct === 'negative' }],
              explanation: r`$` + '\\' + fn + r` x$ is ` + (fn === 'sin' ? 'above the axis for $0^\\circ < x < 180^\\circ$ and below for $180^\\circ < x < 360^\\circ$.' : 'above the axis for $x$ within $90^\\circ$ of $0^\\circ$ or $360^\\circ$, and below for $90^\\circ < x < 270^\\circ$.') + ' Here $x = ' + x + '^\\circ$, so the value is **' + correct + '**.'
            };
          }
        ]
      },
      {
        id: '2-1-solve-degrees', title: 'Solving sin θ = k and cos θ = k in degrees',
        notes: r`## Two answers per cycle

A horizontal line $y = k$ (with $-1 < k < 1$) cuts one cycle of a sinusoid **twice**. So "solve $\sin\theta = k$ for $0^\circ \le \theta < 360^\circ$" almost always has **two** answers.

## The method

1. **Reference angle.** Find $\theta_{\text{ref}} = \sin^{-1}|k|$ (or $\cos^{-1}|k|$) with your calculator in degree mode, or from the exact-value table.
2. **Quadrants.** Decide where the function has the sign of $k$:
   - $\sin$ positive in **QI, QII**; negative in **QIII, QIV**
   - $\cos$ positive in **QI, QIV**; negative in **QII, QIII**
3. **Place the reference angle** in those two quadrants:
   - QI: $\theta_{\text{ref}}$ · QII: $180^\circ - \theta_{\text{ref}}$ · QIII: $180^\circ + \theta_{\text{ref}}$ · QIV: $360^\circ - \theta_{\text{ref}}$
4. **General solution** if asked: add $360^\circ n$ to each.

## Exact values you must know

| **$\theta_{\text{ref}}$** | **$\sin$** | **$\cos$** |
| --- | --- | --- |
| $30^\circ$ | $\tfrac12$ | $\tfrac{\sqrt3}{2}$ |
| $45^\circ$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt2}{2}$ |
| $60^\circ$ | $\tfrac{\sqrt3}{2}$ | $\tfrac12$ |

Plus the quadrantal angles: $\sin$ is $0, 1, 0, -1$ and $\cos$ is $1, 0, -1, 0$ at $0^\circ, 90^\circ, 180^\circ, 270^\circ$.

> **Common mistake:** stopping after the calculator answer. $\sin^{-1}(0.5) = 30^\circ$ is **one** solution; $150^\circ$ is the other. And for negative $k$, the calculator gives a negative angle — convert it to the $[0^\circ, 360^\circ)$ window.

## Isolate first

For something like $2\cos\theta + 1 = 0$, isolate: $\cos\theta = -\tfrac12$. Then run the method: reference angle $60^\circ$, cosine negative in QII and QIII → $120^\circ, 240^\circ$.`,
        explore: {
          type: 'custom',
          intro: r`A horizontal line $y = k$ crosses the sinusoid at every solution. Drag the $k$ slider and watch the solutions move. Switch between sin and cos.`,
          setup(container, L) {
            const { Graph, M, R } = L;
            const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
            const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
            const eq = R.el('div', { class: 'equation' }); top.appendChild(eq);
            const sw = R.el('div', { class: 'explorer-switches' }); top.appendChild(sw);
            const st = { fn: 'sin', k: 0.5, show: false };
            Graph.segmented(sw, [{ label: 'sin', value: 'sin' }, { label: 'cos', value: 'cos' }], 'sin', v => { st.fn = v; draw(); });
            const box = R.el('div'); root.appendChild(box);
            const g = new Graph(box, { xMin: -30, xMax: 390, yMin: -1.5, yMax: 1.5, xUnit: 'deg', xStep: 30, yStep: 0.5, height: 300, interactive: false });
            const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
            const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
            Graph.slider(sl, { label: 'k', min: -1, max: 1, step: 0.05, value: 0.5, onInput: v => { st.k = v; draw(); } });
            const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
            Graph.toggle(tg, 'Show the solutions', false, v => { st.show = v; draw(); });
            const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);
            function draw() {
              const f = st.fn === 'sin' ? Math.sin : Math.cos;
              const sols = [];
              if (Math.abs(st.k) <= 1) {
                const ref = M.radToDeg(Math.asin(Math.abs(st.k)));
                let cands;
                if (st.fn === 'sin') cands = st.k >= 0 ? [ref, 180 - ref] : [180 + ref, 360 - ref];
                else { const rc = M.radToDeg(Math.acos(Math.abs(st.k))); cands = st.k >= 0 ? [rc, 360 - rc] : [180 - rc, 180 + rc]; }
                cands.forEach(c => { if (!sols.some(s => Math.abs(s - c) < 1e-6)) sols.push(c); });
                sols.sort((a, b) => a - b);
              }
              g.update({
                fns: [{ f: x => f(x * M.DEG), label: 'y = ' + st.fn + ' θ' }],
                hlines: [{ y: st.k, label: 'y = k' }],
                points: st.show ? sols.map(x => ({ x, y: st.k, label: M.fmt(x, 1) + '°' })) : []
              });
              eq.innerHTML = R.tex('\\' + st.fn + '\\theta = ' + M.fmt(st.k, 2), true);
              info.innerHTML = st.show
                ? '<div class="info-row"><span>Solutions in [0°, 360°)</span><strong>' + (sols.length ? sols.map(s => M.fmt(s, 2) + '°').join(',  ') : 'none') + '</strong></div>' +
                  '<div class="info-row"><span>Reference angle</span><strong>' + M.fmt(M.radToDeg(st.fn === 'sin' ? Math.asin(Math.abs(st.k)) : Math.acos(Math.abs(st.k))), 2) + '°</strong></div>'
                : '<div class="info-row"><span>How many solutions?</span><strong>Count the crossings, then compute them. Toggle to check.</strong></div>';
            }
            draw();
          },
          tasks: r`1. Set $k = 0.5$ with **sin**. Predict both solutions, then reveal.
2. Set $k = -0.5$ with **cos**. Which quadrants? Predict, then reveal.
3. Set $k = 1$. How many solutions in one cycle? Why is this case different?
4. Set $k = 0.3$. Use your calculator's $\sin^{-1}$ and the reference-angle rules to get both answers to the nearest $0.1^\circ$, then reveal.`
        },
        practice: [
          { q: r`Solve $\cos\theta = -\tfrac{\sqrt3}{2}$ for $0^\circ \le \theta < 360^\circ$.`,
            hint: 'Reference angle for √3/2 with cosine is 30°. Where is cosine negative?',
            answer: r`$\theta = 150^\circ,\ 210^\circ$`,
            solution: r`$\cos^{-1}(\tfrac{\sqrt3}{2}) = 30^\circ$ is the reference angle. Cosine is negative in QII and QIII: $180^\circ - 30^\circ = 150^\circ$ and $180^\circ + 30^\circ = 210^\circ$.` },
          { q: r`Solve $2\sin\theta - 1 = 0$ for all $\theta$ (general solution, in degrees).`,
            hint: 'Isolate sin θ first.',
            answer: r`$\theta = 30^\circ + 360^\circ n$ or $\theta = 150^\circ + 360^\circ n$`,
            solution: r`$\sin\theta = \tfrac12$. Reference angle $30^\circ$; sine positive in QI and QII → $30^\circ$ and $150^\circ$. Sine repeats every $360^\circ$, so add $360^\circ n$ to each.` },
          { q: r`Solve $\sin\theta = -0.6$ for $0^\circ \le \theta < 360^\circ$, to the nearest $0.1^\circ$.`,
            hint: 'Your calculator returns a negative angle. Use it as a reference angle instead.',
            answer: r`$\theta \approx 216.9^\circ,\ 323.1^\circ$`,
            solution: r`$\sin^{-1}(0.6) \approx 36.87^\circ$ is the reference angle. Sine is negative in QIII and QIV: $180^\circ + 36.87^\circ = 216.9^\circ$ and $360^\circ - 36.87^\circ = 323.1^\circ$. (The calculator's $\sin^{-1}(-0.6) = -36.87^\circ$ is coterminal with $323.1^\circ$.)` },
          { q: r`How many solutions does $\cos\theta = 1.2$ have? What about $\cos\theta = 1$ on $0^\circ \le \theta < 360^\circ$?`,
            hint: 'What are the max and min of cosine?',
            answer: r`$\cos\theta = 1.2$: **no** solutions. $\cos\theta = 1$: exactly **one** ($\theta = 0^\circ$).`,
            solution: r`Cosine never exceeds $1$, so $1.2$ is impossible. The line $y = 1$ just touches the top of each cycle once, at $0^\circ$ (and $360^\circ$, which is excluded by the interval).` }
        ],
        quiz: [
          // exact-value solve
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const nv = rng.pick(NICE_VALUES.filter(n => Math.abs(n.v) < 1 && n.v !== 0));
            const answers = solutionsDeg(fn, nv.v);
            return {
              type: 'set',
              prompt: r`Solve $` + '\\' + fn + r`\theta = ` + nv.tex + r`$ for $0^\circ \le \theta < 360^\circ$. Enter all solutions, separated by commas.`,
              answers, tol: 0.5,
              answerText: answers.map(a => a + '°').join(', '),
              explanation: r`Reference angle: $` + M.radToDeg(fn === 'sin' ? Math.asin(Math.abs(nv.v)) : Math.acos(Math.abs(nv.v))).toFixed(0) + r`^\circ$. ` + (fn === 'sin' ? (nv.v > 0 ? 'Sine is positive in QI and QII.' : 'Sine is negative in QIII and QIV.') : (nv.v > 0 ? 'Cosine is positive in QI and QIV.' : 'Cosine is negative in QII and QIII.')) + ' Place the reference angle in those quadrants.'
            };
          },
          // calculator solve
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const k = rng.pick([0.2, 0.3, 0.35, 0.45, 0.55, 0.65, 0.7, 0.8, 0.9, -0.2, -0.3, -0.4, -0.55, -0.7, -0.85]);
            const ref = M.radToDeg(fn === 'sin' ? Math.asin(Math.abs(k)) : Math.acos(Math.abs(k)));
            let answers;
            if (fn === 'sin') answers = k > 0 ? [ref, 180 - ref] : [180 + ref, 360 - ref];
            else answers = k > 0 ? [ref, 360 - ref] : [180 - ref, 180 + ref];
            answers.sort((a, b) => a - b);
            return {
              type: 'set',
              prompt: r`Solve $` + '\\' + fn + r`\theta = ` + k + r`$ for $0^\circ \le \theta < 360^\circ$ to the nearest $0.1^\circ$. Enter both, separated by a comma.`,
              answers, tol: 0.15,
              answerText: answers.map(a => M.fmt(a, 1) + '°').join(', '),
              explanation: r`Reference angle $= ` + '\\' + fn + r`^{-1}(` + Math.abs(k) + r`) \approx ` + M.fmt(ref, 2) + r`^\circ$. ` + (fn === 'sin' ? (k > 0 ? 'Sine positive → QI, QII: $\\theta_{ref}$ and $180^\\circ - \\theta_{ref}$.' : 'Sine negative → QIII, QIV: $180^\\circ + \\theta_{ref}$ and $360^\\circ - \\theta_{ref}$.') : (k > 0 ? 'Cosine positive → QI, QIV: $\\theta_{ref}$ and $360^\\circ - \\theta_{ref}$.' : 'Cosine negative → QII, QIII: $180^\\circ - \\theta_{ref}$ and $180^\\circ + \\theta_{ref}$.'))
            };
          },
          // isolate-first equation
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const nv = rng.pick(NICE_VALUES.filter(n => Math.abs(n.v) < 1 && n.v !== 0));
            const a = rng.pick([2, 3, 4]);
            // a·fn θ + b = c  with fn θ = v  → choose b, c = a v + b (needs c "nice")
            const niceCoef = { 0.5: 1, '-0.5': -1 }[nv.v];
            let prompt, expl;
            if (niceCoef !== undefined && a === 2) {
              const b = rng.int(-3, 3);
              prompt = r`Solve $2` + '\\' + fn + r`\theta ` + (b >= 0 ? '+ ' + b : '- ' + (-b)) + ' = ' + (niceCoef + b) + r`$ for $0^\circ \le \theta < 360^\circ$.`;
              expl = r`Isolate: $2` + '\\' + fn + r`\theta = ` + niceCoef + r`$, so $` + '\\' + fn + r`\theta = ` + nv.tex + '$.';
            } else {
              const sq = nv.tex.includes('sqrt{2}') ? 2 : nv.tex.includes('sqrt{3}') ? 3 : null;
              const sign = nv.v < 0 ? '-' : '';
              prompt = r`Solve $2` + '\\' + fn + r`\theta = ` + (sq ? sign + '\\sqrt{' + sq + '}' : M.fmt(2 * nv.v)) + r`$ for $0^\circ \le \theta < 360^\circ$.`;
              expl = r`Divide by 2: $` + '\\' + fn + r`\theta = ` + nv.tex + '$.';
            }
            const answers = solutionsDeg(fn, nv.v);
            return {
              type: 'set', prompt, answers, tol: 0.5,
              answerText: answers.map(x => x + '°').join(', '),
              explanation: expl + ' Then reference angle + quadrant rules give ' + answers.map(x => x + '°').join(' and ') + '.'
            };
          },
          // how many solutions
          function (rng) {
            const fn = rng.pick(['sin', 'cos']);
            const k = rng.pick([1.5, -1.3, 1, -1, 0.4, -0.7, 0, 2]);
            const n = Math.abs(k) > 1 ? 0 : Math.abs(k) === 1 ? 1 : 2;
            return {
              type: 'mc',
              prompt: r`How many solutions does $` + '\\' + fn + r`\theta = ` + k + r`$ have on $0^\circ \le \theta < 360^\circ$?`,
              choices: [0, 1, 2, 4].map(c => ({ text: String(c), correct: c === n })),
              explanation: n === 0 ? 'The function stays between $-1$ and $1$, so a value outside that range has no solutions.' : n === 1 ? 'The line $y = \\pm 1$ just touches a peak or trough once per cycle.' : 'Any horizontal line strictly between $-1$ and $1$ crosses the wave twice per cycle.'
            };
          }
        ]
      }
    ]
  });

  // ======================= 2-2 =======================
  U.sections.push({
    id: '2-2', title: 'Period & amplitude',
    topics: [
      {
        id: '2-2-period', title: 'Cycles & periods of sinusoidal functions',
        notes: r`## Period

The [[period]] is the horizontal length of **one complete cycle** — the distance along the $x$-axis before the graph starts repeating.

In $y = \cos(Bx)$, the number $B$ tells you **how many cycles fit in $360^\circ$**:

$$\text{period} = \frac{360^\circ}{B} \qquad\Longleftrightarrow\qquad B = \frac{360^\circ}{\text{period}}$$

- $y = \cos 2x$: two cycles in $360^\circ$, period $180^\circ$. The graph is **squeezed**.
- $y = \cos \tfrac12 x$: half a cycle in $360^\circ$, period $720^\circ$. The graph is **stretched**.

> **Common mistake:** thinking $B$ *is* the period. $B$ is a *frequency*; bigger $B$ ⇒ **shorter** period. Always divide: $360^\circ \div B$.

## Finding the period from a graph

Measure from one high point to the next high point (or low to low, or between every *other* axis crossing). Measuring high-to-low gives only **half** a period.

## Counting cycles on an interval

Cycles on an interval of width $w$: $\dfrac{w}{\text{period}} = \dfrac{w \cdot B}{360^\circ}$.`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 1, B: 2, C: 0, D: 0, sliders: ['B'], challenge: false, modeSwitch: false,
          show: { parent: true, axis: false, amplitude: false, period: true, critical: true },
          intro: 'Only $B$ moves here. Watch the period bracket and the dashed parent graph.',
          tasks: r`1. Set $B = 3$. Read the period. Verify $360^\circ \div 3$.
2. Find the $B$ that gives a period of $720^\circ$. Why is it less than 1?
3. Set $B = 1.5$. How many cycles fit between $0^\circ$ and $360^\circ$? (Count the high points carefully.)`
        },
        practice: [
          { q: r`Find the period of $y = 4\sin(3x)$.`, hint: 'Period = 360° ÷ B. Amplitude is irrelevant here.', answer: r`$120^\circ$`, solution: r`$B = 3$, so period $= 360^\circ / 3 = 120^\circ$. The $4$ changes the height, not the width.` },
          { q: r`A sinusoid completes one cycle every $45^\circ$. What is $B$?`, hint: 'B = 360° ÷ period.', answer: r`$B = 8$`, solution: r`$B = 360^\circ / 45^\circ = 8$: eight cycles fit in $360^\circ$.` },
          { q: r`Find the period of $y = \cos\big(\tfrac{2}{3}x\big)$.`, hint: 'Dividing by a fraction — flip and multiply.', answer: r`$540^\circ$`, solution: r`$360^\circ \div \tfrac23 = 360^\circ \cdot \tfrac32 = 540^\circ$.` },
          { q: r`A graph has consecutive **high** points at $x = 20^\circ$ and $x = 110^\circ$. Find the period and $B$.`, hint: 'High to high is one full period.', answer: r`Period $90^\circ$, $B = 4$`, solution: r`$110^\circ - 20^\circ = 90^\circ$ is a full cycle. $B = 360^\circ / 90^\circ = 4$.` },
          { q: r`A graph has a high point at $x = 30^\circ$ and the **next low point** at $x = 75^\circ$. Find the period.`, hint: 'High to the next low is half a cycle.', answer: r`$90^\circ$`, solution: r`$75^\circ - 30^\circ = 45^\circ$ is half the period, so the period is $90^\circ$.` }
        ],
        quiz: [
          function (rng) {
            const B = rng.pick([2, 3, 4, 6, 0.5, 1.5, 8, 0.25]);
            const A = rng.pick([1, 2, 3, 5]);
            const fn = rng.pick(['sin', 'cos']);
            return { type: 'number', prompt: r`Find the period of $y = ` + (A === 1 ? '' : A) + '\\' + fn + '(' + M.fmt(B) + r`x)$.`, answer: 360 / B, tol: 0.5, unit: '°', answerText: M.fmt(360 / B) + '°', explanation: r`Period $= 360^\circ \div B = 360^\circ \div ` + M.fmt(B) + ' = ' + M.fmt(360 / B) + r`^\circ$. The coefficient $` + A + '$ only affects the height.' };
          },
          function (rng) {
            const P = rng.pick([30, 45, 60, 72, 90, 120, 180, 240, 720, 1080]);
            return { type: 'number', prompt: r`A sinusoid has period $` + P + r`^\circ$. Find $B$.`, answer: 360 / P, tol: 0.01, answerText: M.fmt(360 / P), explanation: r`$B = 360^\circ \div \text{period} = 360^\circ \div ` + P + r`^\circ = ` + M.fmt(360 / P) + '$.' };
          },
          function (rng) {
            const B = rng.pick([2, 3, 4, 1.5, 0.5, 6]);
            const w = rng.pick([360, 180, 720, 540]);
            const n = w * B / 360;
            return { type: 'number', prompt: r`How many complete cycles does $y = \cos(` + M.fmt(B) + r`x)$ make on $0^\circ \le x \le ` + w + r`^\circ$?`, answer: n, tol: 0.01, answerText: M.fmt(n), explanation: r`Period $= 360^\circ/` + M.fmt(B) + ' = ' + M.fmt(360 / B) + r`^\circ$. Cycles $= ` + w + r`^\circ \div ` + M.fmt(360 / B) + r`^\circ = ` + M.fmt(n) + '$.' };
          },
          function (rng) {
            const p = randomSinusoid(rng, { C: 0, D: 0, fn: 'cos', B: rng.pick([1, 2, 3, 4, 0.5, 1.5]) });
            return {
              type: 'number', prompt: 'Read the **period** of this graph.', graph: graphOf(Object.assign({}, p, { xStep: 30 })), answer: 360 / p.B, tol: 1, unit: '°', answerText: M.fmt(360 / p.B) + '°',
              explanation: r`Measure high point to the next high point: $0^\circ$ to $` + M.fmt(360 / p.B) + r`^\circ$. (Here $B = ` + M.fmt(p.B) + '$.)'
            };
          },
          function (rng) {
            const x1 = rng.pick([10, 20, 30, 40, 50]);
            const P = rng.pick([60, 90, 120, 180]);
            const half = rng.bool();
            const x2 = x1 + (half ? P / 2 : P);
            return {
              type: 'number',
              prompt: r`A sinusoid has a **high point** at $x = ` + x1 + r`^\circ$ and the next **` + (half ? 'low' : 'high') + r` point** at $x = ` + x2 + r`^\circ$. Find the period.`,
              answer: P, tol: 0.5, unit: '°', answerText: P + '°',
              explanation: half ? r`High to the *next low* is only half a cycle: $` + (x2 - x1) + r`^\circ \times 2 = ` + P + r`^\circ$.` : r`High to the next high is a full cycle: $` + x2 + ' - ' + x1 + ' = ' + P + r`^\circ$.`
            };
          }
        ]
      },
      {
        id: '2-2-amplitude', title: 'Amplitude of sinusoidal functions',
        notes: r`## Amplitude

The [[amplitude]] is the distance from the **sinusoidal axis** (the midline) up to a high point — equivalently, **half** the distance from a low point to a high point.

$$|A| = \frac{\text{max} - \text{min}}{2}$$

In $y = A\cos x$, the parent graph's heights are multiplied by $A$ (a *vertical dilation*). Amplitude is always written as a **positive** number, $|A|$.

## What a negative $A$ does

$y = -3\cos x$ still has amplitude $3$, but the graph is **reflected** across its axis: a cosine with $A < 0$ **starts at a low point** instead of a high point. Keep that in mind when you read $A$ off a graph in 2-4 — if a cosine-form cycle begins at a low point, either make $A$ negative or move $D$ half a period.

> **Common mistake:** amplitude = max − min. No — that's **twice** the amplitude. Divide by 2.

> **Common mistake:** amplitude = the max value. Only true when the axis is $y = 0$. Once there's a vertical shift ($C \ne 0$), you must subtract: amplitude $= \text{max} - C$.`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 2, B: 1, C: 0, D: 0, sliders: ['A'], challenge: false, modeSwitch: false,
          show: { parent: true, axis: true, amplitude: true, period: false, critical: true },
          intro: 'Only $A$ moves. Notice what happens when $A$ crosses zero.',
          tasks: r`1. Set $A = 3$. Read the max and min. Check $(\max - \min)/2$.
2. Set $A = -2$. Where does the cosine graph now start — high or low? What is the amplitude?
3. Toggle to **sin** and set $A = -1$. Compare with the dashed parent: what does negative $A$ do to a sine graph?`
        },
        practice: [
          { q: r`Find the amplitude of $y = -5\sin(2x)$.`, hint: 'Amplitude is |A|.', answer: r`$5$`, solution: r`$|A| = |-5| = 5$. The negative sign reflects the graph; it does not make the amplitude negative.` },
          { q: r`A sinusoid has maximum $11$ and minimum $3$. Find its amplitude.`, hint: 'Half of max − min.', answer: r`$4$`, solution: r`$(11 - 3)/2 = 4$. (Its axis is $y = 7$, not relevant for the amplitude itself.)` },
          { q: r`$y = A\cos x$ has a low point at $(180^\circ, -2.5)$. Find $A$ and the amplitude.`, hint: 'Cosine normally has its low point at 180° with value −A.', answer: r`$A = 2.5$; amplitude $2.5$`, solution: r`Parent cosine is at its low point ($-1$) when $x = 180^\circ$. Multiplying by $A$ gives $-A = -2.5$, so $A = 2.5$.` },
          { q: r`$y = A\cos x$ has a **low** point at $(0^\circ, -4)$. Find $A$.`, hint: 'Cosine should be at a HIGH point at 0°. Something is reflected.', answer: r`$A = -4$`, solution: r`At $x = 0^\circ$, $\cos 0^\circ = 1$, so $y = A$. Since $y = -4$ there, $A = -4$. The amplitude is $4$, but $A$ itself is negative because the graph is upside down.` }
        ],
        quiz: [
          function (rng) {
            const A = rng.pick([2, 3, 4, 5, 0.5, 1.5, -2, -3, -4, -0.5]);
            const B = rng.pick([1, 2, 3]);
            const fn = rng.pick(['sin', 'cos']);
            return { type: 'number', prompt: r`Find the amplitude of $y = ` + M.fmt(A) + '\\' + fn + '(' + (B === 1 ? '' : B) + r`x)$.`, answer: Math.abs(A), tol: 0.01, answerText: M.fmt(Math.abs(A)), explanation: r`Amplitude $= |A| = |` + M.fmt(A) + '| = ' + M.fmt(Math.abs(A)) + '$. The sign only reflects the graph.' };
          },
          function (rng) {
            const amp = rng.pick([1, 1.5, 2, 2.5, 3, 4, 5, 6]);
            const C = rng.int(-5, 8);
            return { type: 'number', prompt: r`A sinusoid has maximum value $` + M.fmt(C + amp) + '$ and minimum value $' + M.fmt(C - amp) + '$. Find the amplitude.', answer: amp, tol: 0.01, answerText: M.fmt(amp), explanation: r`$(\max - \min)/2 = (` + M.fmt(C + amp) + ' - (' + M.fmt(C - amp) + '))/2 = ' + M.fmt(amp) + '$. Not $\\max - \\min$, and not $\\max$ by itself.' };
          },
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'cos', D: 0, B: rng.pick([1, 2]), allowNegA: true, A: rng.pick([1, 2, 3, 4, -2, -3, 1.5]) });
            return {
              type: 'multi', prompt: 'From this graph, read the amplitude and the maximum value.', graph: graphOf(Object.assign({}, p, { xStep: 90 })),
              fields: [{ label: 'amplitude', answer: Math.abs(p.A), tol: 0.1 }, { label: 'maximum $y$', answer: p.C + Math.abs(p.A), tol: 0.1 }],
              explanation: r`Max is $` + M.fmt(p.C + Math.abs(p.A)) + '$, min is $' + M.fmt(p.C - Math.abs(p.A)) + r`$, so amplitude $= (` + M.fmt(p.C + Math.abs(p.A)) + ' - ' + M.fmt(p.C - Math.abs(p.A)) + ')/2 = ' + M.fmt(Math.abs(p.A)) + '$.'
            };
          },
          function (rng) {
            const A = rng.pick([2, 3, 4, -2, -3, -1]);
            const x = rng.pick([0, 180]);
            const y = A * Math.cos(x * DEG);
            return {
              type: 'number', prompt: r`$y = A\cos x$ passes through $(` + x + r`^\circ, ` + M.fmt(y) + r`)$. Find $A$ (sign included).`,
              answer: A, tol: 0.01, answerText: M.fmt(A),
              explanation: r`$\cos ` + x + r`^\circ = ` + Math.cos(x * DEG) + '$, so $y = ' + Math.cos(x * DEG) + r`\cdot A = ` + M.fmt(y) + r`$ gives $A = ` + M.fmt(A) + '$.' + (A < 0 ? ' A negative $A$ means the graph is reflected — amplitude is still $' + Math.abs(A) + '$.' : '')
            };
          }
        ]
      }
    ]
  });

  // ======================= 2-3 =======================
  U.sections.push({
    id: '2-3', title: 'Vertical shift & phase shift',
    topics: [
      {
        id: '2-3-vertical-shift', title: 'Vertical shift (sinusoidal axis, C)',
        notes: r`## The sinusoidal axis

Adding a constant moves the whole wave up or down:

$$y = C + A\cos x$$

The horizontal line $y = C$ is the [[sinusoidal axis]] (midline). It sits exactly halfway between max and min:

$$C = \frac{\text{max} + \text{min}}{2}, \qquad \text{max} = C + |A|, \qquad \text{min} = C - |A|$$

Your book writes $C$ *first* ($y = C + A\cos\ldots$) to remind you it's the "base level" the wave oscillates around.

## Reading $C$ from a graph

Find a high point and a low point; average their $y$-values. Or find where the graph crosses its midline (the points of inflection) — that $y$-value is $C$.

> **Common mistake:** assuming the axis is $y = 0$ because that's where the $x$-axis is. Always compute $(\max + \min)/2$.

> **Common mistake:** confusing $C$ with the $y$-intercept. The $y$-intercept is the value at $x = 0$, which is only $C$ if the graph happens to cross its axis there.`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 2, B: 1, C: 1, D: 0, sliders: ['A', 'C'], challenge: false, modeSwitch: false,
          show: { parent: true, axis: true, amplitude: true, period: false, critical: true },
          intro: 'Slide $C$ and watch the dashed axis line. $A$ is here too so you can see max $= C + A$ and min $= C - A$.',
          tasks: r`1. Set $C = 3$, $A = 2$. Predict max and min, then hover the graph to check.
2. Set $C = -1$, $A = 3$. Is the graph ever above the $x$-axis? Where?
3. Find values of $C$ and $A$ so the graph touches the $x$-axis but never crosses it.`
        },
        practice: [
          { q: r`A sinusoid has maximum $9$ and minimum $1$. Find the equation of its sinusoidal axis and its amplitude.`, hint: 'Average for the axis, half-difference for the amplitude.', answer: r`Axis $y = 5$; amplitude $4$`, solution: r`$C = (9 + 1)/2 = 5$. $|A| = (9 - 1)/2 = 4$.` },
          { q: r`State the maximum and minimum values of $y = -2 + 3\cos x$.`, hint: 'C ± |A|.', answer: r`Max $1$, min $-5$`, solution: r`$C = -2$, $|A| = 3$. Max $= -2 + 3 = 1$; min $= -2 - 3 = -5$.` },
          { q: r`The graph of $y = C + 4\sin x$ has minimum value $-1$. Find $C$ and the maximum.`, hint: 'min = C − |A|.', answer: r`$C = 3$; max $= 7$`, solution: r`$C - 4 = -1 \Rightarrow C = 3$. Max $= 3 + 4 = 7$.` },
          { q: r`Is the $y$-intercept of $y = 2 + 3\cos x$ equal to $C$? What about $y = 2 + 3\sin x$?`, hint: 'Plug in x = 0° to each.', answer: r`No for cosine ($y$-int $= 5$). Yes for sine ($y$-int $= 2$).`, solution: r`$\cos 0^\circ = 1$ so $y(0) = 2 + 3 = 5$, a high point, not the axis. $\sin 0^\circ = 0$ so $y(0) = 2 = C$: the sine graph starts *on* its axis.` }
        ],
        quiz: [
          function (rng) {
            const amp = rng.pick([1, 2, 3, 4, 5, 1.5, 2.5]);
            const C = rng.pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
            return { type: 'number', prompt: r`A sinusoid has maximum $` + M.fmt(C + amp) + '$ and minimum $' + M.fmt(C - amp) + r`$. Find $C$, the sinusoidal axis.`, answer: C, tol: 0.01, answerText: 'y = ' + M.fmt(C), explanation: r`$C = (\max + \min)/2 = (` + M.fmt(C + amp) + ' + (' + M.fmt(C - amp) + '))/2 = ' + M.fmt(C) + '$.' };
          },
          function (rng) {
            const A = rng.pick([1, 2, 3, 4, 5, -2, -3]);
            const C = rng.int(-5, 6);
            const fn = rng.pick(['sin', 'cos']);
            return {
              type: 'multi', prompt: r`For $y = ` + M.fmt(C) + (A < 0 ? ' - ' : ' + ') + (Math.abs(A) === 1 ? '' : Math.abs(A)) + '\\' + fn + r` x$, find the maximum and minimum values.`,
              fields: [{ label: 'maximum', answer: C + Math.abs(A), tol: 0.01 }, { label: 'minimum', answer: C - Math.abs(A), tol: 0.01 }],
              explanation: r`Max $= C + |A| = ` + M.fmt(C) + ' + ' + Math.abs(A) + ' = ' + M.fmt(C + Math.abs(A)) + r`$; min $= C - |A| = ` + M.fmt(C - Math.abs(A)) + '$.' + (A < 0 ? ' The negative $A$ flips the graph but not the max/min.' : '')
            };
          },
          function (rng) {
            const p = randomSinusoid(rng, { D: 0, B: rng.pick([1, 2]), C: rng.pick([-3, -2, -1, 1, 2, 3, 4]) });
            return {
              type: 'number', prompt: 'Read $C$ (the sinusoidal axis) from this graph.', graph: graphOf(Object.assign({}, p, { xStep: 90 })),
              answer: p.C, tol: 0.15, answerText: 'y = ' + M.fmt(p.C),
              explanation: r`Max $` + M.fmt(p.C + Math.abs(p.A)) + '$, min $' + M.fmt(p.C - Math.abs(p.A)) + r`$; average $= ` + M.fmt(p.C) + '$. The $x$-axis is **not** automatically the sinusoidal axis.'
            };
          },
          function (rng) {
            const A = rng.pick([2, 3, 4, 5]);
            const which = rng.pick(['min', 'max']);
            const C = rng.int(-4, 5);
            const val = which === 'min' ? C - A : C + A;
            return { type: 'number', prompt: r`$y = C + ` + A + r`\sin x$ has ` + which + r`imum value $` + M.fmt(val) + r`$. Find $C$.`, answer: C, tol: 0.01, answerText: M.fmt(C), explanation: (which === 'min' ? r`$\min = C - |A|$, so $C = ` + M.fmt(val) + ' + ' + A + ' = ' : r`$\max = C + |A|$, so $C = ` + M.fmt(val) + ' - ' + A + ' = ') + M.fmt(C) + '$.' };
          }
        ]
      },
      {
        id: '2-3-phase-shift', title: 'Phase shift / phase displacement (D)',
        notes: r`## Phase displacement

Replacing $x$ with $(x - D)$ slides the graph **horizontally** by $D$:

$$y = \cos(x - D)$$

- $x - 40^\circ$ → shift **right** $40^\circ$ ($D = 40^\circ$)
- $x + 40^\circ$ → shift **left** $40^\circ$ ($D = -40^\circ$)

Your book calls $D$ the [[phase displacement]]. The sign feels backwards, so anchor it to a point: the cosine parent has a high point at $x = 0$. After the shift, $y = \cos(x - D)$ has a high point where $x - D = 0$, i.e. at **$x = D$**.

> **For cosine with $A > 0$: $D$ is the $x$-coordinate of a high point.**
> **For sine with $A > 0$: $D$ is the $x$-coordinate of an axis-crossing where the graph is going up.**

## Many correct $D$ values

Because the graph repeats, $D$ and $D \pm \text{period}$ describe the **same** graph. Usually choose the $D$ closest to zero (or the smallest non-negative one), unless the problem says otherwise.

## When $B \ne 1$ — factor first!

In $y = \cos(2x - 60^\circ)$ the shift is **not** $60^\circ$. Factor out $B$: $\cos\big(2(x - 30^\circ)\big)$, so $D = 30^\circ$. This is exactly why the book insists on the form $B(x - D)$.

> **Common mistake:** reading $D$ from the unfactored form. Always write the argument as $B(x - D)$ first.`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 1, B: 1, C: 0, D: 45, sliders: ['B', 'D'], challenge: false, modeSwitch: false,
          show: { parent: true, axis: false, amplitude: false, period: true, critical: true },
          intro: 'Slide $D$ and watch the high point of the cosine travel. Then change $B$ and notice $D$ still marks the start of a cycle — the shift is in $x$-units, not "inside" units.',
          tasks: r`1. Set $D = 60^\circ$, $B = 1$. Where is the first high point? Where is the next?
2. Keep $D = 60^\circ$, set $B = 2$. Does the high point move? Read the equation — is it written as $2(x - 60^\circ)$? What would that be if you multiplied through?
3. Set $D = -30^\circ$. Which direction did the graph move? Find a positive $D$ giving the identical graph.
4. Switch to **sin**, $D = 90^\circ$. What familiar graph is this?`
        },
        practice: [
          { q: r`Describe the transformation from $y = \cos x$ to $y = \cos(x + 50^\circ)$, and give $D$.`, hint: 'Rewrite x + 50° as x − (something).', answer: r`Shift **left** $50^\circ$; $D = -50^\circ$`, solution: r`$x + 50^\circ = x - (-50^\circ)$, so $D = -50^\circ$. The high point that was at $0^\circ$ is now at $-50^\circ$.` },
          { q: r`Find the phase displacement of $y = \sin(3x - 120^\circ)$.`, hint: 'Factor out the 3.', answer: r`$D = 40^\circ$`, solution: r`$3x - 120^\circ = 3(x - 40^\circ)$. So $D = 40^\circ$, not $120^\circ$. (Period is $120^\circ$, a different number that happens to appear.)` },
          { q: r`Write an equation of the form $y = \cos(x - D)$ whose graph has a high point at $x = 200^\circ$.`, hint: 'For cosine, D is where the high point is.', answer: r`$y = \cos(x - 200^\circ)$ (also $y = \cos(x + 160^\circ)$)`, solution: r`High point at $x = D$ means $D = 200^\circ$. Subtracting a period gives $D = -160^\circ$: $y = \cos(x + 160^\circ)$ is the same graph.` },
          { q: r`$y = \cos(2(x - D))$ has a high point at $x = 70^\circ$. List **three** possible values of $D$.`, hint: 'Period is 180°. D and D ± period all work.', answer: r`$70^\circ$, $250^\circ$, $-110^\circ$ (any $70^\circ + 180^\circ n$)`, solution: r`With $B = 2$ the period is $180^\circ$. Every high point is a valid $D$ for a cosine, and high points occur every $180^\circ$: $\ldots, -110^\circ, 70^\circ, 250^\circ, \ldots$` }
        ],
        quiz: [
          function (rng) {
            const D = rng.pick([20, 30, 40, 45, 60, 75, 90, 120]);
            const sign = rng.sign();
            const C = rng.pick([0, 0, 1, 2, -1, -3]);
            const fn = rng.pick(['sin', 'cos']);
            const eqTex = 'y = ' + (C ? M.fmt(C) + ' + ' : '') + '\\' + fn + '(x ' + (sign < 0 ? '+ ' : '- ') + D + '^\\circ)';
            const dirs = [{ h: sign > 0 ? 'right' : 'left', v: C }, { h: sign > 0 ? 'left' : 'right', v: C }, { h: sign > 0 ? 'right' : 'left', v: -C }, { h: sign > 0 ? 'left' : 'right', v: -C }];
            const seen = new Set();
            const choices = [];
            dirs.forEach((d, i) => {
              const text = 'shift ' + d.h + ' $' + D + '^\\circ$' + (C ? (d.v > 0 ? ', up $' + Math.abs(d.v) + '$' : ', down $' + Math.abs(d.v) + '$') : '');
              if (!seen.has(text)) { seen.add(text); choices.push({ text, correct: i === 0 }); }
            });
            if (!C) choices.push({ text: 'shift ' + (sign > 0 ? 'right' : 'left') + ' $' + D + '^\\circ$ and reflect', correct: false });
            return { type: 'mc', prompt: 'How is the graph of $' + eqTex + '$ obtained from $y = \\' + fn + ' x$?', choices, explanation: r`$x ` + (sign < 0 ? '+' : '-') + ' ' + D + r`^\circ = x - (` + (sign * D) + r`^\circ)$, so $D = ` + (sign * D) + r`^\circ$: a shift **` + (sign > 0 ? 'right' : 'left') + '**. ' + (C ? 'The $' + M.fmt(C) + '$ added outside moves the axis to $y = ' + M.fmt(C) + '$.' : '') };
          },
          function (rng) {
            const B = rng.pick([2, 3, 4, 0.5]);
            const D = rng.pick([10, 15, 20, 30, 40, 45, 60]);
            const inner = B * D;
            const sign = rng.sign();
            const fn = rng.pick(['sin', 'cos']);
            return {
              type: 'number', prompt: r`Find the phase displacement $D$ of $y = ` + '\\' + fn + '(' + M.fmt(B) + 'x ' + (sign > 0 ? '- ' : '+ ') + M.fmt(inner) + r`^\circ)$.`,
              answer: sign * D, tol: 0.1, unit: '°', answerText: M.fmt(sign * D) + '°',
              explanation: r`Factor out $B = ` + M.fmt(B) + '$: $' + M.fmt(B) + 'x ' + (sign > 0 ? '-' : '+') + ' ' + M.fmt(inner) + r`^\circ = ` + M.fmt(B) + '(x ' + (sign > 0 ? '-' : '+') + ' ' + D + r`^\circ)$, so $D = ` + M.fmt(sign * D) + r`^\circ$. The $` + M.fmt(inner) + r`^\circ$ by itself is **not** the shift.`
            };
          },
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'cos', C: 0, B: rng.pick([1, 2]), D: rng.pick([30, 45, 60, 90, 120, 150]), A: rng.pick([1, 2, 3]) });
            const P = 360 / p.B;
            return {
              type: 'number', prompt: r`This is $y = A\cos\big(B(x - D)\big)$ with $A > 0$. Read $D$ from the graph (any correct $D$ is accepted).`, graph: graphOf(Object.assign({}, p, { xStep: 30 })),
              answer: p.D, modulo: P, tol: 2, unit: '°', answerText: p.D + '° (or ' + p.D + '° ± ' + P + '°n)',
              explanation: r`For cosine with $A > 0$, $D$ is the $x$-coordinate of a **high point**. High points are at $` + p.D + r`^\circ$ and every $` + P + r`^\circ$ after.`
            };
          },
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'sin', C: 0, B: 1, D: rng.pick([30, 60, 90, 120, 150, 180]), A: rng.pick([1, 2]) });
            return {
              type: 'number', prompt: r`This is $y = A\sin(x - D)$ with $A > 0$. Read $D$ (any correct $D$ is accepted).`, graph: graphOf(Object.assign({}, p, { xStep: 30 })),
              answer: p.D, modulo: 360, tol: 2, unit: '°', answerText: p.D + '° (or ' + p.D + '° ± 360°n)',
              explanation: r`For sine with $A > 0$, $D$ is where the graph crosses its axis **going up**. That's at $` + p.D + r`^\circ$ (the high point is a quarter-period later, at $` + (p.D + 90) + r`^\circ$).`
            };
          }
        ]
      }
    ]
  });

  // ======================= 2-4 =======================
  U.sections.push({
    id: '2-4', title: 'General sinusoidal graphs',
    topics: [
      {
        id: '2-4-general', title: 'General sinusoidal graphs: y = C + A cos(B(x − D))',
        notes: r`## The whole equation

$$y = C + A\cos\big(B(x - D)\big) \qquad\text{or}\qquad y = C + A\sin\big(B(x - D)\big)$$

| **Letter** | **Name** | **Graph meaning** | **How to find it** |
| --- | --- | --- | --- |
| $A$ | amplitude (vertical dilation) | half the height of the wave | $(\max - \min)/2$ |
| $B$ | — (horizontal dilation is $1/B$) | cycles per $360^\circ$ | $360^\circ / \text{period}$ |
| $C$ | sinusoidal axis (vertical translation) | the midline $y = C$ | $(\max + \min)/2$ |
| $D$ | phase displacement (horizontal translation) | where a cycle starts | cos: a high point's $x$; sin: an upward axis-crossing's $x$ |

## Equation → graph (sketching)

1. Draw the axis $y = C$ (dashed). Mark $C + |A|$ and $C - |A|$.
2. Compute the period $360^\circ / B$ and the quarter-period.
3. Start at $x = D$. For cosine (with $A > 0$) that's a **high** point. Step by quarter-periods: high → axis → low → axis → high.
4. Connect with a smooth curve; extend as needed.

## Graph → equation

1. $C = (\max + \min)/2$, $A = (\max - \min)/2$.
2. Period: high-to-high distance. $B = 360^\circ / \text{period}$.
3. Choose cosine (easiest): $D$ = the $x$ of any high point. Choose sine: $D$ = the $x$ of an upward crossing.
4. Write it. Check one point mentally.

> **Common mistake:** writing $B$ as the period, or writing the period in place of $B$. *Both* are wrong; $B \cdot \text{period} = 360^\circ$.

> **Common mistake:** forgetting the parentheses: $\cos(2x - 60^\circ)$ and $\cos(2(x - 60^\circ))$ are different graphs.

## Equivalent forms

The same graph has many correct equations: cosine or sine, $A$ positive or negative, $D$ differing by a period. If your equation reproduces the graph, it's right. (The explorer below checks *graphs*, not letters.)`,
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 2, B: 2, C: 1, D: 30, sliders: ['A', 'B', 'C', 'D'], challenge: true, modeSwitch: false,
          show: { parent: false, axis: true, amplitude: true, period: true, critical: true },
          intro: 'All four parameters. Use the sliders to build intuition, then scroll down to **Challenge mode** — it hides the equation and you write it from the graph.',
          tasks: r`1. Build $y = -1 + 3\cos(2(x - 45^\circ))$ with the sliders. Before you do: predict the max, min, period, and the first high point.
2. Make the identical graph using **sin** instead. What $D$ did you need?
3. Run **Challenge mode** at least five times. Any equivalent equation is accepted; look at the dashed overlay when you're wrong and diagnose *which letter* is off.`
        },
        practice: [
          { q: r`For $y = 3 + 2\cos\big(4(x - 15^\circ)\big)$, find the amplitude, period, sinusoidal axis, phase displacement, and the coordinates of the **first high point** with $x \ge 0^\circ$.`,
            hint: 'Read A, B, C, D directly, then period = 360/B. Cosine high point is at x = D.',
            answer: r`Amp $2$; period $90^\circ$; axis $y = 3$; $D = 15^\circ$; first high point $(15^\circ, 5)$`,
            solution: r`$A = 2$, $B = 4 \Rightarrow$ period $= 360^\circ/4 = 90^\circ$, $C = 3$, $D = 15^\circ$. Cosine with $A > 0$ is at a high point when $x = D$, so $(15^\circ, 3 + 2) = (15^\circ, 5)$.` },
          { q: r`Sketch $y = -1 + 3\sin\big(2(x + 30^\circ)\big)$ for one full cycle. List the five critical points.`,
            hint: 'D = −30°. Period 180°, so quarter-period 45°. Sine starts on its axis going up.',
            answer: r`$(-30^\circ, -1),\ (15^\circ, 2),\ (60^\circ, -1),\ (105^\circ, -4),\ (150^\circ, -1)$`,
            solution: r`$C = -1$, $A = 3$ (max $2$, min $-4$), period $= 180^\circ$, $D = -30^\circ$. Sine pattern: axis(up) → high → axis → low → axis, at $x = -30^\circ, 15^\circ, 60^\circ, 105^\circ, 150^\circ$.` },
          { q: r`A sinusoid has a high point at $(40^\circ, 7)$ and the next low point at $(100^\circ, -1)$. Write an equation using **cosine**.`,
            hint: 'High to next low is half a period.',
            answer: r`$y = 3 + 4\cos\big(3(x - 40^\circ)\big)$`,
            solution: r`$C = (7 + (-1))/2 = 3$, $A = (7 - (-1))/2 = 4$. Half-period $= 60^\circ$, so period $= 120^\circ$ and $B = 360^\circ/120^\circ = 3$. Cosine high point at $x = 40^\circ$, so $D = 40^\circ$.` },
          { q: r`Write the equation from the previous problem using **sine** instead.`,
            hint: 'A sine cycle (A > 0) starts at an upward axis-crossing, which is a quarter-period BEFORE the high point.',
            answer: r`$y = 3 + 4\sin\big(3(x - 10^\circ)\big)$`,
            solution: r`Quarter-period $= 30^\circ$. The upward axis-crossing is $30^\circ$ before the high point: $40^\circ - 30^\circ = 10^\circ$. So $D = 10^\circ$ for sine. Everything else is the same.` },
          { q: r`A sinusoid with $B = 2$ has a **low** point at $(50^\circ, 1)$ and axis $y = 4$. Write two different correct cosine equations.`,
            hint: 'Option 1: negative A with D at the low point. Option 2: positive A with D at a high point (half a period away).',
            answer: r`$y = 4 - 3\cos\big(2(x - 50^\circ)\big)$ or $y = 4 + 3\cos\big(2(x - 140^\circ)\big)$ (or $D = -40^\circ$)`,
            solution: r`Amplitude $= 4 - 1 = 3$. Period $180^\circ$. A cosine with $A = -3$ starts at a low point, so $D = 50^\circ$. Or keep $A = 3$ and put $D$ at a high point, which is half a period from the low: $50^\circ \pm 90^\circ = 140^\circ$ or $-40^\circ$.` },
          { q: r`Find the $y$-intercept of $y = 2 + 5\cos\big(3(x - 20^\circ)\big)$ to the nearest hundredth.`,
            hint: 'Plug in x = 0°. Degree mode!',
            answer: r`$y \approx 4.50$`,
            solution: r`$y = 2 + 5\cos(3(-20^\circ)) = 2 + 5\cos(-60^\circ) = 2 + 5(0.5) = 4.5$.` }
        ],
        quiz: [
          // equation → features
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'cos', A: rng.pick([1, 2, 3, 4, 5, 1.5, 2.5]), D: rng.pick([0, 10, 15, 20, 30, 45, 60, -20, -30]) });
            const P = 360 / p.B;
            return {
              type: 'multi', prompt: 'For $' + texEq('cos', p.A, p.B, p.C, p.D, 'deg') + '$, find:',
              fields: [
                { label: 'amplitude', answer: p.A, tol: 0.01 },
                { label: 'period (°)', answer: P, tol: 0.5 },
                { label: 'sinusoidal axis $y =$', answer: p.C, tol: 0.01 },
                { label: 'maximum value', answer: p.C + p.A, tol: 0.01 },
                { label: '$x$ of a high point (°)', answer: p.D, modulo: P, tol: 0.5, answerText: M.fmt(p.D) + '° (± ' + M.fmt(P) + '°n)' }
              ],
              explanation: r`$A = ` + M.fmt(p.A) + '$, $B = ' + M.fmt(p.B) + r` \Rightarrow$ period $360^\circ/` + M.fmt(p.B) + ' = ' + M.fmt(P) + r`^\circ$, $C = ` + M.fmt(p.C) + '$, $D = ' + M.fmt(p.D) + r`^\circ$ is a high point for cosine with $A>0$. Max $= C + A$.`
            };
          },
          // graph → equation
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'cos', A: rng.pick([1, 2, 3, 4, 1.5]), B: rng.pick([1, 2, 3, 0.5, 1.5]), D: rng.pick([0, 30, 45, 60, 90, 120, -30]) });
            const P = 360 / p.B;
            return {
              type: 'multi', prompt: r`Write this graph as $y = C + A\cos\big(B(x - D)\big)$ with $A > 0$.`, graph: graphOf(Object.assign({}, p, { xStep: 30, axis: false })),
              fields: [
                { label: '$A$', answer: p.A, tol: 0.1 },
                { label: '$B$', answer: p.B, tol: 0.02 },
                { label: '$C$', answer: p.C, tol: 0.1 },
                { label: '$D$ (°)', answer: p.D, modulo: P, tol: 2, answerText: M.fmt(p.D) + '° (± ' + M.fmt(P) + '°n)' }
              ],
              explanation: r`Max $` + M.fmt(p.C + p.A) + '$, min $' + M.fmt(p.C - p.A) + r`$ → $C = ` + M.fmt(p.C) + '$, $A = ' + M.fmt(p.A) + r`$. High-to-high distance $= ` + M.fmt(P) + r`^\circ$ → $B = 360^\circ/` + M.fmt(P) + r`^\circ = ` + M.fmt(p.B) + r`$. A high point is at $x = ` + M.fmt(p.D) + r`^\circ$ → $D$.`,
              explainGraph: function (c) { graphOf(Object.assign({}, p, { xStep: 30, axis: true }))(c); }
            };
          },
          // match description → equation (MC with classic distractors)
          function (rng) {
            const p = randomSinusoid(rng, { fn: 'cos', A: rng.pick([2, 3, 4, 5]), B: rng.pick([2, 3, 4, 6]), D: rng.pick([10, 15, 20, 30, 45, 60]), C: rng.pick([-3, -2, -1, 1, 2, 3, 4]) });
            const P = 360 / p.B;
            const good = texEq('cos', p.A, p.B, p.C, p.D, 'deg');
            const d1 = texEq('cos', p.A, P, p.C, p.D, 'deg');        // period used as B
            const d2 = texEq('cos', p.A, p.B, p.C, -p.D, 'deg');     // wrong sign D
            const d3 = 'y = ' + M.fmt(p.C) + ' + ' + M.fmt(p.A) + '\\cos(' + M.fmt(p.B) + 'x - ' + M.fmt(p.D) + '^\\circ)';  // unfactored
            const d4 = texEq('cos', p.C, p.B, p.A, p.D, 'deg');      // A and C swapped
            const distract = Array.from(new Set(rng.shuffle([d1, d2, d3, d4]).filter(d => d !== good))).slice(0, 3);
            return {
              type: 'mc',
              prompt: r`Which equation has amplitude $` + p.A + '$, period $' + M.fmt(P) + r`^\circ$, sinusoidal axis $y = ` + p.C + '$, and a high point at $x = ' + p.D + r`^\circ$?`,
              choices: [{ text: '$' + good + '$', correct: true }].concat(distract.map(d => ({ text: '$' + d + '$', correct: false }))),
              explanation: r`$B = 360^\circ/` + M.fmt(P) + ' = ' + M.fmt(p.B) + '$ (not the period itself). $D$ must appear as $(x - ' + p.D + r`^\circ)$ *inside* the factored form $B(x - D)$. $C$ is outside, $A$ multiplies the cosine.`
            };
          },
          // evaluate at a point
          function (rng) {
            const p = randomSinusoid(rng, { fn: rng.pick(['sin', 'cos']), A: rng.pick([2, 3, 4, 5]), B: rng.pick([1, 2, 3]), D: rng.pick([0, 10, 20, 30, 45, 60]), C: rng.int(-3, 4) });
            const x = rng.pick([0, 10, 25, 40, 50, 75, 100]);
            const y = Explore.makeFn(p.fn, p.A, p.B, p.C, p.D, 'deg')(x);
            return {
              type: 'number', prompt: 'Evaluate $' + texEq(p.fn, p.A, p.B, p.C, p.D, 'deg') + '$ at $x = ' + x + r`^\circ$. Round to the nearest hundredth.`,
              answer: y, tol: 0.02, answerText: M.fmt(y, 2),
              explanation: r`Inside first: $` + M.fmt(p.B) + '(' + x + r`^\circ - ` + M.fmt(p.D) + r`^\circ) = ` + M.fmt(p.B * (x - p.D)) + r`^\circ$. Then $` + '\\' + p.fn + '(' + M.fmt(p.B * (x - p.D)) + r`^\circ) = ` + M.fmt((p.fn === 'sin' ? Math.sin : Math.cos)(p.B * (x - p.D) * DEG), 4) + r`$. Multiply by $A$, add $C$: $` + M.fmt(y, 2) + '$. (Calculator in **degree** mode.)'
            };
          },
          // sine version: find D for sin given high point
          function (rng) {
            const B = rng.pick([1, 2, 3]);
            const P = 360 / B;
            const hx = rng.pick([30, 45, 60, 90, 120]);
            const D = hx - P / 4;
            return {
              type: 'number', prompt: r`A sinusoid with $B = ` + B + '$ has a high point at $x = ' + hx + r`^\circ$. If you write it as $y = C + A\sin\big(B(x - D)\big)$ with $A > 0$, what is $D$? (Any correct $D$ accepted.)`,
              answer: D, modulo: P, tol: 0.5, unit: '°', answerText: M.fmt(D) + '° (± ' + M.fmt(P) + '°n)',
              explanation: r`A sine cycle starts at an upward axis-crossing, a **quarter period before** the high point. Period $= ` + M.fmt(P) + r`^\circ$, quarter $= ` + M.fmt(P / 4) + r`^\circ$, so $D = ` + hx + ' - ' + M.fmt(P / 4) + ' = ' + M.fmt(D) + r`^\circ$.`
            };
          }
        ]
      }
    ]
  });

                // ---- sketch-and-check: place the high point, low point and axis of a sinusoid ----
                U.sections.find(s => s.id === '2-4').topics[0].quiz.push(function sketchSinusoid(rng) {
                  const fn = rng.pick(['sin', 'cos']);
                  const A = rng.pick([1, 1.5, 2, 3]), B = rng.pick([1, 2, 3]), C = rng.int(-2, 3), D = rng.pick([0, 15, 30, 45, 60, 90, -30, -45]);
                  const P = 360 / B;
                  const high = (((D + (fn === 'sin' ? P / 4 : 0)) % P) + P) % P;
                  const low = high + P / 2;
                  const xMax = Math.max(390, Math.ceil((low + 45) / 30) * 30);
                  return {
                    type: 'sketch',
                    prompt: '**Sketch** $' + texEq(fn, A, B, C, D, 'deg') + '$: place the first high point with $x \\ge 0^\\circ$, the next low point, and the sinusoidal axis.',
                    sketch: {
                      view: { xMin: -30, xMax, yMin: Math.floor(C - A - 1.5), yMax: Math.ceil(C + A + 1.5), xStep: 30, yStep: 1, xUnit: 'deg', yUnit: 'num' },
                      snapX: 15, snapY: 0.5,
                      targets: [
                        { label: 'First high point (x ≥ 0°)', kind: 'point', x: high, y: C + A },
                        { label: 'Next low point', kind: 'point', x: low, y: C - A },
                        { label: 'Sinusoidal axis', kind: 'hline', y: C }
                      ],
                      answerFns: [{ f: Explore.makeFn(fn, A, B, C, D, 'deg') }]
                    },
                    explanation: 'Axis $y = C = ' + C + '$; max $C + A = ' + M.fmt(C + A) + '$; min $' + M.fmt(C - A) + '$. Period $360^\\circ / ' + B + ' = ' + M.fmt(P) + '^\\circ$. ' + (fn === 'cos' ? 'Cosine peaks at $x = D$' : 'Sine peaks a quarter period after $D$') + ', then every period: first high at $' + M.fmt(high) + '^\\circ$. The low is half a period later, at $' + M.fmt(low) + '^\\circ$.'
                  };
                });
              })();
