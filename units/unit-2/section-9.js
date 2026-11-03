/* Unit 2 — section 2-9: graphs of tan, cot, sec, csc (key points & asymptotes). */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { graphOf, texEq, PI } = window.U2;
  const r = String.raw;
  const sec = { id: '2-9', title: 'Tangent, cotangent, secant, cosecant graphs', topics: [] };
  U.sections.push(sec);

  // Shared generator: asymptotes of a transformed function
  function genAsymptotes(fnName) {
    return function (rng) {
      const B = rng.pick([1, 2, 0.5, 3]);
      const D = rng.pick([0, PI / 6, PI / 4, PI / 3, -PI / 6]);
      const C = rng.int(-2, 2), A = rng.pick([1, 2, 0.5]);
      const asy = Explore.asymptotesOf(fnName, B, D, 'rad', D - 0.001, D + PI / B + 0.001);
      const first = asy[0];
      const step = fnName === 'tan' || fnName === 'cot' ? PI / B : PI / B;
      return {
        type: 'multi', prompt: 'For $' + texEq(fnName, A, B, C, D, 'rad') + '$, find the first vertical asymptote with $x \\ge ' + M.texPi(D) + '$ and the spacing between consecutive asymptotes. (Type like `pi/4`.)',
        fields: [{ label: 'first asymptote $x =$', parse: 'pi', answer: first, tol: 0.005, answerText: M.formatPi(first) }, { label: 'spacing', parse: 'pi', answer: step, tol: 0.005, answerText: M.formatPi(step) }],
        explanation: asyExplain(fnName, A, B, C, D, first, step)
      };
    };
  }
  function asyExplain(fnName, A, B, C, D, first, step) {
    const where = { tan: 'where $\\cos(B(x - D)) = 0$, i.e. $B(x - D) = \\tfrac{\\pi}{2}$', sec: 'where $\\cos(B(x - D)) = 0$, i.e. $B(x - D) = \\tfrac{\\pi}{2}$', cot: 'where $\\sin(B(x - D)) = 0$, i.e. $B(x - D) = 0$', csc: 'where $\\sin(B(x - D)) = 0$, i.e. $B(x - D) = 0$' }[fnName];
    return r`Asymptotes occur ` + where + r`. Solving gives $x = ` + M.texPi(first) + r`$. They repeat every $\pi / B = ` + M.texPi(step) + '$. ($A$ and $C$ never move asymptotes.)';
  }

  // Shared: tan/cot explorer config
  function tanExplore(fn) {
    return {
      type: 'trig', fn, mode: 'rad', A: 1, B: 1, C: 0, D: 0, sliders: ['A', 'B', 'C', 'D'], challenge: false, modeSwitch: true, fnChoices: ['tan', 'cot'],
      show: { parent: true, axis: true, amplitude: false, period: true, critical: true, asymptotes: true },
      intro: 'Dashed = parent. Asymptotes are the dashed verticals. The marked points are the center (hollow) and the two "quarter points" one quarter-period either side, where $y = C \\pm A$.'
    };
  }
  function recipExplore(fn) {
    return {
      type: 'trig', fn, mode: 'rad', A: 1, B: 1, C: 0, D: 0, sliders: ['A', 'B', 'C', 'D'], challenge: false, modeSwitch: true, fnChoices: ['sec', 'csc'],
      show: { parent: true, axis: true, amplitude: false, period: true, critical: true, asymptotes: true },
      intro: 'Dashed = the matching sinusoid ($\\cos$ for $\\sec$, $\\sin$ for $\\csc$) with the **same** $A, B, C, D$. The reciprocal graph touches it at every peak and shoots off to an asymptote wherever the sinusoid crosses its axis.'
    };
  }

  sec.topics.push({
    id: '2-9-tan', title: 'Graphing tangent (key points & asymptotes)',
    notes: r`## Where tangent comes from

$$\tan x = \frac{\sin x}{\cos x}$$

- **Zeros** where $\sin x = 0$: $x = 0, \pm\pi, \pm 2\pi, \ldots$ ($0^\circ, 180^\circ, \ldots$)
- **Vertical asymptotes** where $\cos x = 0$: $x = \pm\tfrac{\pi}{2}, \pm\tfrac{3\pi}{2}, \ldots$ ($90^\circ, 270^\circ, \ldots$)
- **Period $\pi$** ($180^\circ$) — half a sinusoid's period, because $\tan(x + \pi) = \tan x$ (both sine and cosine flip sign).
- **No amplitude** — the range is all real numbers.
- Always **increasing** between asymptotes.

## Three key points per cycle

Between consecutive asymptotes, plot the center and two quarter points:

$$\left(-\tfrac{\pi}{4}, -1\right)\quad \left(0, 0\right)\quad \left(\tfrac{\pi}{4}, 1\right)$$

then sweep up toward the asymptote on the right and down toward the one on the left.

## Transformed: $y = C + A\tan\big(B(x - D)\big)$

| | |
| --- | --- |
| Period | $\dfrac{\pi}{B}$ (**not** $2\pi/B$) |
| Center point | $(D, C)$ — the graph crosses $y = C$ going up (if $A > 0$) |
| Quarter points | $\big(D \pm \tfrac{P}{4},\ C \pm A\big)$ |
| Asymptotes | $x = D \pm \tfrac{P}{2}$, repeating every $P$ |

$A$ is a vertical stretch, **not** an amplitude; $A < 0$ makes the graph *decreasing*.

> **Common mistake:** period $2\pi/B$. Tangent's parent period is $\pi$. $y = \tan 2x$ has period $\tfrac{\pi}{2}$.

> **Common mistake:** putting the asymptote at $x = D$. For tangent, $D$ is the **center** (a zero of the parent); asymptotes are half a period on either side.`,
    explore: Object.assign(tanExplore('tan'), {
      tasks: r`1. Parent tan: list the asymptotes on screen and the three key points in $(-\tfrac{\pi}{2}, \tfrac{\pi}{2})$. Hover to confirm.
2. Set $B = 2$. New period? Where are the asymptotes now? Verify $\pm\tfrac{\pi}{4}$.
3. Set $D = \tfrac{\pi}{4}$, $B = 1$. Where did the center go? The asymptotes?
4. Set $A = -1$. What changed about the direction of each branch?`
    }),
    practice: [
      { q: r`For $y = \tan x$, list all asymptotes and zeros in $[0, 2\pi]$.`, hint: 'Zeros where sin = 0; asymptotes where cos = 0.', answer: r`Zeros: $0, \pi, 2\pi$. Asymptotes: $x = \tfrac{\pi}{2}, \tfrac{3\pi}{2}$.`, solution: r`$\tan = \sin/\cos$. Sine is $0$ at $0, \pi, 2\pi$; cosine is $0$ at $\tfrac{\pi}{2}, \tfrac{3\pi}{2}$.` },
      { q: r`Find the period and the asymptotes of $y = \tan 3x$ in $[0, \pi]$.`, hint: 'Period π/B. Asymptotes at odd multiples of P/2 from the center at 0.', answer: r`Period $\tfrac{\pi}{3}$; asymptotes $x = \tfrac{\pi}{6}, \tfrac{\pi}{2}, \tfrac{5\pi}{6}$`, solution: r`$P = \pi/3$. Asymptotes where $3x = \tfrac{\pi}{2} + n\pi$, so $x = \tfrac{\pi}{6} + \tfrac{n\pi}{3}$: $\tfrac{\pi}{6}, \tfrac{\pi}{2}, \tfrac{5\pi}{6}$.` },
      { q: r`Sketch one cycle of $y = 1 + 2\tan\big(x - \tfrac{\pi}{4}\big)$: give the center point, two quarter points, and the two bounding asymptotes.`, hint: 'Center at (D, C). Period π, so quarter = π/4.', answer: r`Center $(\tfrac{\pi}{4}, 1)$; quarter points $(0, -1)$ and $(\tfrac{\pi}{2}, 3)$; asymptotes $x = -\tfrac{\pi}{4}$ and $x = \tfrac{3\pi}{4}$`, solution: r`$D = \tfrac{\pi}{4}$, $C = 1$, $A = 2$, period $\pi$. Quarter points at $D \pm \tfrac{\pi}{4}$ with $y = 1 \pm 2$. Asymptotes at $D \pm \tfrac{\pi}{2}$.` },
      { q: r`$y = A\tan(Bx)$ has asymptotes at $x = \pm\tfrac{\pi}{8}$ (consecutive) and passes through $\left(\tfrac{\pi}{16}, 3\right)$. Find $A$ and $B$.`, hint: 'Consecutive asymptotes are one period apart. π/16 is a quarter point.', answer: r`$B = 4$, $A = 3$`, solution: r`Period $= \tfrac{\pi}{8} - (-\tfrac{\pi}{8}) = \tfrac{\pi}{4}$, so $B = \pi / \tfrac{\pi}{4} = 4$. At $x = \tfrac{\pi}{16}$: $\tan(4 \cdot \tfrac{\pi}{16}) = \tan\tfrac{\pi}{4} = 1$, so $A = 3$.` }
    ],
    quiz: [
      function (rng) {
        const B = rng.pick([1, 2, 3, 4, 0.5, 1.5]);
        return { type: 'number', parse: 'pi', prompt: 'Find the period of $y = \\tan(' + M.fmt(B) + 'x)$ (exact).', answer: PI / B, tol: 0.005, answerText: M.formatPi(PI / B), explanation: r`Tangent's parent period is $\pi$, so period $= \pi / B = \pi / ` + M.fmt(B) + ' = ' + M.texPi(PI / B) + '$. (Not $2\\pi/B$.)' };
      },
      genAsymptotes('tan'),
      function (rng) {
        const A = rng.pick([1, 2, 3, -1, -2]), C = rng.int(-2, 2), B = rng.pick([1, 2]), D = rng.pick([0, PI / 4, PI / 6, -PI / 4]);
        const P = PI / B;
        return {
          type: 'multi', prompt: 'For $' + texEq('tan', A, B, C, D, 'rad') + '$, give the center point of the cycle starting at $x = D$ and the quarter point a quarter-period to its **right**.',
          fields: [{ label: 'center $x$', parse: 'pi', answer: D, tol: 0.005, answerText: M.formatPi(D) }, { label: 'center $y$', answer: C, tol: 0.01 }, { label: 'right quarter point $x$', parse: 'pi', answer: D + P / 4, tol: 0.005, answerText: M.formatPi(D + P / 4) }, { label: 'right quarter point $y$', answer: C + A, tol: 0.01 }],
          explanation: r`Center is $(D, C) = (` + M.texPi(D) + ', ' + C + r`)$. Period $\pi/B = ` + M.texPi(P) + r`$, quarter $= ` + M.texPi(P / 4) + r`$. There, $\tan = 1$, so $y = C + A = ` + (C + A) + '$.'
        };
      },
      function (rng) {
        const B = rng.pick([1, 2, 0.5]), A = rng.pick([1, 2, 0.5, -1]), C = rng.int(-1, 1), D = rng.pick([0, PI / 4, -PI / 4, PI / 2]);
        const P = PI / B;
        const good = texEq('tan', A, B, C, D, 'rad');
        const bad1 = texEq('tan', A, B / 2, C, D, 'rad');   // period confusion
        const bad2 = texEq('tan', A, B, C, D + P / 2, 'rad'); // asymptote treated as center
        const bad3 = texEq('tan', -A, B, C, D, 'rad');
        return {
          type: 'mc', prompt: 'Which equation matches this graph?', graph: graphOf({ fn: 'tan', A, B, C, D, mode: 'rad', xStep: PI / 4, yMin: C - 4, yMax: C + 4, view: { xMin: -PI, xMax: PI, xStep: PI / 4 } }),
          choices: [{ text: '$' + good + '$', correct: true }, { text: '$' + bad1 + '$', correct: false }, { text: '$' + bad2 + '$', correct: false }, { text: '$' + bad3 + '$', correct: false }].filter((c, i, a) => a.findIndex(d => d.text === c.text) === i),
          explanation: r`Asymptote spacing $= ` + M.texPi(P) + r` = \pi/B$ gives $B = ` + M.fmt(B) + r`$. The hollow point where the graph crosses $y = C$ is $(D, C)$, **midway between** asymptotes. The branch ` + (A > 0 ? 'rises' : 'falls') + ' left-to-right, so $A$ is ' + (A > 0 ? 'positive' : 'negative') + '; the quarter point is $|A| = ' + Math.abs(A) + '$ above/below $C$.'
        };
      }
    ]
  });

  sec.topics.push({
    id: '2-9-cot', title: 'Graphing cotangent (key points & asymptotes)',
    notes: r`## Cotangent is tangent's reciprocal

$$\cot x = \frac{\cos x}{\sin x} = \frac{1}{\tan x}$$

Everything swaps roles:

- **Zeros** where $\cos x = 0$: $x = \tfrac{\pi}{2} + n\pi$
- **Asymptotes** where $\sin x = 0$: $x = n\pi$ ($0, \pm\pi, \pm 2\pi, \ldots$)
- **Period $\pi$**, no amplitude
- Always **decreasing** between asymptotes (tangent increases; its reciprocal decreases)

## Key points per cycle, starting at an asymptote

Between $x = 0$ and $x = \pi$:

$$\left(\tfrac{\pi}{4}, 1\right)\quad \left(\tfrac{\pi}{2}, 0\right)\quad \left(\tfrac{3\pi}{4}, -1\right)$$

Compare tangent, which has $\left(\tfrac{\pi}{4}, 1\right)$ too — at $\tfrac{\pi}{4}$, $\tan = \cot = 1$. But at $\tfrac{3\pi}{4}$, $\tan = -1$ **and** $\cot = -1$: the graphs cross there as well.

## Transformed: $y = C + A\cot\big(B(x - D)\big)$

| | |
| --- | --- |
| Period | $\dfrac{\pi}{B}$ |
| Asymptotes | $x = D + nP$ — **$D$ is an asymptote**, not a center |
| Center point | $\big(D + \tfrac{P}{2},\ C\big)$ |
| Quarter points | $\big(D + \tfrac{P}{4},\ C + A\big)$ and $\big(D + \tfrac{3P}{4},\ C - A\big)$ |

> **Common mistake:** treating $D$ the same way as for tangent. For $\tan$, $x = D$ is a **zero/center**; for $\cot$, $x = D$ is an **asymptote**. Same reason cosine and sine differ: it's about where the parent starts.

> **Common mistake:** drawing cotangent increasing. It's the mirror image: high on the left, falling to the right.`,
    explore: Object.assign(tanExplore('cot'), {
      tasks: r`1. Compare **tan** and **cot** with all parameters at default. Where do they cross? (Hover both.)
2. On **cot**, set $D = \tfrac{\pi}{4}$. Is $x = \tfrac{\pi}{4}$ now a zero or an asymptote?
3. Set $B = 2$, $D = 0$ on cot. List every asymptote on screen; check the spacing is $\tfrac{\pi}{2}$.
4. Find $A$, $C$, $D$ for cot that make it match the parent **tan** graph exactly. (It's possible — think reflection + shift.)`
    }),
    practice: [
      { q: r`List the asymptotes and zeros of $y = \cot x$ on $[0, 2\pi]$.`, hint: 'Opposite of tangent.', answer: r`Asymptotes: $x = 0, \pi, 2\pi$. Zeros: $\tfrac{\pi}{2}, \tfrac{3\pi}{2}$.`, solution: r`$\cot = \cos/\sin$: undefined where $\sin = 0$, zero where $\cos = 0$.` },
      { q: r`Find the period and the asymptotes of $y = \cot\big(\tfrac{x}{2}\big)$ on $[-2\pi, 2\pi]$.`, hint: 'B = 1/2.', answer: r`Period $2\pi$; asymptotes $x = -2\pi, 0, 2\pi$`, solution: r`$P = \pi \div \tfrac12 = 2\pi$. Asymptotes where $\tfrac{x}{2} = n\pi \Rightarrow x = 2n\pi$.` },
      { q: r`Sketch one cycle of $y = -2 + \cot\big(2(x - \tfrac{\pi}{6})\big)$: asymptotes, center, quarter points.`, hint: 'Period π/2. Cycle runs from asymptote at D to asymptote at D + P.', answer: r`Asymptotes $x = \tfrac{\pi}{6}$ and $x = \tfrac{2\pi}{3}$; quarter point $(\tfrac{7\pi}{24}, -1)$; center $(\tfrac{5\pi}{12}, -2)$; quarter point $(\tfrac{13\pi}{24}, -3)$`, solution: r`$P = \tfrac{\pi}{2}$, quarter $\tfrac{\pi}{8}$. Start at asymptote $x = \tfrac{\pi}{6}$. Add $\tfrac{\pi}{8}$: $\tfrac{7\pi}{24}$, $y = C + A = -1$. Add again: $\tfrac{5\pi}{12}$, $y = C = -2$. Again: $\tfrac{13\pi}{24}$, $y = -3$. Again: $\tfrac{2\pi}{3}$, asymptote.` },
      { q: r`Write $y = \tan x$ as a transformed cotangent.`, hint: 'tan x = −cot(x − π/2)? Check at x = 0.', answer: r`$y = -\cot\big(x - \tfrac{\pi}{2}\big)$ (equivalently $y = -\cot(x + \tfrac{\pi}{2})$)`, solution: r`$\cot(x - \tfrac{\pi}{2}) = \dfrac{\cos(x - \pi/2)}{\sin(x - \pi/2)} = \dfrac{\sin x}{-\cos x} = -\tan x$. Negate: $-\cot(x - \tfrac{\pi}{2}) = \tan x$. ✓ (shift the asymptote from $0$ to $\tfrac{\pi}{2}$, then flip because cot decreases).` }
    ],
    quiz: [
      genAsymptotes('cot'),
      function (rng) {
        const fn = rng.pick(['tan', 'cot']);
        const x = rng.pick([0, PI / 4, PI / 2, 3 * PI / 4, PI, 5 * PI / 4, 3 * PI / 2]);
        const v = fn === 'tan' ? Math.tan(x) : 1 / Math.tan(x);
        const isAsy = Math.abs(v) > 1e6 || !isFinite(v);
        const choices = ['$1$', '$-1$', '$0$', 'undefined (asymptote)'].map(t => ({ text: t, correct: isAsy ? t.startsWith('undefined') : t === '$' + Math.round(v) + '$' }));
        return { type: 'mc', prompt: 'What is $\\' + fn + '\\left(' + M.texPi(x) + '\\right)$ on the parent graph?', choices, explanation: fn === 'tan' ? r`$\tan = \sin/\cos$ at $` + M.texPi(x) + '$: ' + (isAsy ? 'cosine is $0$ → asymptote.' : 'value $' + Math.round(v) + '$.') : r`$\cot = \cos/\sin$ at $` + M.texPi(x) + '$: ' + (isAsy ? 'sine is $0$ → asymptote.' : 'value $' + Math.round(v) + '$.') };
      },
      function (rng) {
        const A = rng.pick([1, 2, -1]), C = rng.int(-2, 2), B = rng.pick([1, 2, 0.5]), D = rng.pick([0, PI / 6, PI / 4, PI / 3]);
        const P = PI / B;
        return {
          type: 'multi', prompt: 'For $' + texEq('cot', A, B, C, D, 'rad') + '$: where is the center point of the cycle that starts at the asymptote $x = D$, and what is $y$ at the first quarter point after $D$?',
          fields: [{ label: 'center $x$', parse: 'pi', answer: D + P / 2, tol: 0.005, answerText: M.formatPi(D + P / 2) }, { label: 'center $y$', answer: C, tol: 0.01 }, { label: '$y$ at $x = D + P/4$', answer: C + A, tol: 0.01 }],
          explanation: r`For cotangent $x = D$ is an **asymptote**. Period $` + M.texPi(P) + r`$; the center (where the graph crosses $y = C$) is half a period later at $x = ` + M.texPi(D + P / 2) + r`$. A quarter period after the asymptote, $\cot = 1$, so $y = C + A = ` + (C + A) + '$.'
        };
      },
      function (rng) {
        const fn = rng.pick(['tan', 'cot']);
        const other = fn === 'tan' ? 'cot' : 'tan';
        const B = rng.pick([1, 2]);
        const D = rng.pick([0, PI / 4]);
        return {
          type: 'mc', prompt: 'Is this $y = \\tan$ or $y = \\cot$ (with $A = 1$, $C = 0$, $B = ' + B + '$, $D = ' + M.texPi(D) + '$)?', graph: graphOf({ fn, A: 1, B, C: 0, D, mode: 'rad', xStep: PI / 4, yMin: -4, yMax: 4, view: { xMin: -PI, xMax: PI, xStep: PI / 4 } }),
          choices: [{ text: '$y = \\' + fn + '(' + (B === 1 ? '' : B) + (D ? '(x - ' + M.texPi(D) + ')' : 'x') + ')$', correct: true }, { text: '$y = \\' + other + '(' + (B === 1 ? '' : B) + (D ? '(x - ' + M.texPi(D) + ')' : 'x') + ')$', correct: false }],
          explanation: fn === 'tan' ? 'Each branch **rises** left to right, and $x = D$ is a zero (center) — tangent.' : 'Each branch **falls** left to right, and $x = D$ is an asymptote — cotangent.'
        };
      }
    ]
  });

  sec.topics.push({
    id: '2-9-csc', title: 'Graphing cosecant (key points & asymptotes)',
    notes: r`## Cosecant is $1/\sin$

$$\csc x = \frac{1}{\sin x}$$

Draw the sine wave lightly first — then:

- Wherever $\sin x = 0$ → **vertical asymptote**: $x = n\pi$ ($0, \pm\pi, \pm 2\pi, \ldots$)
- Wherever $\sin x = 1$ → $\csc x = 1$: a **local minimum** of a U-shaped branch at $x = \tfrac{\pi}{2} + 2n\pi$
- Wherever $\sin x = -1$ → $\csc x = -1$: a **local maximum** of an upside-down U at $x = \tfrac{3\pi}{2} + 2n\pi$
- **Period $2\pi$** (same as sine)
- **Range:** $y \le -1$ or $y \ge 1$ — there is a gap between $-1$ and $1$ where the graph never goes

The branches *touch* the sine wave at its peaks and troughs and curve away to the asymptotes.

## Transformed: $y = C + A\csc\big(B(x - D)\big)$

Sketch the helper sinusoid $y = C + A\sin\big(B(x - D)\big)$ (same letters!). Then:

| | |
| --- | --- |
| Period | $\dfrac{2\pi}{B}$ |
| Asymptotes | where the helper sinusoid crosses its axis: $x = D + n\tfrac{P}{2}$ |
| Local min/max | at the helper's high/low points: $\big(D + \tfrac{P}{4}, C + A\big)$, $\big(D + \tfrac{3P}{4}, C - A\big)$ |
| Range | $y \le C - |A|$ or $y \ge C + |A|$ |

> **Common mistake:** calling $|A|$ the amplitude. Cosecant has no amplitude (it's unbounded). $|A|$ is the distance from the axis to the *nearest* point of each branch.

> **Common mistake:** drawing a branch that crosses the axis $y = C$. Branches live entirely above $C + |A|$ or below $C - |A|$.`,
    explore: Object.assign(recipExplore('csc'), {
      tasks: r`1. Parent csc: where are the asymptotes on screen? Where does the graph touch the dashed sine?
2. Set $C = 1$, $A = 2$. What is the range now? Read the local min and max.
3. Set $B = 2$. How did the asymptote spacing change? Is it $P$ or $P/2$?
4. Set $D = \tfrac{\pi}{2}$ on **csc**. Which other function does this look like?`
    }),
    practice: [
      { q: r`For $y = \csc x$ on $[0, 2\pi]$, list the asymptotes and the coordinates of the local extrema.`, hint: 'Asymptotes where sin = 0. Extrema where sin = ±1.', answer: r`Asymptotes $x = 0, \pi, 2\pi$. Local min $(\tfrac{\pi}{2}, 1)$, local max $(\tfrac{3\pi}{2}, -1)$.`, solution: r`$\sin x = 0$ at $0, \pi, 2\pi$ → undefined. $\sin\tfrac{\pi}{2} = 1 \Rightarrow \csc = 1$ (bottom of the upward U). $\sin\tfrac{3\pi}{2} = -1 \Rightarrow \csc = -1$ (top of the downward U).` },
      { q: r`State the range of $y = 3 + 2\csc x$.`, hint: 'C ± |A|, going outward.', answer: r`$y \le 1$ or $y \ge 5$`, solution: r`Helper sinusoid has axis $3$ and amplitude $2$, so its max/min are $5$ and $1$. The cosecant branches start at those values and go outward.` },
      { q: r`Find the asymptotes of $y = \csc\big(2(x - \tfrac{\pi}{6})\big)$ on $[0, \pi]$.`, hint: 'Where does sin(2(x − π/6)) = 0? Spacing is half the period.', answer: r`$x = \tfrac{\pi}{6}, \tfrac{2\pi}{3}$`, solution: r`Period $\pi$, so asymptotes every $\tfrac{\pi}{2}$ starting at $D = \tfrac{\pi}{6}$: $\tfrac{\pi}{6}, \tfrac{2\pi}{3}$ (next would be $\tfrac{7\pi}{6}$, out of range).` },
      { q: r`Sketch $y = -1 + 2\csc\big(x - \tfrac{\pi}{4}\big)$ for one period: asymptotes and the two turning points.`, hint: 'Sketch the sine helper first.', answer: r`Asymptotes $x = \tfrac{\pi}{4}, \tfrac{5\pi}{4}, \tfrac{9\pi}{4}$; local min $(\tfrac{3\pi}{4}, 1)$; local max $(\tfrac{7\pi}{4}, -3)$`, solution: r`Helper: $y = -1 + 2\sin(x - \tfrac{\pi}{4})$, period $2\pi$, crosses axis at $\tfrac{\pi}{4}, \tfrac{5\pi}{4}, \tfrac{9\pi}{4}$ (asymptotes), high point $(\tfrac{3\pi}{4}, 1)$, low point $(\tfrac{7\pi}{4}, -3)$. Cosecant touches those and curves outward.` }
    ],
    quiz: [
      genAsymptotes('csc'),
      function (rng) {
        const A = rng.pick([1, 2, 3, 0.5, -2]), C = rng.int(-3, 3);
        return { type: 'multi', prompt: 'State the range of $y = ' + texEq('csc', A, 1, C, 0, 'rad') + '$ as "$y \\le$ (lower) or $y \\ge$ (upper)".', fields: [{ label: 'lower bound', answer: C - Math.abs(A), tol: 0.01 }, { label: 'upper bound', answer: C + Math.abs(A), tol: 0.01 }], explanation: r`The helper sinusoid spans $C \pm |A| = ` + (C - Math.abs(A)) + '$ to $' + (C + Math.abs(A)) + '$. Cosecant branches start **at** those values and go outward, so the gap between them is never reached.' };
      },
      function (rng) {
        const A = rng.pick([1, 2, 3]), C = rng.int(-2, 2), B = rng.pick([1, 2, 0.5]), D = rng.pick([0, PI / 4, PI / 6, PI / 2]);
        const P = 2 * PI / B;
        return {
          type: 'multi', prompt: 'For $' + texEq('csc', A, B, C, D, 'rad') + '$, find the local **minimum** point of the first upward branch after $x = D$.',
          fields: [{ label: '$x$', parse: 'pi', answer: D + P / 4, tol: 0.005, answerText: M.formatPi(D + P / 4) }, { label: '$y$', answer: C + A, tol: 0.01 }],
          explanation: r`The helper $y = C + A\sin(B(x - D))$ peaks a quarter period after $D$: $x = ` + M.texPi(D) + ' + ' + M.texPi(P / 4) + ' = ' + M.texPi(D + P / 4) + r`$, $y = C + A = ` + (C + A) + '$. Cosecant touches the helper there.'
        };
      },
      function (rng) {
        const fn = rng.pick(['csc', 'sec']);
        const other = fn === 'csc' ? 'sec' : 'csc';
        return {
          type: 'mc', prompt: 'Is this the parent $y = \\csc x$ or $y = \\sec x$?', graph: graphOf({ fn, A: 1, B: 1, C: 0, D: 0, mode: 'rad', xStep: PI / 2, yMin: -4, yMax: 4, view: { xMin: -PI, xMax: 2 * PI, xStep: PI / 2 } }),
          choices: [{ text: '$y = \\' + fn + ' x$', correct: true }, { text: '$y = \\' + other + ' x$', correct: false }],
          explanation: fn === 'csc' ? 'Asymptote **at** $x = 0$ (where $\\sin = 0$) and a branch bottoming out at $(\\tfrac{\\pi}{2}, 1)$ — cosecant.' : 'A branch bottoming out **at** $(0, 1)$ (where $\\cos = 1$) with asymptotes at $\\pm\\tfrac{\\pi}{2}$ — secant.'
        };
      }
    ]
  });

  sec.topics.push({
    id: '2-9-sec', title: 'Graphing secant (key points & asymptotes)',
    notes: r`## Secant is $1/\cos$

$$\sec x = \frac{1}{\cos x}$$

Draw the cosine wave lightly first — then:

- Wherever $\cos x = 0$ → **vertical asymptote**: $x = \tfrac{\pi}{2} + n\pi$
- Wherever $\cos x = 1$ → $\sec x = 1$: **local minimum** at $x = 2n\pi$ (so there's a U sitting on $(0, 1)$)
- Wherever $\cos x = -1$ → $\sec x = -1$: **local maximum** at $x = \pi + 2n\pi$
- **Period $2\pi$**; **range** $y \le -1$ or $y \ge 1$

Secant is cosecant shifted left $\tfrac{\pi}{2}$, exactly as cosine is sine shifted left $\tfrac{\pi}{2}$.

## Transformed: $y = C + A\sec\big(B(x - D)\big)$

Sketch the helper $y = C + A\cos\big(B(x - D)\big)$. Then:

| | |
| --- | --- |
| Period | $\dfrac{2\pi}{B}$ |
| Turning points | at the helper's high/low points: $(D, C + A)$, $\big(D + \tfrac{P}{2}, C - A\big)$, $(D + P, C + A)$ |
| Asymptotes | where the helper crosses its axis: $x = D + \tfrac{P}{4} + n\tfrac{P}{2}$ |
| Range | $y \le C - |A|$ or $y \ge C + |A|$ |

For secant, **$x = D$ is a turning point** (like cosine's high point); for cosecant, $x = D$ is an asymptote (like sine's axis-crossing).

## Evaluating

$\sec\tfrac{\pi}{3} = \dfrac{1}{\cos\frac{\pi}{3}} = \dfrac{1}{1/2} = 2$. $\;\sec\tfrac{5\pi}{6} = \dfrac{1}{-\sqrt3/2} = -\dfrac{2}{\sqrt3} = -\dfrac{2\sqrt3}{3}$. $\;\sec\tfrac{\pi}{2}$ is undefined.

> **Common mistake:** $\sec x = 1/\sin x$. No — **sec** goes with **cos** (the "co" functions pair up with the non-co: $\sec \leftrightarrow \cos$, $\csc \leftrightarrow \sin$). Memory hook: the third letter — se**c**ant ↔ **c**osine, co**s**ecant ↔ **s**ine.`,
    explore: Object.assign(recipExplore('sec'), {
      tasks: r`1. Parent sec: confirm the U sits on $(0, 1)$ and the asymptotes are at $\pm\tfrac{\pi}{2}$.
2. Set $D = \tfrac{\pi}{2}$. Compare with **csc** at $D = 0$ — identical?
3. Set $A = -1$. What happened to the turning point at $x = 0$? To the range?
4. Set $B = 2$, $A = 1$, $C = 2$. Range? Asymptote spacing? Turning points on screen?`
    }),
    practice: [
      { q: r`Evaluate exactly: $\sec\tfrac{\pi}{4}$, $\sec\pi$, $\sec\tfrac{2\pi}{3}$, $\sec\tfrac{3\pi}{2}$.`, hint: '1 over cosine. Rationalize.', answer: r`$\sqrt2$; $-1$; $-2$; undefined`, solution: r`$1/\tfrac{\sqrt2}{2} = \tfrac{2}{\sqrt2} = \sqrt2$. $1/(-1) = -1$. $1/(-\tfrac12) = -2$. $\cos\tfrac{3\pi}{2} = 0$ → undefined.` },
      { q: r`For $y = \sec x$, list the asymptotes and turning points on $[-\pi, \pi]$.`, hint: 'Cosine is 0 at ±π/2, ±1 at 0 and ±π.', answer: r`Asymptotes $x = \pm\tfrac{\pi}{2}$. Local min $(0, 1)$; local maxima $(\pm\pi, -1)$.`, solution: r`Where $\cos = 0$: $\pm\tfrac{\pi}{2}$. Where $\cos = 1$: $x = 0$, $\sec = 1$. Where $\cos = -1$: $x = \pm\pi$, $\sec = -1$.` },
      { q: r`Find the range and asymptotes (on $[0, 2\pi]$) of $y = 2 - 3\sec x$.`, hint: 'A = −3 flips which turning point is a min.', answer: r`Range $y \le -1$ or $y \ge 5$. Asymptotes $x = \tfrac{\pi}{2}, \tfrac{3\pi}{2}$.`, solution: r`Helper $2 - 3\cos x$ ranges from $-1$ to $5$. Asymptotes where $\cos x = 0$, unchanged by $A$ and $C$. At $x = 0$: $y = 2 - 3 = -1$, a local *maximum* now because $A < 0$.` },
      { q: r`Write an equation for a secant graph with asymptotes at $x = \tfrac{\pi}{4} + \tfrac{n\pi}{2}$, a local minimum at $(0, 3)$, and a local maximum at $(\tfrac{\pi}{2}, -1)$.`, hint: 'Asymptote spacing is half a period. Turning points give C ± A.', answer: r`$y = 1 + 2\sec(2x)$`, solution: r`Spacing $\tfrac{\pi}{2} = P/2 \Rightarrow P = \pi \Rightarrow B = 2$. $C = (3 + (-1))/2 = 1$, $A = 2$. The min at $x = 0$ means $D = 0$ with $A > 0$.` }
    ],
    quiz: [
      genAsymptotes('sec'),
      function (rng) {
        const x = rng.pick([0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6, PI, 4 * PI / 3, 3 * PI / 2, 5 * PI / 3, 7 * PI / 4]);
        const fn = rng.pick(['sec', 'csc']);
        const base = fn === 'sec' ? Math.cos(x) : Math.sin(x);
        const v = Math.abs(base) < 1e-9 ? Infinity : 1 / base;
        return { type: 'text', prompt: 'Evaluate exactly: $\\' + fn + '\\left(' + M.texPi(x) + '\\right)$. (Type like `2`, `-2sqrt3/3`, `sqrt2`, or `undefined`.)', check: s => { if (!isFinite(v)) return /undef|none|asym|dne/i.test(s); const p = M.parseExact(s); return !isNaN(p) && Math.abs(p - v) < 0.002; }, answerText: isFinite(v) ? M.formatExact(v) : 'undefined', explanation: r`$` + '\\' + fn + ' = 1/\\' + (fn === 'sec' ? 'cos' : 'sin') + '$. At $' + M.texPi(x) + '$, $\\' + (fn === 'sec' ? 'cos' : 'sin') + ' = ' + M.formatExact(base, true) + '$' + (isFinite(v) ? ', so the reciprocal is $' + M.formatExact(v, true) + '$' + (Math.abs(Math.abs(v) - 2 / Math.sqrt(3)) < 1e-9 || Math.abs(Math.abs(v) - Math.SQRT2) < 1e-9 ? ' (after rationalizing)' : '') + '.' : ' → dividing by zero → undefined (asymptote).') };
      },
      function (rng) {
        const A = rng.pick([1, 2, 3, -1, -2]), C = rng.int(-2, 3), B = rng.pick([1, 2, 0.5]), D = rng.pick([0, PI / 6, PI / 4, PI / 3]);
        const P = 2 * PI / B;
        return {
          type: 'multi', prompt: 'For $' + texEq('sec', A, B, C, D, 'rad') + '$, give the turning point at $x = D$ and the first asymptote to its right.',
          fields: [{ label: 'turning point $y$', answer: C + A, tol: 0.01 }, { label: 'it is a local…', parse: 'number', answer: A > 0 ? 1 : -1, tol: 0.1, answerText: A > 0 ? 'minimum (type 1)' : 'maximum (type -1)', placeholder: '1 = min, -1 = max' }, { label: 'first asymptote $x =$', parse: 'pi', answer: D + P / 4, tol: 0.005, answerText: M.formatPi(D + P / 4) }],
          explanation: r`Helper $C + A\cos(B(x - D))$ has value $C + A = ` + (C + A) + '$ at $x = D$ — a ' + (A > 0 ? 'high point, so the secant branch has a local **minimum**' : 'low point (A < 0), so the secant branch has a local **maximum**') + r` there. The helper crosses its axis a quarter period later: $x = ` + M.texPi(D + P / 4) + '$ → asymptote.'
        };
      },
      function (rng) {
        const items = [
          ['\\sec x = \\dfrac{1}{\\sin x}', false], ['\\sec x = \\dfrac{1}{\\cos x}', true], ['\\csc x = \\dfrac{1}{\\sin x}', true], ['\\cot x = \\dfrac{\\cos x}{\\sin x}', true], ['\\tan x = \\dfrac{\\cos x}{\\sin x}', false], ['\\csc x = \\dfrac{1}{\\cos x}', false]
        ];
        const it = rng.pick(items);
        return { type: 'mc', prompt: 'True or false: $' + it[0] + '$', choices: [{ text: 'True', correct: it[1] }, { text: 'False', correct: !it[1] }], explanation: r`$\sec \leftrightarrow \cos$, $\csc \leftrightarrow \sin$, $\tan = \sin/\cos$, $\cot = \cos/\sin$. Third-letter hook: se**c**ant ↔ **c**osine, co**s**ecant ↔ **s**ine.` };
      }
    ]
  });
})();
