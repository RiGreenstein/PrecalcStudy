/* Unit 2 — section 2-12: sinusoidal word problems. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { PI } = window.U2;
  const r = String.raw;
  const sec = { id: '2-12', title: 'Sinusoidal word problems', topics: [] };
  U.sections.push(sec);

  const SCENARIOS = [
    {
      name: 'Ferris wheel', xLabel: 't (seconds)', yLabel: 'height (m)', xVar: 't', yVar: 'h', xUnitName: 's',
      fn: 'cos', A: 15, B: 2 * PI / 40, C: 17, D: 20, xMin: 0, xMax: 90, yMin: -5, yMax: 40, xStep: 10, yStep: 5,
      description: r`A Ferris wheel of radius $15$ m has its center $17$ m above the ground. It turns once every $40$ s. At $t = 0$ you are at the **bottom**. (Where's the first high point? That's $D$ for a cosine.)`
    },
    {
      name: 'Tide', xLabel: 't (hours after midnight)', yLabel: 'depth (m)', xVar: 't', yVar: 'd', xUnitName: 'h',
      fn: 'cos', A: 1.8, B: 2 * PI / 12.4, C: 4.2, D: 3, xMin: 0, xMax: 30, yMin: 0, yMax: 7, xStep: 3, yStep: 1,
      description: r`High tide at a harbor is $6.0$ m at 3:00 a.m.; low tide is $2.4$ m, $6.2$ hours later. The pattern repeats every $12.4$ hours.`
    },
    {
      name: 'Daylight', xLabel: 'day of year', yLabel: 'hours of daylight', xVar: 'd', yVar: 'L', xUnitName: 'days',
      fn: 'cos', A: 3.1, B: 2 * PI / 365, C: 12.2, D: 172, xMin: 0, xMax: 400, yMin: 7, yMax: 17, xStep: 50, yStep: 1,
      description: r`A city gets $15.3$ hours of daylight on day $172$ (the longest day) and $9.1$ hours on the shortest day, half a year later. The cycle is $365$ days.`
    },
    {
      name: 'Spring', xLabel: 't (s)', yLabel: 'position (cm)', xVar: 't', yVar: 'y', xUnitName: 's',
      fn: 'cos', A: -6, B: 2 * PI / 1.5, C: 0, D: 0, xMin: 0, xMax: 4, yMin: -9, yMax: 9, xStep: 0.5, yStep: 3,
      description: r`A weight on a spring is pulled down $6$ cm below rest and released at $t = 0$. It bounces up to $6$ cm above rest and back once every $1.5$ s. (Starting at a **low** point with cosine means $A$ is negative — or shift $D$.)`
    }
  ];

  // generate a random ferris/tide-type scenario for quizzes
  function randomScenario(rng) {
    const kind = rng.pick(['wheel', 'tide', 'temp']);
    if (kind === 'wheel') {
      const R_ = rng.pick([10, 12, 15, 20, 25]), c = R_ + rng.pick([1, 2, 3, 5]), P = rng.pick([30, 40, 60, 90, 120]);
      const startBottom = rng.bool(0.7);
      return { kind, text: r`A Ferris wheel with radius $` + R_ + '$ m has its center $' + c + '$ m above the ground and makes one revolution every $' + P + '$ s. A rider boards at the ' + (startBottom ? '**lowest**' : '**highest**') + ' point at $t = 0$.', A: R_, C: c, P, D: startBottom ? P / 2 : 0, var: 't', unit: 'm', yName: 'height' };
    }
    if (kind === 'tide') {
      const hi = rng.pick([5, 5.5, 6, 6.5, 7]), lo = rng.pick([1, 1.5, 2, 2.5]), P = rng.pick([12, 12.4, 12.5]), tHi = rng.pick([1, 2, 3, 4, 5]);
      return { kind, text: r`High tide of $` + hi + '$ m occurs at $t = ' + tHi + '$ h; the next low tide is $' + lo + '$ m, $' + M.fmt(P / 2, 2) + '$ h later. Period $' + P + '$ h.', A: (hi - lo) / 2, C: (hi + lo) / 2, P, D: tHi, var: 't', unit: 'm', yName: 'depth' };
    }
    const hi = rng.pick([28, 30, 32, 35]), lo = rng.pick([-5, 0, 2, 5]), tHi = rng.pick([6, 7, 7.5]);
    return { kind, text: r`A city's average daily high temperature peaks at $` + hi + r`^\circ$C in month $` + tHi + '$ and bottoms out at $' + lo + r`^\circ$C six months later. Period $12$ months.`, A: (hi - lo) / 2, C: (hi + lo) / 2, P: 12, D: tHi, var: 'm', unit: '°C', yName: 'temperature' };
  }
  function eqTex(s) {
    const B = 2 * PI / s.P;
    const Btex = M.asPiFraction(B, 200) ? M.texPi(B, 200) : M.fmt(B, 4);
    return s.yName[0] + ' = ' + M.fmt(s.C) + ' + ' + M.fmt(s.A) + '\\cos\\big(' + Btex + '(' + s.var + ' - ' + M.fmt(s.D) + ')\\big)';
  }
  function model(s) { const B = 2 * PI / s.P; return x => s.C + s.A * Math.cos(B * (x - s.D)); }

  sec.topics.push({
    id: '2-12-word-problems', title: 'Sinusoidal models: sin/cos word problems',
    notes: r`## Translate the story into $A, B, C, D$

$$y = C + A\cos\big(B(t - D)\big)$$

| **letter** | **from the story** |
| --- | --- |
| $C$ | the **middle** value: $\dfrac{\max + \min}{2}$ (e.g. center height of a wheel, average depth) |
| $A$ | **half the swing**: $\dfrac{\max - \min}{2}$ (radius of the wheel, half the tidal range) |
| $B$ | $\dfrac{2\pi}{\text{period}}$ — the period is "one full revolution / one full cycle" in the story's time units. Use $2\pi$ because $t$ is a real number, not an angle. |
| $D$ | the time of a **maximum** (for cosine, $A > 0$). If the story gives a *minimum* time instead, either add half a period to get a max, or use $A < 0$ with $D$ at the minimum. |

**Calculator in radian mode.**

## Four standard questions

1. **Write the equation.** (above)
2. **Evaluate:** "height at $t = 7$?" → plug in.
3. **Solve for time:** "first time the height is $25$ m?" → set $C + A\cos(B(t - D)) = 25$, isolate the cosine, take **all values** of $\cos^{-1}$ (principal value with $\pm$, plus $2\pi n$), then pick the one the question wants.
4. **Interpret:** "how long is the rider above $25$ m per revolution?" → the gap between two consecutive solutions.

## Worked example: solving for time

Wheel: $h = 17 + 15\cos\!\big(\tfrac{2\pi}{40}(t - 20)\big)$. When is $h = 25$ for the first time, $t \ge 0$?

$$15\cos\!\big(\tfrac{\pi}{20}(t - 20)\big) = 8 \;\Rightarrow\; \cos\!\big(\tfrac{\pi}{20}(t - 20)\big) = \tfrac{8}{15}$$

$$\tfrac{\pi}{20}(t - 20) = \pm\cos^{-1}\tfrac{8}{15} + 2\pi n = \pm 1.0062 + 2\pi n$$

$$t - 20 = \pm 6.406 + 40n \;\Rightarrow\; t = 20 \pm 6.406 + 40n = 13.59,\ 26.41,\ 53.59,\ \ldots$$

First time: $t \approx 13.6$ s. Above $25$ m from $13.59$ to $26.41$: about $12.8$ s per revolution.

> **Common mistake:** $B = 360/\text{period}$. The variable is time, not degrees — use $2\pi$. If your calculator is in degree mode, the numbers will look plausible and be completely wrong.

> **Common mistake:** stopping at the calculator's one $\cos^{-1}$ value. It gives $t = 26.41$ here (via the $+$ branch) — but the *first* time is $13.59$, from the $-$ branch. Always write both families, then choose.

> **Common mistake:** forgetting to undo $B$ and $D$. After taking $\cos^{-1}$ you have $B(t - D)$, not $t$. Divide by $B$, then add $D$.`,
    explore: {
      type: 'model', scenarios: SCENARIOS,
      intro: 'Four real-world sinusoids with real-world axes. The equation is hidden: read max, min, period, and a maximum time from the graph and the story, write $A, B, C, D$, then reveal. Use **Probe** to evaluate the model at any $t$.',
      tasks: r`1. **Ferris wheel:** write the equation from the story. Reveal to check. Probe $t = 7$ — the height should match $h(7)$ from your equation.
2. **Tide:** the first high tide is at $t = 3$. What is $D$? What's the depth at noon ($t = 12$)? Probe to check.
3. **Spring:** this one starts at a low point. Write it two ways: with $A < 0$ and $D = 0$, and with $A > 0$ and a shifted $D$.
4. **Daylight:** on what day is daylight exactly $12.2$ hours (the axis)? There are two per year — find both by hand, then probe.`
    },
    practice: [
      { q: r`A Ferris wheel of radius $12$ m has its lowest point $2$ m above the ground and rotates once every $60$ s. You board at the bottom at $t = 0$. Write $h(t)$ in cosine form.`,
        hint: 'Center height = 2 + 12. First max is half a period after t = 0.',
        answer: r`$h = 14 + 12\cos\!\big(\tfrac{\pi}{30}(t - 30)\big)$ (or $h = 14 - 12\cos\tfrac{\pi}{30}t$)`,
        solution: r`$C = 2 + 12 = 14$, $A = 12$, $B = 2\pi/60 = \tfrac{\pi}{30}$. Starting at the bottom, the first top is at $t = 30$, so $D = 30$. Equivalently use $A = -12$, $D = 0$.` },
      { q: r`Using the wheel above, find your height at $t = 10$ s and at $t = 45$ s.`,
        hint: 'Radian mode.',
        answer: r`$h(10) = 8$ m; $h(45) = 14$ m`,
        solution: r`$h(10) = 14 + 12\cos(\tfrac{\pi}{30}(-20)) = 14 + 12\cos(-\tfrac{2\pi}{3}) = 14 + 12(-\tfrac12) = 8$. $h(45) = 14 + 12\cos(\tfrac{\pi}{30} \cdot 15) = 14 + 12\cos\tfrac{\pi}{2} = 14$.` },
      { q: r`Using the wheel above, find the first two times you are exactly $20$ m high.`,
        hint: 'Isolate cosine, then take ±cos⁻¹ and add 2πn.',
        answer: r`$t \approx 20.0$ s and $40.0$ s`,
        solution: r`$12\cos(\tfrac{\pi}{30}(t - 30)) = 6 \Rightarrow \cos(\ldots) = \tfrac12 \Rightarrow \tfrac{\pi}{30}(t - 30) = \pm\tfrac{\pi}{3} + 2\pi n \Rightarrow t - 30 = \pm 10 + 60n \Rightarrow t = 20, 40, 80, 100, \ldots$` },
      { q: r`The depth of water at a dock is $5.5$ m at high tide (2:00 a.m.) and $1.5$ m at low tide (8:12 a.m.). Write $d(t)$ with $t$ in hours after midnight, and find the depth at 5:00 a.m.`,
        hint: 'High to low is half a period: 6.2 h.',
        answer: r`$d = 3.5 + 2\cos\!\big(\tfrac{2\pi}{12.4}(t - 2)\big)$; $d(5) \approx 3.52$ m`,
        solution: r`$C = 3.5$, $A = 2$, period $= 2 \times 6.2 = 12.4$ h so $B = 2\pi/12.4 \approx 0.5067$, $D = 2$. $d(5) = 3.5 + 2\cos(0.5067 \cdot 3) \approx 3.5 + 2(0.0127) \approx 3.52$.` },
      { q: r`For the dock above, a boat needs at least $4$ m of water. Between what times (after the 2:00 a.m. high tide) can it dock? How long is that window?`,
        hint: 'Solve d = 4 for the two times around t = 2.',
        answer: r`From $t \approx -0.60$ h (about 11:24 p.m. the night before) to $t \approx 4.60$ h (about 4:36 a.m.); window $\approx 5.2$ h. The next window begins $12.4$ h later.`,
        solution: r`$2\cos(B(t - 2)) = 0.5 \Rightarrow \cos(B(t - 2)) = 0.25 \Rightarrow B(t - 2) = \pm\cos^{-1}(0.25) + 2\pi n = \pm 1.3181 + 2\pi n$. Divide by $B = 0.5067$: $t - 2 = \pm 2.60 + 12.4n$, so $t = -0.60$ or $4.60$ (then $11.80$, $17.00$, …). The depth is above $4$ m *between* those two times around the high tide at $t = 2$: a window of $2 \times 2.60 = 5.2$ h.` },
      { q: r`The temperature in a city averages a high of $31^\circ$C in July (month 7) and a low of $-1^\circ$C in January (month 1). Write $T(m)$ and predict the temperature in April (month 4).`,
        hint: 'Period 12. Max at m = 7.',
        answer: r`$T = 15 + 16\cos\!\big(\tfrac{\pi}{6}(m - 7)\big)$; $T(4) = 15^\circ$C`,
        solution: r`$C = (31 + (-1))/2 = 15$, $A = 16$, $B = 2\pi/12 = \tfrac{\pi}{6}$, $D = 7$. $T(4) = 15 + 16\cos(\tfrac{\pi}{6}(-3)) = 15 + 16\cos(-\tfrac{\pi}{2}) = 15$. April sits on the axis — halfway between the extremes.` }
    ],
    quiz: [
      // write equation
      function (rng) {
        const s = randomScenario(rng);
        const B = 2 * PI / s.P;
        return {
          type: 'multi', prompt: s.text + r` Model the ` + s.yName + r` as $y = C + A\cos\big(B(` + s.var + ' - D)\\big)$ with $A > 0$.',
          fields: [{ label: '$A$', answer: s.A, tol: 0.01 }, { label: '$B$ (4 decimals or exact, e.g. `pi/20`)', parse: 'pi', answer: B, tol: 0.002, answerText: M.fmt(B, 4) }, { label: '$C$', answer: s.C, tol: 0.01 }, { label: '$D$ (any valid value)', answer: s.D, modulo: s.P, tol: 0.05, answerText: M.fmt(s.D) + ' (± ' + s.P + 'n)' }],
          explanation: r`$C = \frac{\max + \min}{2} = ` + M.fmt(s.C) + r`$, $A = \frac{\max - \min}{2} = ` + M.fmt(s.A) + r`$, $B = 2\pi / ` + s.P + ' = ' + M.fmt(B, 4) + r`$, and $D$ = a time of **maximum**: $` + M.fmt(s.D) + '$' + (s.kind === 'wheel' && s.D !== 0 ? ' (boarding at the bottom, the first top is half a period later).' : '.') + ' So $' + eqTex(s) + '$.'
        };
      },
      // evaluate at time
      function (rng) {
        const s = randomScenario(rng);
        const t = rng.pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]);
        const y = model(s)(t);
        return {
          type: 'number', prompt: s.text + ' Find the ' + s.yName + ' at $' + s.var + ' = ' + t + '$. (Round to 2 decimals.)',
          answer: y, tol: 0.03, answerText: M.fmt(y, 2) + ' ' + s.unit, unit: s.unit,
          explanation: r`Model: $` + eqTex(s) + r`$. Plug in $` + s.var + ' = ' + t + r`$ in **radian** mode: inside $= ` + M.fmt(2 * PI / s.P * (t - s.D), 4) + r`$, cosine $= ` + M.fmt(Math.cos(2 * PI / s.P * (t - s.D)), 4) + r`$, so $y = ` + M.fmt(s.C) + ' + ' + M.fmt(s.A) + r` \times ` + M.fmt(Math.cos(2 * PI / s.P * (t - s.D)), 4) + ' = ' + M.fmt(y, 2) + '$.'
        };
      },
      // first time reaching a value
      function (rng) {
        const s = randomScenario(rng);
        const frac = rng.pick([0.25, 0.4, 0.5, 0.6, 0.75, -0.3, -0.5]);
        const target = M.round(s.C + s.A * frac, 1);
        const k = (target - s.C) / s.A;
        const B = 2 * PI / s.P;
        const p = Math.acos(k);
        const times = [];
        for (let n = -2; n <= 3; n++) [p, -p].forEach(sg => { const t = s.D + (sg + 2 * PI * n) / B; if (t >= -1e-9) times.push(t); });
        times.sort((a, b) => a - b);
        const first = times[0], second = times[1];
        return {
          type: 'multi', prompt: s.text + ' Find the **first two** times ($' + s.var + ' \\ge 0$) when the ' + s.yName + ' is exactly $' + target + '$ ' + s.unit + '. (2 decimals.)',
          fields: [{ label: 'first time', answer: first, tol: 0.05, answerText: M.fmt(first, 2) }, { label: 'second time', answer: second, tol: 0.05, answerText: M.fmt(second, 2) }],
          explanation: r`$` + eqTex(s) + ' = ' + target + r`$ → $\cos\big(B(` + s.var + ' - ' + M.fmt(s.D) + r`)\big) = ` + M.fmt(k, 4) + r`$ → $B(` + s.var + ' - ' + M.fmt(s.D) + r`) = \pm ` + M.fmt(p, 4) + r` + 2\pi n$ → $` + s.var + ' = ' + M.fmt(s.D) + r` \pm ` + M.fmt(p / B, 3) + ' + ' + s.P + r`n$. Listing the non-negative ones in order: $` + times.slice(0, 3).map(t => M.fmt(t, 2)).join(',\\ ') + ', \\ldots$'
        };
      },
      // duration above a value per cycle
      function (rng) {
        const s = randomScenario(rng);
        const frac = rng.pick([0.25, 0.5, 0.6, 0.75, 0]);
        const target = M.round(s.C + s.A * frac, 1);
        const k = (target - s.C) / s.A;
        const B = 2 * PI / s.P;
        const p = Math.acos(k);
        const dur = 2 * p / B;
        return {
          type: 'number', prompt: s.text + ' For how long during **each cycle** is the ' + s.yName + ' **above** $' + target + '$ ' + s.unit + '? (2 decimals.)',
          answer: dur, tol: 0.05, answerText: M.fmt(dur, 2),
          explanation: r`The ` + s.yName + r` is above $` + target + r`$ between the two solutions around a maximum: $` + s.var + ' = D \\pm ' + M.fmt(p / B, 3) + r`$. That interval has length $2 \times ` + M.fmt(p / B, 3) + ' = ' + M.fmt(dur, 2) + r`$ out of each period of $` + s.P + '$.' + (frac === 0 ? ' (Above the axis exactly half the time — makes sense.)' : '')
        };
      },
      // concept MC
      function (rng) {
        const P = rng.pick([20, 24, 30, 40, 60, 365, 12, 12.4]);
        const good = M.asPiFraction(2 * PI / P, 400) ? M.texPi(2 * PI / P, 400) : M.fmt(2 * PI / P, 4);
        const choices = [
          { text: '$B = ' + good + '$', correct: true },
          { text: '$B = ' + M.fmt(360 / P, 3) + '$', correct: false },
          { text: '$B = ' + M.fmt(P, 2) + '$', correct: false },
          { text: '$B = ' + M.fmt(P / (2 * PI), 4) + '$', correct: false }
        ];
        return { type: 'mc', prompt: 'A real-world quantity repeats every $' + P + '$ time units. Which $B$ goes in $y = C + A\\cos(B(t - D))$?', choices, explanation: r`$t$ is a real number, so the parent period is $2\pi$: $B = 2\pi / ` + P + ' = ' + good + r`$. $360/P$ would only be right if $t$ were measured in degrees — it isn't.` };
      }
    ]
  });
})();
