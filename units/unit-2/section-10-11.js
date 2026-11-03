/* Unit 2 — sections 2-10 (inverse relations & their graphs) and 2-11 (evaluating cos⁻¹ / sin⁻¹: principal value + first three positive).
   Notation: always cos⁻¹ / sin⁻¹ (never arccos/arcsin). "Principal value" = the single calculator answer; "all values" = the general solution. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { PI, DEG } = window.U2;
  const r = String.raw;

  const NICE = [
    { v: 1, tex: '1' }, { v: Math.sqrt(3) / 2, tex: '\\tfrac{\\sqrt3}{2}' }, { v: Math.SQRT2 / 2, tex: '\\tfrac{\\sqrt2}{2}' }, { v: 0.5, tex: '\\tfrac12' }, { v: 0, tex: '0' },
    { v: -0.5, tex: '-\\tfrac12' }, { v: -Math.SQRT2 / 2, tex: '-\\tfrac{\\sqrt2}{2}' }, { v: -Math.sqrt(3) / 2, tex: '-\\tfrac{\\sqrt3}{2}' }, { v: -1, tex: '-1' }
  ];

  // All solutions to cos θ = v or sin θ = v, as the first `n` positive values in degrees.
  function firstPositive(fn, v, n) {
    const p = fn === 'cos' ? Math.acos(v) / DEG : Math.asin(v) / DEG;
    const seeds = fn === 'cos' ? [p, -p] : [p, 180 - p];
    const out = new Set();
    for (let k = -2; k <= 4; k++) seeds.forEach(s => { const t = M.round(s + 360 * k, 4); if (t > 1e-9) out.add(t); });
    return Array.from(out).sort((a, b) => a - b).slice(0, n);
  }

  // ======================= 2-10 =======================
  const s10 = { id: '2-10', title: 'Inverse circular relations', topics: [] };
  U.sections.push(s10);

  s10.topics.push({
    id: '2-10-arccos-relation', title: 'Inverse cosine relations (all values of cos⁻¹)',
    notes: r`## Principal value vs. all values

| **term** | **meaning** | **how many** |
| --- | --- | --- |
| principal value of $\cos^{-1}x$ | the one angle in $[0^\circ, 180^\circ]$ — what your calculator gives | one |
| all values of $\cos^{-1}x$ (the inverse cosine relation) | *every* angle whose cosine is $x$ | infinitely many |

Both use the same symbol, $\cos^{-1}$. The question tells you which one it wants: "evaluate" or "principal value" → one angle; "all values", "general solution", or "first three positive" → the whole list.

## The general solution

Cosine is **even** ($\cos(-\theta) = \cos\theta$) and repeats every $360^\circ$. So if the principal value is $\theta_0 = \cos^{-1}x$, every angle with that cosine is $\pm\theta_0$ plus full turns:

$$\theta = \pm\cos^{-1}x + 360^\circ n \qquad\text{or in radians}\qquad \theta = \pm\cos^{-1}x + 2\pi n$$

**Picture:** on the unit circle, two points share an $x$-coordinate — one above the axis, one below, mirror images. Those are $\theta_0$ and $-\theta_0$. Then spin.

Example: all values of $\cos^{-1}\tfrac12$ are $\pm 60^\circ + 360^\circ n$, i.e. $\ldots, -300^\circ, -60^\circ, 60^\circ, 300^\circ, 420^\circ, 660^\circ, \ldots$

## Why this matters

Solving $\cos\theta = x$ *is* finding all values of $\cos^{-1} x$. The 2-1 method (reference angle + quadrants) and this formula give the same answers; the formula just packages them. For word problems (2-12) you'll need "the next time the height is 10 m", which is a specific member of that list.

> **Common mistake:** writing only $\cos^{-1}x + 360^\circ n$. That misses half the solutions — the $-\cos^{-1}x$ family.`,
    explore: {
      type: 'custom',
      intro: 'A horizontal line $y = x_0$ cuts the cosine wave infinitely many times. Those crossings are **all values** of $\\cos^{-1} x_0$. The highlighted one in $[0^\\circ, 180^\\circ]$ is the **principal value**.',
      setup(container, L) { relationExplorer(container, L, 'cos'); },
      tasks: r`1. Set $x_0 = 0.5$. Identify $\cos^{-1}(0.5)$ and its mirror $-60^\circ$. Confirm every other crossing is one of those $\pm 360^\circ n$.
2. Set $x_0 = -0.5$. Now the principal value is $120^\circ$. List the crossings as $\pm 120^\circ + 360^\circ n$.
3. Set $x_0 = 1$. How does the list collapse? Write the general solution.`
    },
    practice: [
      { q: r`Write all values of $\cos^{-1}\!\big(\tfrac{\sqrt3}{2}\big)$ (the general solution) in degrees and in radians.`, hint: 'Principal value first, then ± and add turns.', answer: r`$\pm 30^\circ + 360^\circ n$; $\pm\tfrac{\pi}{6} + 2\pi n$`, solution: r`$\cos^{-1}\tfrac{\sqrt3}{2} = 30^\circ$. Cosine is even, so $-30^\circ$ also works. Add full turns.` },
      { q: r`Write all values of $\cos^{-1}(-0.4)$ in degrees, rounded to the nearest $0.01^\circ$, as a general solution.`, hint: 'Calculator for the principal value (should be in QII).', answer: r`$\pm 113.58^\circ + 360^\circ n$`, solution: r`$\cos^{-1}(-0.4) \approx 113.58^\circ$. General: $\pm 113.58^\circ + 360^\circ n$.` },
      { q: r`List all values of $\cos^{-1} 0$ between $-360^\circ$ and $360^\circ$.`, hint: 'Principal value 90°.', answer: r`$-270^\circ, -90^\circ, 90^\circ, 270^\circ$`, solution: r`$\pm 90^\circ + 360^\circ n$: $n = 0$ gives $\pm 90^\circ$; $n = 1$ gives $450^\circ$ (too big) and $270^\circ$; $n = -1$ gives $-270^\circ$ and $-450^\circ$ (too small).` },
      { q: r`Explain why "all values of $\cos^{-1} x$" is a relation, not a function, but the principal value $\cos^{-1}x$ is a function.`, hint: 'Vertical line test on the graph of x = cos y.', answer: r`All values assigns infinitely many angles to one input; a function may assign only one. The principal value picks the single angle in $[0^\circ, 180^\circ]$.`, solution: r`The graph of the relation is the cosine wave turned sideways ($x = \cos y$); any vertical line $x = x_0$ with $|x_0| \le 1$ hits it infinitely often. Restricting to $0 \le y \le \pi$ keeps exactly one hit.` }
    ],
    quiz: [
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const p = Math.acos(n.v) / DEG;
        const good = '$\\pm ' + M.fmt(p) + '^\\circ + 360^\\circ n$';
        const choices = [
          { text: good, correct: true },
          { text: '$' + M.fmt(p) + '^\\circ + 360^\\circ n$', correct: false },
          { text: '$' + M.fmt(p) + '^\\circ + 360^\\circ n$ or $' + M.fmt(180 - p) + '^\\circ + 360^\\circ n$', correct: false },
          { text: '$\\pm ' + M.fmt(p) + '^\\circ + 180^\\circ n$', correct: false }
        ];
        return { type: 'mc', prompt: 'Which gives **all values** of $\\cos^{-1}\\left(' + n.tex + '\\right)$ in degrees?', choices, explanation: r`Principal value $\cos^{-1}(` + n.tex + ') = ' + M.fmt(p) + r`^\circ$. Cosine is even, so $-` + M.fmt(p) + r`^\circ$ also works; the period is $360^\circ$, not $180^\circ$. The "$180^\circ - \theta$" pattern belongs to **sine**.` };
      },
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const lo = rng.pick([-360, 0]);
        const hi = lo + 720;
        const p = Math.acos(n.v) / DEG;
        const answers = [];
        for (let k = -3; k <= 3; k++) [p, -p].forEach(s => { const t = s + 360 * k; if (t >= lo && t < hi) answers.push(M.round(t, 4)); });
        answers.sort((a, b) => a - b);
        return { type: 'set', prompt: 'List **all** values of $\\cos^{-1}\\left(' + n.tex + '\\right)$ with $' + lo + '^\\circ \\le \\theta < ' + hi + '^\\circ$ (degrees, comma-separated).', answers, tol: 0.5, answerText: answers.map(a => a + '°').join(', '), explanation: r`$\pm ` + M.fmt(p) + r`^\circ + 360^\circ n$. Try $n = -1, 0, 1, 2$ and keep what falls in the window: ` + answers.map(a => a + '^\\circ').map(a => '$' + a + '$').join(', ') + '.' };
      },
      function (rng) {
        const k = rng.pick([0.2, 0.3, 0.45, 0.6, 0.75, 0.9, -0.2, -0.35, -0.5, -0.7, -0.85]);
        const p = Math.acos(k) / DEG;
        return { type: 'multi', prompt: 'For all values of $\\cos^{-1}(' + k + ')$, give the principal value and the **negative** value closest to zero (degrees, 2 decimals).', fields: [{ label: 'principal value (°)', answer: p, tol: 0.05, answerText: M.fmt(p, 2) + '°' }, { label: 'negative solution closest to 0 (°)', answer: -p, tol: 0.05, answerText: M.fmt(-p, 2) + '°' }], explanation: r`$\cos^{-1}(` + k + r`) \approx ` + M.fmt(p, 2) + r`^\circ$ (in $[0^\circ, 180^\circ]$). Its mirror image below the $x$-axis is $-` + M.fmt(p, 2) + r`^\circ$ — same cosine, since cosine is even.` };
      }
    ]
  });

  s10.topics.push({
    id: '2-10-arcsin-relation', title: 'Inverse sine relations (all values of sin⁻¹)',
    notes: r`## The general solution for sine

Same idea as cosine: the **principal value** $\theta_0 = \sin^{-1}x$ is one angle (in $[-90^\circ, 90^\circ]$); **all values** of $\sin^{-1}x$ is the full list.

Sine is **not** even — the two unit-circle points with the same $y$-coordinate are mirror images across the **$y$-axis**: $\theta_0$ and $180^\circ - \theta_0$. Then spin.

$$\theta = \sin^{-1}x + 360^\circ n \quad\text{or}\quad \theta = (180^\circ - \sin^{-1}x) + 360^\circ n$$

In radians: $\sin^{-1}x + 2\pi n$ or $(\pi - \sin^{-1}x) + 2\pi n$.

Example: the principal value of $\sin^{-1}\tfrac12$ is $30^\circ$, so all values are $30^\circ + 360^\circ n$ **or** $150^\circ + 360^\circ n$: $\ldots, -210^\circ, 30^\circ, 150^\circ, 390^\circ, 510^\circ, \ldots$

## With a negative input

Principal value $\sin^{-1}(-\tfrac{\sqrt2}{2}) = -45^\circ$. Then $180^\circ - (-45^\circ) = 225^\circ$. So all values are $-45^\circ + 360^\circ n$ or $225^\circ + 360^\circ n$: $\ldots, -135^\circ, -45^\circ, 225^\circ, 315^\circ, 585^\circ, \ldots$

Keep the negative principal value in the formula; don't "fix" it to $315^\circ$ before using $180^\circ - \theta$, or you'll get the wrong partner.

## Side-by-side

| **feature** | **all values of cos⁻¹ x** | **all values of sin⁻¹ x** |
| --- | --- | --- |
| principal value in | $[0^\circ, 180^\circ]$ | $[-90^\circ, 90^\circ]$ |
| partner angle | $-\theta_0$ (mirror across $x$-axis) | $180^\circ - \theta_0$ (mirror across $y$-axis) |
| general | $\pm\theta_0 + 360^\circ n$ | $\theta_0 + 360^\circ n$ or $180^\circ - \theta_0 + 360^\circ n$ |

> **Common mistake:** using $\pm$ for $\sin^{-1}$. $\sin(-\theta) = -\sin\theta$, so $-\theta_0$ has the *opposite* sine. The partner is $180^\circ - \theta_0$.`,
    explore: {
      type: 'custom',
      intro: 'Same idea for sine: the horizontal line $y = x_0$ cuts the sine wave at $\\theta_0$, $180^\\circ - \\theta_0$, and all their $360^\\circ$ shifts — **all values** of $\\sin^{-1}x_0$. The highlighted crossing in $[-90^\\circ, 90^\\circ]$ is the **principal value**.',
      setup(container, L) { relationExplorer(container, L, 'sin'); },
      tasks: r`1. Set $x_0 = 0.5$. Find $30^\circ$ and $150^\circ$. Check they're symmetric about the peak at $90^\circ$.
2. Set $x_0 = -0.7$. The principal value is negative. Where is its partner? Is it $180^\circ - (\text{negative})$, i.e. more than $180^\circ$?
3. Compare with the cosine explorer in the previous topic: for the same $x_0$, which crossings do the two share?`
    },
    practice: [
      { q: r`Write all values of $\sin^{-1}\!\big(\tfrac{\sqrt3}{2}\big)$ (the general solution) in degrees.`, hint: 'Principal 60°; partner 180° − 60°.', answer: r`$60^\circ + 360^\circ n$ or $120^\circ + 360^\circ n$`, solution: r`Principal value $\sin^{-1}\tfrac{\sqrt3}{2} = 60^\circ$; $180^\circ - 60^\circ = 120^\circ$. Add full turns to each.` },
      { q: r`Write all values of $\sin^{-1}(-\tfrac12)$ in radians.`, hint: 'Principal value is negative. Partner is π minus that.', answer: r`$-\tfrac{\pi}{6} + 2\pi n$ or $\tfrac{7\pi}{6} + 2\pi n$`, solution: r`Principal value $\sin^{-1}(-\tfrac12) = -\tfrac{\pi}{6}$. Partner: $\pi - (-\tfrac{\pi}{6}) = \tfrac{7\pi}{6}$.` },
      { q: r`List all values of $\sin^{-1}(0.8)$ between $-360^\circ$ and $360^\circ$, to the nearest $0.1^\circ$.`, hint: 'Principal ≈ 53.1°.', answer: r`$-306.9^\circ, -233.1^\circ, 53.1^\circ, 126.9^\circ$`, solution: r`$\sin^{-1}0.8 \approx 53.13^\circ$; partner $126.87^\circ$. Subtract $360^\circ$ from each for the negative ones: $-306.87^\circ$ and $-233.13^\circ$.` },
      { q: r`A student writes "all values of $\sin^{-1}(0.3)$ are $\pm 17.46^\circ + 360^\circ n$." Find the error and fix it.`, hint: 'What is sin(−17.46°)?', answer: r`$\sin(-17.46^\circ) = -0.3$, not $0.3$. Correct: $17.46^\circ + 360^\circ n$ or $162.54^\circ + 360^\circ n$.`, solution: r`The $\pm$ rule is for cosine (even). Sine's partner is $180^\circ - \theta_0 = 162.54^\circ$.` }
    ],
    quiz: [
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const p = Math.asin(n.v) / DEG;
        const good = '$' + M.fmt(p) + '^\\circ + 360^\\circ n$ or $' + M.fmt(180 - p) + '^\\circ + 360^\\circ n$';
        const choices = [
          { text: good, correct: true },
          { text: '$\\pm ' + M.fmt(p) + '^\\circ + 360^\\circ n$', correct: false },
          { text: '$' + M.fmt(p) + '^\\circ + 360^\\circ n$', correct: false },
          { text: '$' + M.fmt(p) + '^\\circ + 180^\\circ n$', correct: false }
        ];
        return { type: 'mc', prompt: 'Which gives **all values** of $\\sin^{-1}\\left(' + n.tex + '\\right)$ in degrees?', choices, explanation: r`Principal value $\sin^{-1}(` + n.tex + ') = ' + M.fmt(p) + r`^\circ$. Partner: $180^\circ - ` + M.fmt(p) + '^\\circ = ' + M.fmt(180 - p) + r`^\circ$. Period $360^\circ$. The $\pm$ form is for cosine.` };
      },
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const lo = rng.pick([-360, 0]);
        const hi = lo + 720;
        const p = Math.asin(n.v) / DEG;
        const answers = [];
        for (let k = -3; k <= 3; k++) [p, 180 - p].forEach(s => { const t = s + 360 * k; if (t >= lo && t < hi) answers.push(M.round(t, 4)); });
        answers.sort((a, b) => a - b);
        return { type: 'set', prompt: 'List **all** values of $\\sin^{-1}\\left(' + n.tex + '\\right)$ with $' + lo + '^\\circ \\le \\theta < ' + hi + '^\\circ$ (degrees, comma-separated).', answers, tol: 0.5, answerText: answers.map(a => a + '°').join(', '), explanation: r`Families $` + M.fmt(p) + r`^\circ + 360^\circ n$ and $` + M.fmt(180 - p) + r`^\circ + 360^\circ n$. Pick the $n$ values that land in the window: ` + answers.map(a => '$' + a + '^\\circ$').join(', ') + '.' };
      },
      function (rng) {
        const k = rng.pick([0.2, 0.3, 0.45, 0.6, 0.75, 0.9, -0.2, -0.35, -0.5, -0.7, -0.85]);
        const p = Math.asin(k) / DEG;
        return { type: 'multi', prompt: 'For all values of $\\sin^{-1}(' + k + ')$, give the principal value and its partner $180^\\circ - \\sin^{-1}(' + k + ')$ (degrees, 2 decimals).', fields: [{ label: 'principal value (°)', answer: p, tol: 0.05, answerText: M.fmt(p, 2) + '°' }, { label: 'partner (°)', answer: 180 - p, tol: 0.05, answerText: M.fmt(180 - p, 2) + '°' }], explanation: r`$\sin^{-1}(` + k + r`) \approx ` + M.fmt(p, 2) + r`^\circ$. Partner $= 180^\circ - (` + M.fmt(p, 2) + '^\\circ) = ' + M.fmt(180 - p, 2) + r`^\circ$.` + (k < 0 ? ' With a negative principal value the partner comes out **greater than $180^\\circ$** — that\'s correct (QIII).' : '') };
      }
    ]
  });

  s10.topics.push({
    id: '2-10-arccos-graph', title: 'The graph of y = cos⁻¹ x (and the full inverse cosine relation)',
    notes: r`## Build it by reflection

Take $y = \cos x$ on $0 \le x \le \pi$ and swap coordinates:

| **on $\cos$** | $(0, 1)$ | $(\tfrac{\pi}{3}, \tfrac12)$ | $(\tfrac{\pi}{2}, 0)$ | $(\tfrac{2\pi}{3}, -\tfrac12)$ | $(\pi, -1)$ |
| --- | --- | --- | --- | --- | --- |
| **on $\cos^{-1}$** | $(1, 0)$ | $(\tfrac12, \tfrac{\pi}{3})$ | $(0, \tfrac{\pi}{2})$ | $(-\tfrac12, \tfrac{2\pi}{3})$ | $(-1, \pi)$ |

Result: a **decreasing** S-curve from $(-1, \pi)$ down to $(1, 0)$, passing through $(0, \tfrac{\pi}{2})$. It's steep near the ends ($x = \pm 1$) and gentlest in the middle.

- Domain $[-1, 1]$, range $[0, \pi]$
- $y$-intercept $\tfrac{\pi}{2}$ ($= 90^\circ$); $x$-intercept $1$
- Symmetric about the point $(0, \tfrac{\pi}{2})$ — that's the graph form of $\cos^{-1}(-x) = \pi - \cos^{-1}x$

## The whole relation $x = \cos y$

Keep reflecting the *entire* cosine wave and you get a wave running **up the $y$-axis**: it oscillates between $x = -1$ and $x = 1$ forever. The function $\cos^{-1}$ is the single piece from $y = 0$ to $y = \pi$. Every other piece is a copy shifted by $2\pi$ up or down, or a mirror image across $y = 0$ — exactly the $\pm\cos^{-1}x + 2\pi n$ formula drawn out.

> **Common mistake:** sketching $\cos^{-1}$ increasing. Cosine *decreases* on $[0, \pi]$, so its inverse decreases too.`,
    explore: {
      type: 'inverse', fn: 'cos', mode: 'rad', relation: true,
      intro: 'The dashed vertical wave is the full relation $x = \\cos y$. The solid curve is the function $y = \\cos^{-1}x$ — one piece of the wave. Toggle the relation off and on to see which piece.',
      tasks: r`1. Turn the relation off. Read the three labeled points. Verify each by taking cosine of the $y$-value.
2. Turn the relation on. Pick $x = 0.5$ and name the $y$-values of the four nearest relation points. Match them to $\pm\tfrac{\pi}{3} + 2\pi n$.
3. Switch to **degrees**. Where is the $y$-intercept? Where does the graph hit $y = 180^\circ$?`
    },
    practice: [
      { q: r`Sketch $y = \cos^{-1}x$. Label the endpoints and the $y$-intercept (radians).`, hint: 'Reflect cos on [0, π].', answer: r`Endpoints $(-1, \pi)$ and $(1, 0)$; $y$-intercept $(0, \tfrac{\pi}{2})$; decreasing.`, solution: r`Swap the coordinates of $(0,1)$, $(\tfrac{\pi}{2}, 0)$, $(\pi, -1)$ from the cosine graph.` },
      { q: r`On the graph of the relation $x = \cos y$, list the $y$-values of all points with $x = -\tfrac{\sqrt3}{2}$ and $-2\pi \le y \le 2\pi$.`, hint: '±(5π/6) + 2πn.', answer: r`$-\tfrac{7\pi}{6}, -\tfrac{5\pi}{6}, \tfrac{5\pi}{6}, \tfrac{7\pi}{6}$`, solution: r`$\cos^{-1}(-\tfrac{\sqrt3}{2}) = \tfrac{5\pi}{6}$. Relation: $\pm\tfrac{5\pi}{6} + 2\pi n$. In range: $\pm\tfrac{5\pi}{6}$, and $\tfrac{5\pi}{6} - 2\pi = -\tfrac{7\pi}{6}$, $-\tfrac{5\pi}{6} + 2\pi = \tfrac{7\pi}{6}$.` },
      { q: r`Describe the graph of $y = 2\cos^{-1}(x) - \pi$: domain, range, and intercepts.`, hint: 'Vertical stretch by 2, then shift down π.', answer: r`Domain $[-1, 1]$; range $[-\pi, \pi]$; $y$-intercept $0$; $x$-intercept $0$.`, solution: r`Range of $\cos^{-1}$ is $[0, \pi]$; doubled, $[0, 2\pi]$; shifted down $\pi$, $[-\pi, \pi]$. At $x = 0$: $2(\tfrac{\pi}{2}) - \pi = 0$.` },
      { q: r`Is the point $(0.5, -\tfrac{\pi}{3})$ on the graph of $y = \cos^{-1}x$? Is it on the graph of the relation $x = \cos y$?`, hint: 'Check the range for the function; check cos(−π/3) for the relation.', answer: 'Not on the function (range is $[0, \pi]$); yes on the relation ($\cos(-\tfrac{\pi}{3}) = \tfrac12$).', solution: r`$\cos(-\tfrac{\pi}{3}) = \tfrac12$ ✓ so it satisfies $x = \cos y$. But $-\tfrac{\pi}{3} < 0$, outside the function's range.` }
    ],
    quiz: [
      function (rng) {
        const pts = [[-1, PI], [-Math.sqrt(3) / 2, 5 * PI / 6], [-Math.SQRT2 / 2, 3 * PI / 4], [-0.5, 2 * PI / 3], [0, PI / 2], [0.5, PI / 3], [Math.SQRT2 / 2, PI / 4], [Math.sqrt(3) / 2, PI / 6], [1, 0]];
        const [x, y] = rng.pick(pts);
        return { type: 'number', parse: 'pi', prompt: 'The point $\\left(' + M.formatExact(x, true) + ',\\ y\\right)$ is on the graph of $y = \\cos^{-1}x$. Find $y$ (exact radians).', answer: y, tol: 0.005, answerText: M.formatPi(y), explanation: r`$y = \cos^{-1}(` + M.formatExact(x, true) + ')$: the angle in $[0, \\pi]$ whose cosine is $' + M.formatExact(x, true) + '$ is $' + M.texPi(y) + '$.' };
      },
      function (rng) {
        const items = [
          { t: 'The graph of $y = \\cos^{-1}x$ is increasing.', ok: false, why: 'Cosine decreases on $[0, \\pi]$, so its inverse decreases.' },
          { t: 'The $y$-intercept of $y = \\cos^{-1}x$ is $\\tfrac{\\pi}{2}$.', ok: true, why: '$\\cos^{-1}(0) = \\tfrac{\\pi}{2}$.' },
          { t: 'The graph of $y = \\cos^{-1}x$ has a horizontal asymptote.', ok: false, why: 'It is a finite curve from $(-1, \\pi)$ to $(1, 0)$ — no asymptotes.' },
          { t: 'The relation $x = \\cos y$ passes the vertical line test.', ok: false, why: 'Any vertical line $x = x_0$ with $|x_0| \\le 1$ hits it infinitely many times.' },
          { t: 'The range of $y = \\cos^{-1}x$ is $[0, \\pi]$.', ok: true, why: 'It is the restricted domain of cosine, swapped.' },
          { t: 'The point $(-1, -\\pi)$ is on $y = \\cos^{-1}x$.', ok: false, why: '$\\cos(-\\pi) = -1$, so it is on the relation, but $-\\pi$ is outside the function\'s range $[0, \\pi]$.' },
          { t: 'The graph of $y = \\cos^{-1}x$ is symmetric about the point $(0, \\tfrac{\\pi}{2})$.', ok: true, why: 'That is the graph form of $\\cos^{-1}(-x) = \\pi - \\cos^{-1}x$.' }
        ];
        const it = rng.pick(items);
        return { type: 'mc', prompt: 'True or false: ' + it.t, choices: [{ text: 'True', correct: it.ok }, { text: 'False', correct: !it.ok }], explanation: it.why };
      },
      function (rng) {
        const x = rng.pick([0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2, 0]);
        const p = Math.acos(x);
        const lo = -2 * PI, hi = 2 * PI;
        const answers = [];
        for (let k = -2; k <= 2; k++) [p, -p].forEach(s => { const t = s + 2 * PI * k; if (t >= lo - 1e-9 && t <= hi + 1e-9) answers.push(t); });
        const uniq = Array.from(new Set(answers.map(a => M.round(a, 6)))).sort((a, b) => a - b);
        return { type: 'set', parse: 'pi', prompt: 'On the graph of the relation $x = \\cos y$, list every $y$ with $x = ' + M.formatExact(x, true) + '$ and $-2\\pi \\le y \\le 2\\pi$. (Exact, comma-separated, like `-pi/3, pi/3`.)', answers: uniq, tol: 0.01, answerText: uniq.map(a => M.formatPi(a)).join(', '), explanation: r`$\cos^{-1}(` + M.formatExact(x, true) + ') = ' + M.texPi(p) + r`$. Relation: $\pm ` + M.texPi(p) + r` + 2\pi n$. Keep those within $[-2\pi, 2\pi]$: ` + uniq.map(a => '$' + M.texPi(a) + '$').join(', ') + '.' };
      }
    ]
  });

  s10.topics.push({
    id: '2-10-arcsin-graph', title: 'The graph of y = sin⁻¹ x (and the full inverse sine relation)',
    notes: r`## Build it by reflection

Take $y = \sin x$ on $-\tfrac{\pi}{2} \le x \le \tfrac{\pi}{2}$ and swap coordinates:

| **on $\sin$** | $(-\tfrac{\pi}{2}, -1)$ | $(-\tfrac{\pi}{6}, -\tfrac12)$ | $(0, 0)$ | $(\tfrac{\pi}{6}, \tfrac12)$ | $(\tfrac{\pi}{2}, 1)$ |
| --- | --- | --- | --- | --- | --- |
| **on $\sin^{-1}$** | $(-1, -\tfrac{\pi}{2})$ | $(-\tfrac12, -\tfrac{\pi}{6})$ | $(0, 0)$ | $(\tfrac12, \tfrac{\pi}{6})$ | $(1, \tfrac{\pi}{2})$ |

Result: an **increasing** S-curve through the origin from $(-1, -\tfrac{\pi}{2})$ to $(1, \tfrac{\pi}{2})$.

- Domain $[-1, 1]$, range $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$
- Passes through the origin; **odd** (symmetric about the origin): $\sin^{-1}(-x) = -\sin^{-1}x$
- Steep near $x = \pm 1$ (because sine is flat at its peaks, the reflection is steep there)

## The whole relation $x = \sin y$

A vertical wave between $x = -1$ and $x = 1$. The function piece runs from $y = -\tfrac{\pi}{2}$ to $\tfrac{\pi}{2}$; the next piece ($\tfrac{\pi}{2}$ to $\tfrac{3\pi}{2}$) is its mirror image across $y = \tfrac{\pi}{2}$ — that's the "$\pi - \theta_0$" family. Then everything repeats every $2\pi$.

## $\sin^{-1}$ vs. $\cos^{-1}$ graphs

Same S-shape, same domain, same steepness at the ends. $\cos^{-1}$ is $\sin^{-1}$ **flipped vertically and raised by $\tfrac{\pi}{2}$**: $\cos^{-1}x = \tfrac{\pi}{2} - \sin^{-1}x$. One increases, one decreases.

> **Common mistake:** drawing $\sin^{-1}$ from $(-1, 0)$ to $(1, \pi)$ — that's $\cos^{-1}$ reflected. $\sin^{-1}$ goes through the origin and takes negative values for negative $x$.`,
    explore: {
      type: 'inverse', fn: 'sin', mode: 'rad', relation: true,
      intro: 'Full relation $x = \\sin y$ (dashed) with the function $y = \\sin^{-1}x$ (solid). Switch to **cos** and back to compare the two function pieces.',
      tasks: r`1. Relation off: check the three labeled points by taking sine of each $y$.
2. Relation on: at $x = 0.5$, the function gives $\tfrac{\pi}{6}$. Which relation points are nearest above and below? Match them to $\tfrac{5\pi}{6}$ and $-\tfrac{7\pi}{6}$.
3. Compare $\sin^{-1}$ and $\cos^{-1}$ at the same $x$. Confirm their $y$-values add to $\tfrac{\pi}{2}$ at $x = 0$, $0.5$, and $-0.5$.`
    },
    practice: [
      { q: r`Sketch $y = \sin^{-1}x$. Label the endpoints and the origin. State domain and range.`, hint: 'Reflect sine on [−π/2, π/2].', answer: r`From $(-1, -\tfrac{\pi}{2})$ through $(0, 0)$ to $(1, \tfrac{\pi}{2})$, increasing. Domain $[-1, 1]$, range $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$.`, solution: r`Swap coordinates of $(-\tfrac{\pi}{2}, -1)$, $(0, 0)$, $(\tfrac{\pi}{2}, 1)$.` },
      { q: r`On the relation $x = \sin y$, list all $y$ with $x = \tfrac12$ and $-2\pi \le y \le 2\pi$.`, hint: 'π/6 + 2πn or 5π/6 + 2πn.', answer: r`$-\tfrac{11\pi}{6}, -\tfrac{7\pi}{6}, \tfrac{\pi}{6}, \tfrac{5\pi}{6}$`, solution: r`Families $\tfrac{\pi}{6} + 2\pi n$ and $\tfrac{5\pi}{6} + 2\pi n$. $n = 0$: $\tfrac{\pi}{6}, \tfrac{5\pi}{6}$. $n = -1$: $-\tfrac{11\pi}{6}, -\tfrac{7\pi}{6}$. $n = 1$ exceeds $2\pi$.` },
      { q: r`Describe $y = \sin^{-1}(x) + \tfrac{\pi}{2}$: range and intercepts. Which other inverse-trig graph does it resemble?`, hint: 'Shift up π/2.', answer: r`Range $[0, \pi]$; $y$-intercept $\tfrac{\pi}{2}$; $x$-intercept $-1$. Same range as $\cos^{-1}$, but **increasing** — it's $\cos^{-1}$ flipped left-right.`, solution: r`Shifting the range $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ up by $\tfrac{\pi}{2}$ gives $[0, \pi]$. At $x = -1$: $-\tfrac{\pi}{2} + \tfrac{\pi}{2} = 0$. In fact $\sin^{-1}x + \tfrac{\pi}{2} = \cos^{-1}(-x)$.` },
      { q: r`Why is the graph of $y = \sin^{-1}x$ nearly vertical at $x = 1$?`, hint: 'What does the sine graph look like near x = π/2?', answer: r`Near $\tfrac{\pi}{2}$, sine is almost flat (slope ≈ 0). Reflecting a nearly-horizontal piece across $y = x$ gives a nearly-vertical piece.`, solution: r`Slopes of inverses are reciprocals. Sine's slope at $\tfrac{\pi}{2}$ is $0$, so $\sin^{-1}$'s slope at $x = 1$ is "infinite" — a vertical tangent.` }
    ],
    quiz: [
      function (rng) {
        const pts = [[-1, -PI / 2], [-Math.sqrt(3) / 2, -PI / 3], [-Math.SQRT2 / 2, -PI / 4], [-0.5, -PI / 6], [0, 0], [0.5, PI / 6], [Math.SQRT2 / 2, PI / 4], [Math.sqrt(3) / 2, PI / 3], [1, PI / 2]];
        const [x, y] = rng.pick(pts);
        return { type: 'number', parse: 'pi', prompt: 'The point $\\left(' + M.formatExact(x, true) + ',\\ y\\right)$ is on the graph of $y = \\sin^{-1}x$. Find $y$ (exact radians).', answer: y, tol: 0.005, answerText: M.formatPi(y), explanation: r`$y = \sin^{-1}(` + M.formatExact(x, true) + ')$: the angle in $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$ with that sine is $' + M.texPi(y) + '$.' + (x < 0 ? ' Negative input → negative output; the graph goes through the origin.' : '') };
      },
      function (rng) {
        const items = [
          { t: 'The graph of $y = \\sin^{-1}x$ passes through the origin.', ok: true, why: '$\\sin^{-1}(0) = 0$.' },
          { t: 'The graph of $y = \\sin^{-1}x$ is decreasing.', ok: false, why: 'Sine increases on $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$, so its inverse increases.' },
          { t: 'The range of $y = \\sin^{-1}x$ is $[0, \\pi]$.', ok: false, why: 'That is $\\cos^{-1}$. Inverse sine has range $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$.' },
          { t: '$y = \\sin^{-1}x$ is an odd function.', ok: true, why: '$\\sin^{-1}(-x) = -\\sin^{-1}x$; the graph has point symmetry about the origin.' },
          { t: 'The point $(\\tfrac12, \\tfrac{5\\pi}{6})$ is on $y = \\sin^{-1}x$.', ok: false, why: '$\\sin\\tfrac{5\\pi}{6} = \\tfrac12$ so it is on the **relation**, but $\\tfrac{5\\pi}{6} > \\tfrac{\\pi}{2}$ — outside the function\'s range.' },
          { t: 'The graphs of $y = \\sin^{-1}x$ and $y = \\cos^{-1}x$ intersect at $x = \\tfrac{\\sqrt2}{2}$.', ok: true, why: 'Both equal $\\tfrac{\\pi}{4}$ there (the only place where $\\sin^{-1}x = \\cos^{-1}x$).' }
        ];
        const it = rng.pick(items);
        return { type: 'mc', prompt: 'True or false: ' + it.t, choices: [{ text: 'True', correct: it.ok }, { text: 'False', correct: !it.ok }], explanation: it.why };
      },
      function (rng) {
        const x = rng.pick([0.5, -0.5, Math.SQRT2 / 2, -Math.SQRT2 / 2, Math.sqrt(3) / 2, -Math.sqrt(3) / 2]);
        const p = Math.asin(x);
        const answers = [];
        for (let k = -2; k <= 2; k++) [p, PI - p].forEach(s => { const t = s + 2 * PI * k; if (t >= -2 * PI - 1e-9 && t <= 2 * PI + 1e-9) answers.push(t); });
        const uniq = Array.from(new Set(answers.map(a => M.round(a, 6)))).sort((a, b) => a - b);
        return { type: 'set', parse: 'pi', prompt: 'On the relation $x = \\sin y$, list every $y$ with $x = ' + M.formatExact(x, true) + '$ and $-2\\pi \\le y \\le 2\\pi$. (Exact, comma-separated.)', answers: uniq, tol: 0.01, answerText: uniq.map(a => M.formatPi(a)).join(', '), explanation: r`$\sin^{-1}(` + M.formatExact(x, true) + ') = ' + M.texPi(p) + r`$; partner $\pi - ` + M.texPi(p) + ' = ' + M.texPi(PI - p) + r`$. Add $2\pi n$ and keep what's in range: ` + uniq.map(a => '$' + M.texPi(a) + '$').join(', ') + '.' };
      }
    ]
  });

  // ======================= 2-11 =======================
  const s11 = { id: '2-11', title: 'Evaluating inverse relations', topics: [] };
  U.sections.push(s11);

  function evalNotes(fn) {
    const isCos = fn === 'cos';
    return r`## The routine

Asked for "$` + '\\' + fn + r`^{-1} x$: the principal value and the first three positive values":

1. **Principal value** $\theta_0 = ` + '\\' + fn + r`^{-1}x$ — calculator or exact-value table. ` + (isCos ? r`It's in $[0^\circ, 180^\circ]$.` : r`It's in $[-90^\circ, 90^\circ]$ (negative if $x < 0$).`) + r`
2. **Partner** ` + (isCos ? r`$= -\theta_0$ (cosine is even).` : r`$= 180^\circ - \theta_0$ (sine is symmetric about $90^\circ$).`) + r`
3. **Spin:** add $360^\circ$ to each until you've collected three values $> 0$, then sort.

## Worked example` + (isCos ? r`: $\cos^{-1}(-0.6)$

1. $\cos^{-1}(-0.6) \approx 126.87^\circ$ ← principal value
2. Partner $-126.87^\circ$
3. Families: $126.87^\circ, 486.87^\circ, 846.87^\circ, \ldots$ and $-126.87^\circ, 233.13^\circ, 593.13^\circ, \ldots$

First three positive, sorted: $\mathbf{126.87^\circ,\ 233.13^\circ,\ 486.87^\circ}$.

Notice the pattern: $233.13^\circ = 360^\circ - 126.87^\circ$. For cosine, the positive values always come in pairs $\theta_0 + 360^\circ k$ and $360^\circ k - \theta_0$, mirror images around each multiple of $360^\circ$.` : r`: $\sin^{-1}(-0.6)$

1. $\sin^{-1}(-0.6) \approx -36.87^\circ$ ← principal value (negative!)
2. Partner $180^\circ - (-36.87^\circ) = 216.87^\circ$
3. Families: $-36.87^\circ, 323.13^\circ, 683.13^\circ, \ldots$ and $216.87^\circ, 576.87^\circ, \ldots$

First three positive, sorted: $\mathbf{216.87^\circ,\ 323.13^\circ,\ 576.87^\circ}$.

The principal value itself is *not* one of the positive answers here — that's normal when $x < 0$.`) + r`

## Exact-value version

$` + '\\' + fn + r`^{-1}\!\big(` + (isCos ? r`-\tfrac12\big)$: $\theta_0 = 120^\circ$, partner $-120^\circ$. Positive values: $120^\circ, 240^\circ, 480^\circ, 600^\circ, \ldots$ → first three: $120^\circ, 240^\circ, 480^\circ$.` : r`\tfrac{\sqrt2}{2}\big)$: $\theta_0 = 45^\circ$, partner $135^\circ$. Positive values: $45^\circ, 135^\circ, 405^\circ, 495^\circ, \ldots$ → first three: $45^\circ, 135^\circ, 405^\circ$.`) + r`

In radians, replace $360^\circ$ by $2\pi$ and $180^\circ$ by $\pi$.

> **Common mistake:** listing $\theta_0$, $\theta_0 + 360^\circ$, $\theta_0 + 720^\circ$ — only one family. The partner family supplies every other answer.` + (isCos ? '' : r`

> **Common mistake:** for a negative $x$, "fixing" the principal value to $323.13^\circ$ *before* computing the partner. $180^\circ - 323.13^\circ = -143.13^\circ$ is wrong. Use the real principal value, $-36.87^\circ$.`);
  }

  function evalGenerators(fn) {
    const isCos = fn === 'cos';
    return [
      // exact, degrees
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const p = (isCos ? Math.acos(n.v) : Math.asin(n.v)) / DEG;
        const first3 = firstPositive(fn, n.v, 3);
        return {
          type: 'multi', prompt: 'For $\\' + fn + '^{-1}\\left(' + n.tex + '\\right)$ give the principal value and the first three **positive** values (degrees).',
          fields: [{ label: 'principal value $\\' + fn + '^{-1}$ (°)', answer: p, tol: 0.5, answerText: M.fmt(p) + '°' }, { label: '1st positive (°)', answer: first3[0], tol: 0.5, answerText: M.fmt(first3[0]) + '°' }, { label: '2nd positive (°)', answer: first3[1], tol: 0.5, answerText: M.fmt(first3[1]) + '°' }, { label: '3rd positive (°)', answer: first3[2], tol: 0.5, answerText: M.fmt(first3[2]) + '°' }],
          explanation: explain(fn, n.tex, p, first3)
        };
      },
      // calculator, degrees
      function (rng) {
        const k = rng.pick([0.2, 0.3, 0.45, 0.55, 0.65, 0.8, 0.9, -0.25, -0.4, -0.6, -0.75, -0.9]);
        const p = (isCos ? Math.acos(k) : Math.asin(k)) / DEG;
        const first3 = firstPositive(fn, k, 3);
        return {
          type: 'multi', prompt: 'For $\\' + fn + '^{-1}(' + k + ')$ give the principal value and the first three **positive** values, to the nearest $0.01^\\circ$.',
          fields: [{ label: 'principal value (°)', answer: p, tol: 0.05, answerText: M.fmt(p, 2) + '°' }, { label: '1st positive (°)', answer: first3[0], tol: 0.05, answerText: M.fmt(first3[0], 2) + '°' }, { label: '2nd positive (°)', answer: first3[1], tol: 0.05, answerText: M.fmt(first3[1], 2) + '°' }, { label: '3rd positive (°)', answer: first3[2], tol: 0.05, answerText: M.fmt(first3[2], 2) + '°' }],
          explanation: explain(fn, String(k), p, first3)
        };
      },
      // exact, radians: principal + first 3 positive as a set
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const first3 = firstPositive(fn, n.v, 3).map(d => d * DEG);
        return {
          type: 'set', parse: 'pi', prompt: 'List the first three **positive** values of $\\' + fn + '^{-1}\\left(' + n.tex + '\\right)$ in **radians**, exact, comma-separated (e.g. `pi/3, 5pi/3, 7pi/3`).',
          answers: first3, tol: 0.01, answerText: first3.map(a => M.formatPi(a)).join(', '),
          explanation: r`Principal value $` + M.texPi((isCos ? Math.acos(n.v) : Math.asin(n.v))) + r`$; partner $` + M.texPi(isCos ? -Math.acos(n.v) : PI - Math.asin(n.v)) + r`$; add $2\pi$ to each as needed. First three positive: ` + first3.map(a => '$' + M.texPi(a) + '$').join(', ') + '.'
        };
      },
      // which is NOT a value
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const p = (isCos ? Math.acos(n.v) : Math.asin(n.v)) / DEG;
        const partner = isCos ? -p : 180 - p;
        const valid = [p, partner, p + 360, partner + 360, p - 360].map(v => M.round(v, 2));
        const wrongs = (isCos ? [180 - p, p + 180, 180 + p] : [-p, p + 180, 360 - p]).concat([p + 90, p + 45, p + 30]);
        const wrong = rng.pick(wrongs.filter(w => !valid.some(v => Math.abs(v - w) < 1e-6) && Math.abs(w) > 1e-6));
        const picks = rng.shuffle(valid).slice(0, 3);
        return {
          type: 'mc', prompt: 'Which of these is **not** a value of $\\' + fn + '^{-1}\\left(' + n.tex + '\\right)$?',
          choices: picks.map(v => ({ text: M.fmt(v) + '°', correct: false })).concat([{ text: M.fmt(wrong) + '°', correct: true }]),
          explanation: r`Valid values are $` + (isCos ? '\\pm ' + M.fmt(p) : M.fmt(p) + '^\\circ + 360^\\circ n$ or $' + M.fmt(partner)) + r`^\circ + 360^\circ n$. Check $` + '\\' + fn + '(' + M.fmt(wrong) + '^\\circ) = ' + M.fmt((isCos ? Math.cos : Math.sin)(wrong * DEG), 3) + r`$, which is not $` + n.tex + '$.'
        };
      }
    ];
  }
  function explain(fn, xTex, p, first3) {
    const isCos = fn === 'cos';
    const partner = isCos ? -p : 180 - p;
    return r`Principal value $` + '\\' + fn + '^{-1}(' + xTex + ') = ' + M.fmt(p, 2) + r`^\circ$. Partner: $` + (isCos ? '-' + M.fmt(p, 2) : '180^\\circ - ' + M.fmt(p, 2) + '^\\circ = ' + M.fmt(partner, 2)) + r`^\circ$. Add $360^\circ$ to each family and collect the positives in order: $` + first3.map(a => M.fmt(a, 2) + '^\\circ').join(',\\ ') + '$.';
  }

  s11.topics.push({
    id: '2-11-eval-arccos', title: 'Evaluating cos⁻¹: principal value + first three positive',
    notes: evalNotes('cos'),
    explore: {
      type: 'custom',
      intro: 'Pick $x_0$. The explorer marks **every** angle with cosine $x_0$ on $[-360^\\circ, 1080^\\circ]$. Work out the principal value and the first three positive values on paper, then reveal.',
      setup(container, L) { relationExplorer(container, L, 'cos', true); },
      tasks: r`1. $x_0 = 0.5$: predict principal value and first three positive; reveal.
2. $x_0 = -0.6$: same. Notice the principal value is already positive and is the first of the three.
3. $x_0 = 0.9$: the partner is $-25.8^\circ$; so the second positive value is $360^\circ - 25.8^\circ$. Confirm.`
    },
    practice: [
      { q: r`$\cos^{-1}\!\big(\tfrac{\sqrt2}{2}\big)$: principal value and first three positive values, in degrees and radians.`, hint: 'θ₀ = 45°, partner −45°.', answer: r`Principal $45^\circ = \tfrac{\pi}{4}$. Positives: $45^\circ, 315^\circ, 405^\circ$ $= \tfrac{\pi}{4}, \tfrac{7\pi}{4}, \tfrac{9\pi}{4}$.`, solution: r`Families $45^\circ + 360^\circ n$: $45, 405, 765$. And $-45^\circ + 360^\circ n$: $315, 675$. Sorted positives: $45, 315, 405$.` },
      { q: r`$\cos^{-1}(0.3)$: principal value and first three positive values, nearest $0.01^\circ$.`, hint: 'cos⁻¹(0.3) ≈ 72.54°.', answer: r`$72.54^\circ$; $72.54^\circ, 287.46^\circ, 432.54^\circ$`, solution: r`Partner $-72.54^\circ \to 287.46^\circ$ after adding $360^\circ$. Then $72.54 + 360 = 432.54$. Next would be $647.46$.` },
      { q: r`$\cos^{-1}(-1)$: principal value and first three positive values.`, hint: 'The two families coincide here.', answer: r`$180^\circ$; $180^\circ, 540^\circ, 900^\circ$`, solution: r`$\pm 180^\circ + 360^\circ n$ — but $-180^\circ + 360^\circ = 180^\circ$, so the families overlap and the values are just $180^\circ + 360^\circ n$.` },
      { q: r`Find the **first negative** value of $\cos^{-1}(0.25)$.`, hint: 'Which family gives negatives first?', answer: r`$\approx -75.52^\circ$`, solution: r`$\cos^{-1}(0.25) \approx 75.52^\circ$. Partner $-75.52^\circ$ is already negative and closest to zero.` }
    ],
    quiz: evalGenerators('cos')
  });

  s11.topics.push({
    id: '2-11-eval-arcsin', title: 'Evaluating sin⁻¹: principal value + first three positive',
    notes: evalNotes('sin'),
    explore: {
      type: 'custom',
      intro: 'Pick $x_0$. Every angle with sine $x_0$ on $[-360^\\circ, 1080^\\circ]$ is marked. Compute on paper first; reveal to check.',
      setup(container, L) { relationExplorer(container, L, 'sin', true); },
      tasks: r`1. $x_0 = 0.5$: principal $30^\circ$, partner $150^\circ$. First three positive?
2. $x_0 = -0.6$: principal is **negative**. Which value is the first positive one? Is it from the partner family?
3. Compare with cos⁻¹ for the same $x_0$ — the lists are different, but do they share any entries?`
    },
    practice: [
      { q: r`$\sin^{-1}\!\big(\tfrac{\sqrt3}{2}\big)$: principal value and first three positive values, in degrees and radians.`, hint: 'θ₀ = 60°, partner 120°.', answer: r`Principal $60^\circ = \tfrac{\pi}{3}$. Positives: $60^\circ, 120^\circ, 420^\circ$ $= \tfrac{\pi}{3}, \tfrac{2\pi}{3}, \tfrac{7\pi}{3}$.`, solution: r`Families $60^\circ + 360^\circ n$ and $120^\circ + 360^\circ n$. Sorted positives: $60, 120, 420, 480, \ldots$` },
      { q: r`$\sin^{-1}(-0.35)$: principal value and first three positive values, nearest $0.01^\circ$.`, hint: 'Principal is negative; partner is 180° − (negative).', answer: r`$-20.49^\circ$; $200.49^\circ, 339.51^\circ, 560.49^\circ$`, solution: r`$\sin^{-1}(-0.35) \approx -20.49^\circ$. Partner $180 + 20.49 = 200.49^\circ$. Add $360$: $339.51^\circ$ and $560.49^\circ$. Sorted: $200.49, 339.51, 560.49$.` },
      { q: r`$\sin^{-1}(1)$: principal value and first three positive values.`, hint: 'Partner = 180° − 90°.', answer: r`$90^\circ$; $90^\circ, 450^\circ, 810^\circ$`, solution: r`$180^\circ - 90^\circ = 90^\circ$ — the families coincide, so values are $90^\circ + 360^\circ n$.` },
      { q: r`Find the first **negative** value of $\sin^{-1}(0.7)$.`, hint: 'Both families: subtract 360° and see which is closer to zero.', answer: r`$\approx -224.43^\circ$`, solution: r`$\sin^{-1}(0.7) \approx 44.43^\circ$, partner $135.57^\circ$. Subtract $360^\circ$: $-315.57^\circ$ and $-224.43^\circ$. The one closest to zero is $-224.43^\circ$.` }
    ],
    quiz: evalGenerators('sin')
  });

  // ---- shared explorer: horizontal line through a wave, all crossings marked ----
  function relationExplorer(container, L, fn, wide) {
    const { Graph, M, R } = L;
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' }); root.appendChild(top);
    const eq = R.el('div', { class: 'equation' }); top.appendChild(eq);
    const box = R.el('div'); root.appendChild(box);
    const xMin = wide ? -360 : -360, xMax = wide ? 1080 : 720;
    const g = new Graph(box, { xMin, xMax, yMin: -1.5, yMax: 1.5, xUnit: 'deg', xStep: 90, yStep: 0.5, height: 320, interactive: false });
    const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
    const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
    const st = { k: 0.5, show: false };
    Graph.slider(sl, { label: 'x₀', min: -1, max: 1, step: 0.05, value: 0.5, onInput: v => { st.k = v; draw(); } });
    const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
    Graph.toggle(tg, 'Reveal all crossings', false, v => { st.show = v; draw(); });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);
    function draw() {
      const f = fn === 'sin' ? Math.sin : Math.cos;
      const p = (fn === 'sin' ? Math.asin(st.k) : Math.acos(st.k)) / M.DEG;
      const partner = fn === 'sin' ? 180 - p : -p;
      const pts = [];
      for (let n = -3; n <= 4; n++) [p, partner].forEach(s => { const x = s + 360 * n; if (x >= xMin && x <= xMax) pts.push(x); });
      const uniq = Array.from(new Set(pts.map(x => M.round(x, 2)))).sort((a, b) => a - b);
      const inRange = fn === 'sin' ? (x => x >= -90 && x <= 90) : (x => x >= 0 && x <= 180);
      g.update({
        fns: [{ f: x => f(x * M.DEG), label: 'y = ' + fn + ' θ' }],
        hlines: [{ y: st.k, label: 'y = x₀' }],
        points: st.show ? uniq.map(x => ({ x, y: st.k, label: M.fmt(x, 1) + '°', color: inRange(x) ? (g.palette ? g.palette.accent3 : '#059669') : undefined, r: inRange(x) ? 6 : 4.5, dy: uniq.indexOf(x) % 2 ? 16 : -6 })) : []
      });
      eq.innerHTML = R.tex('\\' + fn + '^{-1}(' + M.fmt(st.k, 2) + ')', true);
      const pos = uniq.filter(x => x > 0).slice(0, 3);
      info.innerHTML = st.show
        ? '<div class="info-row"><span>Principal value ' + fn + '⁻¹(x₀)</span><strong>' + M.fmt(p, 2) + '°</strong></div>' +
          '<div class="info-row"><span>Partner</span><strong>' + M.fmt(partner, 2) + '°</strong></div>' +
          '<div class="info-row"><span>First three positive</span><strong>' + pos.map(x => M.fmt(x, 2) + '°').join(',  ') + '</strong></div>' +
          '<div class="info-row"><span>General</span><strong>' + (fn === 'cos' ? '±' + M.fmt(p, 2) + '° + 360°n' : M.fmt(p, 2) + '° + 360°n  or  ' + M.fmt(partner, 2) + '° + 360°n') + '</strong></div>'
        : '<div class="info-row"><span>x₀ = ' + M.fmt(st.k, 2) + '</span><strong>Compute principal value, partner, and first three positive values. Then reveal.</strong></div>';
    }
    draw();
  }
})();
