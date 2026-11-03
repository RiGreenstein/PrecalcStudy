/* Unit 2 — section 2-6: inverse functions, sin⁻¹, cos⁻¹, and how they relate. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { PI, DEG } = window.U2;
  const r = String.raw;
  const sec = { id: '2-6', title: 'Inverse sine & cosine functions', topics: [] };
  U.sections.push(sec);

  const NICE = [
    { v: 1, tex: '1' }, { v: Math.sqrt(3) / 2, tex: '\\tfrac{\\sqrt3}{2}' }, { v: Math.SQRT2 / 2, tex: '\\tfrac{\\sqrt2}{2}' }, { v: 0.5, tex: '\\tfrac12' }, { v: 0, tex: '0' },
    { v: -0.5, tex: '-\\tfrac12' }, { v: -Math.SQRT2 / 2, tex: '-\\tfrac{\\sqrt2}{2}' }, { v: -Math.sqrt(3) / 2, tex: '-\\tfrac{\\sqrt3}{2}' }, { v: -1, tex: '-1' }
  ];

  sec.topics.push({
    id: '2-6-inverse-functions', title: 'Inverses of functions (the big idea)',
    notes: r`## What an inverse does

A function $f$ takes an input to an output. Its [[inverse]] $f^{-1}$ runs the process **backwards**: if $f(a) = b$ then $f^{-1}(b) = a$.

Graphically, the inverse is the **reflection across the line $y = x$** — every point $(a, b)$ becomes $(b, a)$. Algebraically, you **swap $x$ and $y$** and solve for $y$.

## Inverse *relation* vs. inverse *function*

Swapping $x$ and $y$ always gives a **relation**. It's a **function** only if each input has exactly one output — i.e. the original passed the [[horizontal line test]].

$y = \sin x$ fails spectacularly: the line $y = 0.5$ hits it infinitely many times. So the full inverse relation of sine ("all values of $\sin^{-1} x$") has infinitely many outputs for each input. Not a function.

## Fix: restrict the domain

Keep only a piece of the original graph that

1. passes the horizontal line test, and
2. still produces **every** output value in $[-1, 1]$.

That piece's inverse *is* a function. For sine, the chosen piece is $-\tfrac{\pi}{2} \le x \le \tfrac{\pi}{2}$; for cosine, $0 \le x \le \pi$. Their inverses are written $\sin^{-1}x$ and $\cos^{-1}x$.

> **Notation warning:** $\sin^{-1}x$ means the **inverse** function, *not* $\dfrac{1}{\sin x}$. The reciprocal is $\csc x$. (Yes, the notation is inconsistent with $\sin^2 x$. Everyone agrees it's unfortunate.)

## Domain ↔ range swap

Whatever the restricted original had as its domain becomes the inverse's **range**, and vice-versa:

| | **domain** | **range** |
| --- | --- | --- |
| $y = \sin x$ (restricted) | $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ | $[-1, 1]$ |
| $y = \sin^{-1}x$ | $[-1, 1]$ | $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ |`,
    explore: {
      type: 'inverse', fn: 'sin', mode: 'rad',
      intro: 'The thick green piece is the restricted sine (or cosine). Reflect it across the dashed $y = x$ line and you get the solid inverse-function curve. Toggle "show the whole inverse relation" to see what you\'d get **without** restricting — a wiggle that fails the vertical line test.',
      tasks: r`1. With "whole inverse relation" on, pick $x = 0.5$ and count how many $y$-values the relation has on screen. Then turn it off: how many does the function have?
2. Switch to **cos**. Why can't cosine use the same restriction $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ that sine uses? (Hint: horizontal line test on that piece.)
3. Read the endpoints of $y = \sin^{-1} x$ off the graph. Compare to the range in the table.`
    },
    practice: [
      { q: r`$f(x) = 2x - 6$. Find $f^{-1}(x)$ and verify with the point $(5, 4)$.`, hint: 'Swap x and y, solve for y.', answer: r`$f^{-1}(x) = \dfrac{x + 6}{2}$. $f(5) = 4$ and $f^{-1}(4) = 5$ ✓`, solution: r`$x = 2y - 6 \Rightarrow y = (x + 6)/2$. Check: $f(5) = 4$, and $f^{-1}(4) = 10/2 = 5$. Reflection of $(5,4)$ is $(4,5)$, which is on $f^{-1}$.` },
      { q: r`Explain, using the horizontal line test, why $y = \cos x$ has no inverse function unless its domain is restricted.`, hint: 'How many times does y = 0 cross the cosine graph?', answer: 'Any horizontal line between $-1$ and $1$ crosses $y = \cos x$ infinitely many times, so reflecting gives many $y$ for one $x$ — not a function.', solution: r`E.g. $y = 0$ hits cosine at $\pm\tfrac{\pi}{2}, \pm\tfrac{3\pi}{2}, \ldots$ After swapping, the input $0$ would have all those outputs. A function needs exactly one.` },
      { q: r`Why is $[0, \pi]$ a valid restriction for cosine but $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ is not?`, hint: 'Two conditions: one-to-one AND hits every value in [−1, 1].', answer: r`On $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$, cosine goes $0 \to 1 \to 0$: it repeats values and never reaches $-1$. On $[0, \pi]$ it goes $1 \to -1$ once, hitting everything exactly once.`, solution: r`A restriction has to be a piece where the function is strictly increasing or strictly decreasing **and** covers the whole range. Cosine decreases from $1$ to $-1$ on $[0, \pi]$ — perfect. On $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ it's symmetric about $0$, so it fails the horizontal line test.` },
      { q: r`True or false: $\sin^{-1}x = \dfrac{1}{\sin x}$.`, hint: 'What does the −1 mean on a function name?', answer: 'False. $\\sin^{-1}x$ is the inverse sine; $1/\\sin x = \\csc x$.', solution: r`Test $x = 1$: $\sin^{-1}(1) = \tfrac{\pi}{2} \approx 1.57$ while $1/\sin(1) \approx 1.19$. Different.` }
    ],
    quiz: [
      function (rng) {
        const a = rng.pick([2, 3, 4, 5, -2, 0.5]);
        const b = rng.int(-8, 8);
        const x = rng.int(-5, 6);
        const fx = a * x + b;
        return { type: 'number', prompt: r`$f(x) = ` + M.fmt(a) + 'x ' + (b >= 0 ? '+ ' + b : '- ' + (-b)) + r`$. Find $f^{-1}(` + M.fmt(fx) + ')$.', answer: x, tol: 0.01, answerText: String(x), explanation: r`$f^{-1}(` + M.fmt(fx) + ')$ asks: which input gives output $' + M.fmt(fx) + '$? Solve $' + M.fmt(a) + 'x ' + (b >= 0 ? '+ ' + b : '- ' + (-b)) + ' = ' + M.fmt(fx) + '$ → $x = ' + x + '$. (Or find $f^{-1}(x) = (x ' + (b >= 0 ? '- ' + b : '+ ' + (-b)) + ')/' + M.fmt(a) + '$ and plug in.)' };
      },
      function (rng) {
        const a = rng.int(-4, 4), b = rng.int(-4, 4);
        return { type: 'mc', prompt: 'The point $(' + a + ', ' + b + ')$ is on the graph of $y = f(x)$. Which point must be on $y = f^{-1}(x)$?', choices: [{ text: '$(' + b + ', ' + a + ')$', correct: true }, { text: '$(' + (-a) + ', ' + (-b) + ')$', correct: false }, { text: '$(' + a + ', ' + (-b) + ')$', correct: false }, { text: '$(' + (-b) + ', ' + (-a) + ')$', correct: false }].filter((c, i, arr) => arr.findIndex(d => d.text === c.text) === i), explanation: 'Inverse = reflection across $y = x$ = swap the coordinates: $(' + a + ', ' + b + ') \\to (' + b + ', ' + a + ')$.' };
      },
      function (rng) {
        const items = [
          { t: '$y = \\sin x$ on $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$', ok: true, why: 'increases from $-1$ to $1$ once — one-to-one and covers the range' },
          { t: '$y = \\cos x$ on $[0, \\pi]$', ok: true, why: 'decreases from $1$ to $-1$ once' },
          { t: '$y = \\sin x$ on $[0, \\pi]$', ok: false, why: 'goes $0 \\to 1 \\to 0$: repeats values and never reaches $-1$' },
          { t: '$y = \\cos x$ on $[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$', ok: false, why: 'goes $0 \\to 1 \\to 0$: fails the horizontal line test' },
          { t: '$y = \\sin x$ on $[0, 2\\pi]$', ok: false, why: 'a full cycle — every value between $-1$ and $1$ appears twice' },
          { t: '$y = \\cos x$ on $[\\pi, 2\\pi]$', ok: true, why: 'increases from $-1$ to $1$ once (a valid restriction, just not the conventional one)' },
          { t: '$y = \\sin x$ on $[\\tfrac{\\pi}{2}, \\tfrac{3\\pi}{2}]$', ok: true, why: 'decreases from $1$ to $-1$ once (valid, though not the standard choice)' }
        ];
        const it = rng.pick(items);
        return { type: 'mc', prompt: 'Would this restricted function have an inverse **function**? ' + it.t, choices: [{ text: 'Yes — one-to-one and covers $[-1, 1]$', correct: it.ok }, { text: 'No — fails the horizontal line test or misses part of $[-1, 1]$', correct: !it.ok }], explanation: 'On that interval the graph ' + it.why + '.' };
      },
      function (rng) {
        const fn = rng.pick(['sin', 'cos']);
        const which = rng.pick(['domain', 'range']);
        const dom = '$[-1, 1]$';
        const rng_ = fn === 'sin' ? '$[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$' : '$[0, \\pi]$';
        const correct = which === 'domain' ? dom : rng_;
        const choices = [dom, '$[-\\tfrac{\\pi}{2}, \\tfrac{\\pi}{2}]$', '$[0, \\pi]$', '$[0, 2\\pi]$', 'all real numbers'].map(t => ({ text: t, correct: t === correct }));
        return { type: 'mc', prompt: 'What is the **' + which + '** of $y = \\' + fn + '^{-1} x$?', choices, explanation: 'Domain and range swap. Restricted $\\' + fn + ' x$ has domain ' + rng_ + ' and range ' + dom + ', so $\\' + fn + '^{-1}x$ has domain ' + dom + ' and range ' + rng_ + '.' };
      }
    ]
  });

  sec.topics.push({
    id: '2-6-inverse-sin', title: 'The inverse sine function sin⁻¹ x',
    notes: r`## Definition

$$y = \sin^{-1}x \quad\Longleftrightarrow\quad \sin y = x \;\text{ and }\; -\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}$$

Read $\sin^{-1}x$ as **"the angle (between $-90^\circ$ and $90^\circ$) whose sine is $x$."**

- Domain: $-1 \le x \le 1$ (sine never leaves this range, so nothing else has an inverse-sine)
- Range: $-\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}$, i.e. $-90^\circ \le y \le 90^\circ$ — **Quadrants I and IV** (plus the axes)

## Evaluating exactly

$\sin^{-1}\!\big(\tfrac12\big)$: which angle in $[-90^\circ, 90^\circ]$ has sine $\tfrac12$? → $30^\circ = \tfrac{\pi}{6}$.

$\sin^{-1}\!\big(\!-\!\tfrac{\sqrt3}{2}\big)$: need a **negative** angle (QIV) with reference $60^\circ$ → $-60^\circ = -\tfrac{\pi}{3}$. **Not** $300^\circ$, **not** $240^\circ$ — those are outside the range.

$\sin^{-1}$ is an **odd** function: $\sin^{-1}(-x) = -\sin^{-1}(x)$.

## Compositions

- $\sin(\sin^{-1}x) = x$ for every $x$ in $[-1, 1]$ — always safe.
- $\sin^{-1}(\sin\theta) = \theta$ **only if** $\theta$ is already in $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$. Otherwise you get the angle in that range with the same sine: $\sin^{-1}(\sin 150^\circ) = 30^\circ$.

> **Common mistake:** answering $\sin^{-1}(-\tfrac12) = 210^\circ$ or $330^\circ$. The inverse **function** gives one value, and it must lie in $[-90^\circ, 90^\circ]$: the answer is $-30^\circ$. (Those show up in 2-10 when a problem asks for **all values** of $\sin^{-1}$, not just the principal value.)`,
    explore: {
      type: 'inverse', fn: 'sin', mode: 'deg',
      intro: 'Degree view of $y = \\sin^{-1}x$ alone. The horizontal dashed lines mark the range limits $\\pm 90^\\circ$. Toggle the whole relation to see what gets discarded.',
      tasks: r`1. Hover at $x = 0.5$, $x = -0.5$, $x = 0.87$, $x = -1$. Say the exact angle before reading the tooltip.
2. Turn on the whole relation. At $x = 0.5$, name the first two **positive** angles in the relation besides $30^\circ$.
3. Why does the curve get steep near $x = \pm 1$? (Think about how sine flattens at its peaks.)`
    },
    practice: [
      { q: r`Evaluate exactly, in both degrees and radians: $\sin^{-1}\!\big(\tfrac{\sqrt2}{2}\big)$, $\sin^{-1}(-1)$, $\sin^{-1}(0)$.`, hint: 'Range is [−90°, 90°].', answer: r`$45^\circ = \tfrac{\pi}{4}$; $-90^\circ = -\tfrac{\pi}{2}$; $0$`, solution: r`$\sin 45^\circ = \tfrac{\sqrt2}{2}$ ✓ and $45^\circ$ is in range. $\sin(-90^\circ) = -1$. $\sin 0 = 0$.` },
      { q: r`Evaluate $\sin^{-1}\!\big(\!-\!\tfrac12\big)$. A classmate answers $210^\circ$. What's wrong, and what's right?`, hint: 'Check the range.', answer: r`$-30^\circ = -\tfrac{\pi}{6}$. $210^\circ$ has the right sine but is outside $[-90^\circ, 90^\circ]$.`, solution: r`Need the angle in $[-90^\circ, 90^\circ]$ with sine $-\tfrac12$: that's in QIV, reference $30^\circ$, so $-30^\circ$.` },
      { q: r`Find $\sin^{-1}(\sin 160^\circ)$ and $\sin^{-1}(\sin 20^\circ)$.`, hint: 'Is the inner angle inside the range of sin⁻¹?', answer: r`$20^\circ$ and $20^\circ$`, solution: r`$\sin 160^\circ = \sin 20^\circ$ (same reference angle, both positive). $\sin^{-1}$ returns the angle in $[-90^\circ, 90^\circ]$ with that sine: $20^\circ$ in both cases.` },
      { q: r`Find $\sin\!\big(\sin^{-1}(0.3)\big)$ and $\sin^{-1}(\sin 2)$ (radians, 4 places).`, hint: 'First one is immediate. For the second, 2 rad is in QII.', answer: r`$0.3$ and $\approx 1.1416$`, solution: r`$\sin(\sin^{-1}x) = x$ for $x \in [-1,1]$, so $0.3$. For the second: $\sin 2 \approx 0.9093$; the angle in $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ with that sine is $\pi - 2 \approx 1.1416$.` },
      { q: r`Why is $\sin^{-1}(1.5)$ undefined?`, hint: 'What values can sine produce?', answer: r`No angle has sine $1.5$; the domain of $\sin^{-1}$ is $[-1, 1]$.`, solution: r`Sine is always between $-1$ and $1$, so there is no angle to return. Your calculator will show an error.` }
    ],
    quiz: [
      function (rng) {
        const n = rng.pick(NICE);
        const ans = Math.asin(n.v);
        const useDeg = rng.bool();
        return { type: 'number', parse: useDeg ? 'number' : 'pi', prompt: 'Evaluate exactly in ' + (useDeg ? 'degrees' : 'radians (type like `-pi/6`)') + ': $\\sin^{-1}\\left(' + n.tex + '\\right)$', answer: useDeg ? ans / DEG : ans, tol: useDeg ? 0.5 : 0.005, unit: useDeg ? '°' : '', answerText: useDeg ? M.fmt(ans / DEG) + '°' : M.formatPi(ans), explanation: r`Which angle in $[-90^\circ, 90^\circ]$ has sine $` + n.tex + '$? ' + (n.v < 0 ? 'Negative sine → QIV → a **negative** angle: ' : n.v > 0 ? 'Positive sine → QI: ' : '') + '$' + M.fmt(ans / DEG) + '^\\circ = ' + M.texPi(ans) + '$.' };
      },
      function (rng) {
        const n = rng.pick(NICE.filter(x => x.v < 0 && x.v > -1));
        const ans = Math.asin(n.v) / DEG;
        const ref = -ans;
        return { type: 'mc', prompt: 'Which is $\\sin^{-1}\\left(' + n.tex + '\\right)$ in degrees?', choices: [{ text: M.fmt(ans) + '°', correct: true }, { text: M.fmt(180 + ref) + '°', correct: false }, { text: M.fmt(360 - ref) + '°', correct: false }, { text: M.fmt(ref) + '°', correct: false }], explanation: r`All of $` + M.fmt(180 + ref) + '^\\circ$, $' + M.fmt(360 - ref) + '^\\circ$, and $' + M.fmt(ans) + r`^\circ$ have sine $` + n.tex + r`$, but only $` + M.fmt(ans) + r`^\circ$ is in the range $[-90^\circ, 90^\circ]$. $` + M.fmt(ref) + '^\\circ$ has the wrong sign.' };
      },
      function (rng) {
        const th = rng.pick([100, 120, 135, 150, 160, 200, 210, 225, 240, 300, 330, -100, -150, 400]);
        const inner = Math.sin(th * DEG);
        const ans = Math.asin(inner) / DEG;
        return { type: 'number', prompt: r`Evaluate $\sin^{-1}(\sin ` + th + r`^\circ)$ in degrees.`, answer: ans, tol: 0.5, unit: '°', answerText: M.fmt(ans) + '°', explanation: r`It is **not** $` + th + r`^\circ$ because that's outside $[-90^\circ, 90^\circ]$. $\sin ` + th + r`^\circ = ` + M.fmt(inner, 4) + r`$; the angle in range with that sine is $` + M.fmt(ans) + r`^\circ$ (same reference angle, placed in QI/QIV).` };
      },
      function (rng) {
        const x = rng.pick([0.2, 0.35, 0.5, 0.64, 0.8, -0.3, -0.45, -0.9, 1.2, -1.5]);
        const ok = Math.abs(x) <= 1;
        return { type: 'mc', prompt: 'Is $\\sin^{-1}(' + x + ')$ defined? If so, roughly how big is it?', choices: [{ text: 'Defined; between $-90^\\circ$ and $90^\\circ$', correct: ok }, { text: 'Defined; between $90^\\circ$ and $270^\\circ$', correct: false }, { text: 'Undefined', correct: !ok }], explanation: ok ? '$' + x + '$ is in $[-1, 1]$, so some angle in $[-90^\\circ, 90^\\circ]$ has that sine — about $' + M.fmt(Math.asin(x) / DEG, 1) + '^\\circ$.' : 'No angle has sine $' + x + '$; the domain of $\\sin^{-1}$ is $[-1, 1]$.' };
      }
    ]
  });

  sec.topics.push({
    id: '2-6-inverse-cos', title: 'The inverse cosine function cos⁻¹ x',
    notes: r`## Definition

$$y = \cos^{-1}x \quad\Longleftrightarrow\quad \cos y = x \;\text{ and }\; 0 \le y \le \pi$$

Read $\cos^{-1}x$ as **"the angle (between $0^\circ$ and $180^\circ$) whose cosine is $x$."**

- Domain: $-1 \le x \le 1$
- Range: $0 \le y \le \pi$, i.e. $0^\circ \le y \le 180^\circ$ — **Quadrants I and II**

## Evaluating exactly

$\cos^{-1}\!\big(\tfrac{\sqrt3}{2}\big) = 30^\circ = \tfrac{\pi}{6}$.

$\cos^{-1}\!\big(\!-\!\tfrac12\big)$: need an angle in $[0^\circ, 180^\circ]$ with cosine $-\tfrac12$ → QII, reference $60^\circ$ → $120^\circ = \tfrac{2\pi}{3}$. **Not** $-60^\circ$ (that's how sine would do it; negative angles are outside the cosine range).

$\cos^{-1}$ is **neither even nor odd**, but it has a nice symmetry: $\cos^{-1}(-x) = 180^\circ - \cos^{-1}(x)$.

## Compositions

- $\cos(\cos^{-1}x) = x$ for $x \in [-1,1]$.
- $\cos^{-1}(\cos\theta) = \theta$ **only if** $0 \le \theta \le \pi$. Otherwise: $\cos^{-1}(\cos 300^\circ) = 60^\circ$, $\cos^{-1}(\cos(-40^\circ)) = 40^\circ$.

## Sine vs. cosine: different homes for negatives

| **input** | **$\sin^{-1}$ gives** | **$\cos^{-1}$ gives** |
| --- | --- | --- |
| positive | QI angle ($0^\circ$ to $90^\circ$) | QI angle ($0^\circ$ to $90^\circ$) |
| negative | **QIV** angle ($-90^\circ$ to $0^\circ$) | **QII** angle ($90^\circ$ to $180^\circ$) |

> **Common mistake:** $\cos^{-1}(-\tfrac{\sqrt2}{2}) = -45^\circ$. Cosine's inverse never returns a negative angle. Answer: $135^\circ$.`,
    explore: {
      type: 'inverse', fn: 'cos', mode: 'deg',
      intro: 'Degree view of $y = \\cos^{-1}x$. Note the range $[0^\\circ, 180^\\circ]$ and that the graph is **decreasing**: bigger cosine ↔ smaller angle.',
      tasks: r`1. Hover at $x = 0.5$, $-0.5$, $0$, $-1$. Say the exact angle first.
2. Compare with $\sin^{-1}$ (switch functions): at $x = -0.5$ one gives $-30^\circ$ and the other $120^\circ$. Convince yourself each is in its own range.
3. Switch to radians (reflection view) and turn on the whole relation. The relation at $x = 0.5$ has points at $\pm\tfrac{\pi}{3}$ — why does the **function** keep only $+\tfrac{\pi}{3}$?`
    },
    practice: [
      { q: r`Evaluate exactly in degrees and radians: $\cos^{-1}\!\big(\tfrac12\big)$, $\cos^{-1}(-1)$, $\cos^{-1}(0)$.`, hint: 'Range is [0°, 180°].', answer: r`$60^\circ = \tfrac{\pi}{3}$; $180^\circ = \pi$; $90^\circ = \tfrac{\pi}{2}$`, solution: r`$\cos 60^\circ = \tfrac12$. $\cos 180^\circ = -1$. $\cos 90^\circ = 0$. All in $[0^\circ, 180^\circ]$.` },
      { q: r`Evaluate $\cos^{-1}\!\big(\!-\!\tfrac{\sqrt3}{2}\big)$. Explain why the answer isn't $-30^\circ$ or $210^\circ$.`, hint: 'QII angle with reference 30°.', answer: r`$150^\circ = \tfrac{5\pi}{6}$`, solution: r`$\cos(-30^\circ) = +\tfrac{\sqrt3}{2}$ — wrong sign entirely. $210^\circ$ has the right cosine but is outside $[0^\circ,180^\circ]$. The in-range angle with cosine $-\tfrac{\sqrt3}{2}$ is $180^\circ - 30^\circ = 150^\circ$.` },
      { q: r`Find $\cos^{-1}(\cos 250^\circ)$ and $\cos^{-1}(\cos(-70^\circ))$.`, hint: 'Find an angle in [0°, 180°] with the same cosine.', answer: r`$110^\circ$ and $70^\circ$`, solution: r`$\cos 250^\circ = \cos 110^\circ$ (reference $70^\circ$, both negative). $\cos(-70^\circ) = \cos 70^\circ$ (cosine is even).` },
      { q: r`Solve for $x$ exactly: $\cos^{-1}(2x - 1) = \tfrac{\pi}{3}$.`, hint: 'Take cosine of both sides.', answer: r`$x = \tfrac34$`, solution: r`$2x - 1 = \cos\tfrac{\pi}{3} = \tfrac12$, so $2x = \tfrac32$, $x = \tfrac34$.` },
      { q: r`For which $x$ is $\cos^{-1}(x) > 90^\circ$?`, hint: 'Where is cosine negative within [0°, 180°]?', answer: r`$-1 \le x < 0$`, solution: r`Angles between $90^\circ$ and $180^\circ$ have negative cosine. So $\cos^{-1}x$ exceeds $90^\circ$ exactly when $x < 0$ (and $x \ge -1$ to be defined).` }
    ],
    quiz: [
      function (rng) {
        const n = rng.pick(NICE);
        const ans = Math.acos(n.v);
        const useDeg = rng.bool();
        return { type: 'number', parse: useDeg ? 'number' : 'pi', prompt: 'Evaluate exactly in ' + (useDeg ? 'degrees' : 'radians (type like `5pi/6`)') + ': $\\cos^{-1}\\left(' + n.tex + '\\right)$', answer: useDeg ? ans / DEG : ans, tol: useDeg ? 0.5 : 0.005, unit: useDeg ? '°' : '', answerText: useDeg ? M.fmt(ans / DEG) + '°' : M.formatPi(ans), explanation: r`Which angle in $[0^\circ, 180^\circ]$ has cosine $` + n.tex + '$? ' + (n.v < 0 ? 'Negative cosine → QII: $180^\\circ - $ reference. ' : '') + '$' + M.fmt(ans / DEG) + '^\\circ = ' + M.texPi(ans) + '$.' };
      },
      function (rng) {
        const n = rng.pick(NICE.filter(x => x.v < 0 && x.v > -1));
        const ans = Math.acos(n.v) / DEG;
        const ref = 180 - ans;
        return { type: 'mc', prompt: 'Which is $\\cos^{-1}\\left(' + n.tex + '\\right)$ in degrees?', choices: [{ text: M.fmt(ans) + '°', correct: true }, { text: M.fmt(-ref) + '°', correct: false }, { text: M.fmt(180 + ref) + '°', correct: false }, { text: M.fmt(ref) + '°', correct: false }], explanation: r`$` + M.fmt(180 + ref) + r`^\circ$ has the right cosine but is outside $[0^\circ, 180^\circ]$. $` + M.fmt(-ref) + r`^\circ$ and $` + M.fmt(ref) + r`^\circ$ have cosine $+` + n.tex.replace('-', '') + r`$ (wrong sign). Answer: $` + M.fmt(ans) + '^\\circ$.' };
      },
      function (rng) {
        const th = rng.pick([200, 210, 225, 240, 250, 270, 300, 315, 330, -30, -60, -120, -150, 400, 390]);
        const inner = Math.cos(th * DEG);
        const ans = Math.acos(inner) / DEG;
        return { type: 'number', prompt: r`Evaluate $\cos^{-1}(\cos ` + th + r`^\circ)$ in degrees.`, answer: ans, tol: 0.5, unit: '°', answerText: M.fmt(ans) + '°', explanation: r`$` + th + r`^\circ$ is outside $[0^\circ, 180^\circ]$, so the answer is not $` + th + r`^\circ$. $\cos ` + th + r`^\circ = ` + M.fmt(inner, 4) + r`$, and the angle in $[0^\circ, 180^\circ]$ with that cosine is $` + M.fmt(ans) + r`^\circ$.` };
      },
      function (rng) {
        const n = rng.pick(NICE.filter(x => Math.abs(x.v) < 1));
        const a = rng.pick([2, 3, 4]); const b = rng.int(-3, 3);
        // solve cos⁻¹(a x + b) = θ  where cos θ = n.v  → x = (n.v − b)/a
        const th = Math.acos(n.v);
        const x = (n.v - b) / a;
        return { type: 'number', parse: 'exact', prompt: 'Solve for $x$: $\\cos^{-1}(' + a + 'x ' + (b >= 0 ? '+ ' + b : '- ' + (-b)) + ') = ' + M.texPi(th) + '$. (Exact; you may type a decimal to 3 places.)', answer: x, tol: 0.002, answerText: M.fmt(x, 4), explanation: r`Take cosine of both sides: $` + a + 'x ' + (b >= 0 ? '+ ' + b : '- ' + (-b)) + ' = \\cos' + M.texPi(th) + ' = ' + n.tex + '$. Solve: $x = (' + n.tex + (b >= 0 ? ' - ' + b : ' + ' + (-b)) + ')/' + a + ' \\approx ' + M.fmt(x, 4) + '$.' };
      }
    ]
  });

  sec.topics.push({
    id: '2-6-relations', title: 'How sin⁻¹ and cos⁻¹ relate',
    notes: r`## Complementary angles

In a right triangle the two acute angles add to $90^\circ$, and the sine of one is the cosine of the other. The inverse version:

$$\sin^{-1}x + \cos^{-1}x = \frac{\pi}{2} = 90^\circ \qquad (-1 \le x \le 1)$$

Check with $x = \tfrac12$: $30^\circ + 60^\circ = 90^\circ$ ✓. With $x = -\tfrac12$: $-30^\circ + 120^\circ = 90^\circ$ ✓ — it even works for negatives, which is exactly *why* the ranges were chosen the way they were.

## Symmetry rules

$$\sin^{-1}(-x) = -\sin^{-1}x \qquad\qquad \cos^{-1}(-x) = \pi - \cos^{-1}x$$

## Mixed compositions (triangle method)

To find $\cos(\sin^{-1}x)$: let $\theta = \sin^{-1}x$, so $\sin\theta = x = \tfrac{x}{1}$. Draw a right triangle with opposite $x$, hypotenuse $1$; the adjacent side is $\sqrt{1 - x^2}$. So

$$\cos(\sin^{-1}x) = \sqrt{1 - x^2} \qquad\text{and likewise}\qquad \sin(\cos^{-1}x) = \sqrt{1 - x^2}$$

Both are **non-negative** — because $\sin^{-1}$ lands in QI/QIV where cosine $\ge 0$, and $\cos^{-1}$ lands in QI/QII where sine $\ge 0$. Example: $\cos\!\big(\sin^{-1}\tfrac35\big) = \tfrac45$.

## The graphs

$y = \cos^{-1}x$ is $y = \sin^{-1}x$ **flipped upside down and raised** $90^\circ$: $\cos^{-1}x = \tfrac{\pi}{2} - \sin^{-1}x$. Same domain, same S-shape, opposite direction.

> **Common mistake:** assuming $\cos^{-1}$ is odd like $\sin^{-1}$. $\cos^{-1}(-x) \ne -\cos^{-1}x$ — the right-hand side would be negative, outside cosine's range.`,
    explore: {
      type: 'custom',
      intro: 'Both inverse functions on one set of axes (degrees). Drag the $x$ slider: the two angles always add to $90^\\circ$.',
      setup(container, L) {
        const { Graph, M, R } = L;
        const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
        const eq = R.el('div', { class: 'equation' }); root.appendChild(eq);
        const box = R.el('div'); root.appendChild(box);
        const g = new Graph(box, { xMin: -1.4, xMax: 1.4, yMin: -120, yMax: 200, xUnit: 'num', yUnit: 'deg', xStep: 0.5, yStep: 30, height: 380, interactive: false, margin: { l: 56, r: 14, t: 14, b: 30 } });
        const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
        const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
        const st = { x: 0.5, show: false };
        Graph.slider(sl, { label: 'x', min: -1, max: 1, step: 0.05, value: 0.5, onInput: v => { st.x = v; draw(); } });
        const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
        Graph.toggle(tg, 'Show the values', false, v => { st.show = v; draw(); });
        const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);
        function draw() {
          const a = Math.asin(st.x) / M.DEG, c = Math.acos(st.x) / M.DEG;
          g.update({
            fns: [
              { f: x => Math.asin(x) / M.DEG, domain: [-1, 1], label: 'y = sin⁻¹ x', width: 3 },
              { f: x => Math.acos(x) / M.DEG, domain: [-1, 1], label: 'y = cos⁻¹ x', width: 3, color: g.palette ? g.palette.accent3 : '#059669' }
            ],
            hlines: [{ y: 90, label: '90°' }],
            vlines: [{ x: st.x, dashed: true }],
            points: [{ x: st.x, y: a, label: st.show ? 'sin⁻¹ = ' + M.fmt(a, 1) + '°' : '' }, { x: st.x, y: c, color: g.palette ? g.palette.accent3 : '#059669', label: st.show ? 'cos⁻¹ = ' + M.fmt(c, 1) + '°' : '' }]
          });
          eq.innerHTML = R.tex('\\sin^{-1}x + \\cos^{-1}x = 90^\\circ', true);
          info.innerHTML = st.show
            ? '<div class="info-row"><span>sin⁻¹(' + M.fmt(st.x) + ')</span><strong>' + M.fmt(a, 2) + '°</strong></div><div class="info-row"><span>cos⁻¹(' + M.fmt(st.x) + ')</span><strong>' + M.fmt(c, 2) + '°</strong></div><div class="info-row"><span>sum</span><strong>' + M.fmt(a + c, 2) + '°</strong></div>'
            : '<div class="info-row"><span>x = ' + M.fmt(st.x) + '</span><strong>Predict both angles, then toggle to check.</strong></div>';
        }
        draw();
      },
      tasks: r`1. Set $x = 0.5$. Predict $\sin^{-1}$ and $\cos^{-1}$; check that they sum to $90^\circ$.
2. Set $x = -0.5$. Now one angle is negative. Does the sum still work? Why does the range choice for $\sin^{-1}$ make this possible?
3. Where do the two curves cross? What is $x$ there, and what is the angle?`
    },
    practice: [
      { q: r`Given $\sin^{-1}(0.6) \approx 36.87^\circ$, find $\cos^{-1}(0.6)$ without a calculator.`, hint: 'They add to 90°.', answer: r`$\approx 53.13^\circ$`, solution: r`$\cos^{-1}(0.6) = 90^\circ - 36.87^\circ = 53.13^\circ$.` },
      { q: r`Find $\cos\!\big(\sin^{-1}\tfrac{5}{13}\big)$ exactly.`, hint: 'Draw the triangle: opposite 5, hypotenuse 13.', answer: r`$\tfrac{12}{13}$`, solution: r`Let $\theta = \sin^{-1}\tfrac{5}{13}$. Opposite $5$, hypotenuse $13$, adjacent $\sqrt{169 - 25} = 12$. $\cos\theta = \tfrac{12}{13}$, positive because $\theta$ is in QI.` },
      { q: r`Find $\sin\!\big(\cos^{-1}(-\tfrac{3}{5})\big)$ exactly. Watch the sign.`, hint: 'cos⁻¹ of a negative lands in QII. What sign is sine there?', answer: r`$\tfrac45$`, solution: r`$\theta = \cos^{-1}(-\tfrac35)$ is in QII. Adjacent $-3$, hypotenuse $5$, opposite $4$. In QII sine is positive: $\tfrac45$.` },
      { q: r`Use the symmetry rules to rewrite $\cos^{-1}(-0.3)$ in terms of $\cos^{-1}(0.3)$, and $\sin^{-1}(-0.3)$ in terms of $\sin^{-1}(0.3)$.`, hint: 'One is odd, one is "180° minus".', answer: r`$\cos^{-1}(-0.3) = 180^\circ - \cos^{-1}(0.3)$; $\sin^{-1}(-0.3) = -\sin^{-1}(0.3)$`, solution: r`Numerically: $\cos^{-1}(0.3) \approx 72.54^\circ$ so $\cos^{-1}(-0.3) \approx 107.46^\circ$. $\sin^{-1}(0.3) \approx 17.46^\circ$ so $\sin^{-1}(-0.3) \approx -17.46^\circ$.` },
      { q: r`Write $y = \cos^{-1}x$ as a transformation of $y = \sin^{-1}x$.`, hint: 'Use the complementary identity.', answer: r`$y = 90^\circ - \sin^{-1}x$: reflect $\sin^{-1}$ across the $x$-axis, then shift up $90^\circ$.`, solution: r`From $\sin^{-1}x + \cos^{-1}x = 90^\circ$, $\cos^{-1}x = 90^\circ - \sin^{-1}x = -\sin^{-1}x + 90^\circ$.` }
    ],
    quiz: [
      function (rng) {
        const x = rng.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, -0.2, -0.4, -0.6, -0.8]);
        const give = rng.pick(['sin', 'cos']);
        const known = give === 'sin' ? Math.asin(x) / DEG : Math.acos(x) / DEG;
        const ans = 90 - known;
        const other = give === 'sin' ? 'cos' : 'sin';
        return { type: 'number', prompt: 'Given $\\' + give + '^{-1}(' + x + ') \\approx ' + M.fmt(known, 2) + '^\\circ$, find $\\' + other + '^{-1}(' + x + ')$ in degrees without a calculator.', answer: ans, tol: 0.1, unit: '°', answerText: M.fmt(ans, 2) + '°', explanation: r`$\sin^{-1}x + \cos^{-1}x = 90^\circ$, so $` + '\\' + other + '^{-1}(' + x + ') = 90^\\circ - ' + M.fmt(known, 2) + '^\\circ = ' + M.fmt(ans, 2) + '^\\circ$.' + (x < 0 ? ' Works even for negative $x$: one angle is negative (sine) and the other is obtuse (cosine).' : '') };
      },
      function (rng) {
        const trip = rng.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]]);
        const [a, b, c] = trip;
        const outer = rng.pick(['sin', 'cos']);
        const inner = outer === 'sin' ? 'cos' : 'sin';
        const neg = rng.bool(0.4);
        // inner(x) with x = ±a/c ; outer of that = b/c (always positive as explained)
        const xTex = (neg ? '-' : '') + '\\tfrac{' + a + '}{' + c + '}';
        return { type: 'number', prompt: 'Find exactly: $\\' + outer + '\\left(\\' + inner + '^{-1}' + xTex + '\\right)$. (Type a fraction like `4/5`.)', answer: b / c, tol: 0.002, answerText: b + '/' + c, explanation: r`Let $\theta = ` + '\\' + inner + '^{-1}' + xTex + '$. Triangle with ' + (inner === 'sin' ? 'opposite' : 'adjacent') + ' $' + a + '$, hypotenuse $' + c + '$, third side $\\sqrt{' + c + '^2 - ' + a + '^2} = ' + b + '$. So $\\' + outer + '\\theta = \\tfrac{' + b + '}{' + c + '}$, **positive** because ' + (inner === 'sin' ? '$\\sin^{-1}$ returns QI/QIV angles, where cosine is positive.' : '$\\cos^{-1}$ returns QI/QII angles, where sine is positive.') };
      },
      function (rng) {
        const fn = rng.pick(['sin', 'cos']);
        const x = rng.pick([0.3, 0.5, 0.7, 0.9]);
        const base = fn === 'sin' ? Math.asin(x) / DEG : Math.acos(x) / DEG;
        const correct = fn === 'sin' ? -base : 180 - base;
        const pool = [-base, 180 - base, base, 180 + base].map(v => M.fmt(v, 2) + '°');
        const choices = Array.from(new Set(pool)).map(t => ({ text: t, correct: t === M.fmt(correct, 2) + '°' }));
        return { type: 'mc', prompt: 'Given $\\' + fn + '^{-1}(' + x + ') \\approx ' + M.fmt(base, 2) + '^\\circ$, what is $\\' + fn + '^{-1}(-' + x + ')$?', choices, explanation: fn === 'sin' ? r`$\sin^{-1}$ is odd: $\sin^{-1}(-x) = -\sin^{-1}x = ` + M.fmt(correct, 2) + '^\\circ$ (a QIV angle).' : r`$\cos^{-1}(-x) = 180^\circ - \cos^{-1}x = ` + M.fmt(correct, 2) + '^\\circ$ (a QII angle). Cosine\'s inverse is never negative.' };
      },
      function (rng) {
        const x = rng.pick([0.5, Math.SQRT2 / 2, Math.sqrt(3) / 2, -0.5, -Math.SQRT2 / 2, -Math.sqrt(3) / 2]);
        const tex = M.formatExact(x, true);
        const s = Math.asin(x), c = Math.acos(x);
        return { type: 'number', parse: 'pi', prompt: 'Evaluate exactly (radians): $\\sin^{-1}\\left(' + tex + '\\right) + \\cos^{-1}\\left(' + tex + '\\right)$. Then also compute $\\cos^{-1}\\left(' + tex + '\\right) - \\sin^{-1}\\left(' + tex + '\\right)$ — enter **that difference**.', answer: c - s, tol: 0.005, answerText: M.formatPi(c - s), explanation: r`The sum is always $\tfrac{\pi}{2}$. The difference: $\cos^{-1} = ` + M.texPi(c) + '$, $\\sin^{-1} = ' + M.texPi(s) + '$, so the difference is $' + M.texPi(c - s) + '$.' };
      }
    ]
  });
})();
