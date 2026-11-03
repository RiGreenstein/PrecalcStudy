/* Unit 2 — section 2-5 (part a): radian measure, rad → deg, deg → rad. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { PI, DEG } = window.U2;
  const r = String.raw;
  const sec = { id: '2-5', title: 'Radian measure', topics: [] };
  U.sections.push(sec);

  const NICE_DEG = [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360, 15, 75, 105, 20, 40, 72, 100, 144];

  // ---- Radian measure (concept) ----
  sec.topics.push({
    id: '2-5-radians', title: 'Radian measure',
    notes: r`## What a radian is

Wrap the radius of a circle along its edge. The angle that arc opens up is **one radian**.

$$\theta \text{ (in radians)} = \frac{\text{arc length}}{\text{radius}} = \frac{s}{r}$$

Because the whole circumference is $2\pi r$, a full turn is $\dfrac{2\pi r}{r} = 2\pi$ radians. So:

$$2\pi \text{ rad} = 360^\circ \qquad \pi \text{ rad} = 180^\circ \qquad 1 \text{ rad} \approx 57.3^\circ$$

A radian is a **ratio of two lengths**, so it has no units. That's the whole point: it lets $x$ in $y = \sin x$ be an ordinary real number, which is what you need for the calculus-style graphs in 2-7.

## Landmarks to know cold

| **Degrees** | $0^\circ$ | $30^\circ$ | $45^\circ$ | $60^\circ$ | $90^\circ$ | $180^\circ$ | $270^\circ$ | $360^\circ$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Radians** | $0$ | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{4}$ | $\tfrac{\pi}{3}$ | $\tfrac{\pi}{2}$ | $\pi$ | $\tfrac{3\pi}{2}$ | $2\pi$ |

Think in **fractions of a half-turn**: $\tfrac{\pi}{6}$ is a sixth of $180^\circ$, $\tfrac{2\pi}{3}$ is two-thirds of $180^\circ$ ($= 120^\circ$), $\tfrac{5\pi}{4}$ is one-and-a-quarter half-turns ($= 225^\circ$).

> **Common mistake:** treating $\pi$ as "180" and forgetting it's also a number $\approx 3.14$. The angle $3$ radians is a real angle — about $172^\circ$, just short of a half-turn. If a problem says "$\theta = 2$" with no degree sign, it means **2 radians**.

## Quadrant from a radian measure

Compare to the landmarks: $\tfrac{\pi}{2} \approx 1.57$, $\pi \approx 3.14$, $\tfrac{3\pi}{2} \approx 4.71$, $2\pi \approx 6.28$. So $\theta = 2$ is in QII, $\theta = 4$ is in QIII, $\theta = 5$ is in QIV.`,
    explore: {
      type: 'unitCircle', startDeg: 57.2958, snap: 0, showValues: true,
      intro: r`Drag the point. The readout shows the angle in degrees, radians (as a $\pi$-fraction when it's a nice one), and the arc length on the unit circle. Notice: **arc length equals the radian measure** when $r = 1$. Type an angle like \`7pi/6\` or \`210\` and press Go.`,
      tasks: r`1. Choose "free" snapping and drag until the arc length reads about $1.00$. What is the angle in degrees? That's one radian.
2. Type \`3\` (three radians). Which quadrant? Compare with $\pi \approx 3.14$.
3. Switch to "snap 30°/45°". Go around the circle and *say* each radian measure before reading it.`
    },
    practice: [
      { q: 'A circle has radius 5 cm. An arc on it is 12 cm long. What is the central angle in radians? In degrees (to the nearest tenth)?', hint: 'θ = s / r. Then multiply by 180/π.', answer: r`$2.4$ radians $\approx 137.5^\circ$`, solution: r`$\theta = 12/5 = 2.4$ rad. In degrees: $2.4 \cdot \tfrac{180}{\pi} \approx 137.5^\circ$.` },
      { q: r`Without converting to degrees, state the quadrant of each angle: $\theta = 1$, $\theta = 2.5$, $\theta = 4$, $\theta = 6$.`, hint: 'Compare with π/2 ≈ 1.57, π ≈ 3.14, 3π/2 ≈ 4.71, 2π ≈ 6.28.', answer: 'QI, QII, QIII, QIV', solution: r`$1 < 1.57$ → QI. $1.57 < 2.5 < 3.14$ → QII. $3.14 < 4 < 4.71$ → QIII. $4.71 < 6 < 6.28$ → QIV.` },
      { q: r`How many radians is one and a half full revolutions? Give an exact answer.`, hint: 'One revolution is 2π.', answer: r`$3\pi$`, solution: r`$1.5 \times 2\pi = 3\pi$ radians (equivalently $540^\circ$).` },
      { q: r`Explain why a radian is about $57^\circ$ and not some "nicer" number.`, hint: 'How many radii fit around a circle?', answer: r`Because $2\pi \approx 6.28$ radii fit around the circle, each radian is $360^\circ / 6.28 \approx 57.3^\circ$.`, solution: r`A radian is defined geometrically (arc = radius), not chosen to be a convenient fraction of a turn. Since the circumference is $2\pi$ radii, one radian is $\tfrac{1}{2\pi}$ of a turn $= \tfrac{360^\circ}{2\pi} \approx 57.3^\circ$.` }
    ],
    quiz: [
      function (rng) {
        const rad = rng.pick([3, 4, 5, 6, 7, 8, 10, 12]);
        const s = rad * rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 0.25]);
        const th = s / rad;
        return { type: 'number', prompt: r`A circle has radius $` + rad + '$. An arc of length $' + M.fmt(s) + '$ subtends what central angle, in **radians**?', answer: th, tol: 0.01, answerText: M.fmt(th, 3) + ' rad', explanation: r`$\theta = s/r = ` + M.fmt(s) + '/' + rad + ' = ' + M.fmt(th, 3) + '$. No degrees involved — radians are a length ratio.' };
      },
      function (rng) {
        const th = rng.pick([0.5, 1, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9]);
        const n = M.normalizeRad(th);
        const q = n < PI / 2 ? 1 : n < PI ? 2 : n < 3 * PI / 2 ? 3 : 4;
        return { type: 'mc', prompt: r`Without a calculator, in which quadrant does the angle $\theta = ` + th + '$ (radians) terminate?', choices: [1, 2, 3, 4].map(k => ({ text: 'Quadrant ' + 'I II III IV'.split(' ')[k - 1], correct: k === q })), explanation: r`Landmarks: $\tfrac{\pi}{2} \approx 1.57$, $\pi \approx 3.14$, $\tfrac{3\pi}{2} \approx 4.71$, $2\pi \approx 6.28$.` + (th > 2 * PI ? ' First subtract $2\\pi$: $' + th + ' - 6.28 \\approx ' + M.fmt(n, 2) + '$.' : '') + ' That puts $\\theta$ in quadrant ' + 'I II III IV'.split(' ')[q - 1] + '.' };
      },
      function (rng) {
        const turns = rng.pick([0.25, 0.5, 0.75, 1.5, 2, 2.5, 3, 1 / 3, 1 / 6, 1 / 8]);
        const ans = turns * 2 * PI;
        const txt = { 0.25: 'a quarter', 0.5: 'half', 0.75: 'three-quarters of', 1.5: 'one and a half', 2: 'two', 2.5: 'two and a half', 3: 'three' }[turns] || (Math.abs(turns - 1 / 3) < 1e-9 ? 'one-third of' : Math.abs(turns - 1 / 6) < 1e-9 ? 'one-sixth of' : 'one-eighth of');
        return { type: 'number', parse: 'pi', prompt: 'How many radians is **' + txt + '** a revolution? Give an exact answer (like `3pi/4`).', answer: ans, tol: 0.01, answerText: M.formatPi(ans), explanation: r`One revolution $= 2\pi$. Multiply: $` + M.fmt(turns, 4) + r` \times 2\pi = ` + M.texPi(ans) + '$.' };
      },
      function (rng) {
        const rad = rng.pick([2, 3, 4, 6, 10]);
        const th = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]);
        return { type: 'number', prompt: r`A central angle of $` + th + '$ radians in a circle of radius $' + rad + '$ cuts off an arc of what length?', answer: th * rad, tol: 0.01, answerText: M.fmt(th * rad), explanation: r`$s = r\theta = ` + rad + r` \cdot ` + th + ' = ' + M.fmt(th * rad) + '$. (This only works with $\\theta$ in radians.)' };
      }
    ]
  });

  // ---- Radians → degrees ----
  sec.topics.push({
    id: '2-5-rad-to-deg', title: 'Converting radians to degrees',
    notes: r`## The rule

$$\text{degrees} = \text{radians} \times \frac{180^\circ}{\pi}$$

Since $\pi$ rad $= 180^\circ$, **replace every $\pi$ with $180^\circ$**:

- $\dfrac{5\pi}{6} = \dfrac{5 \cdot 180^\circ}{6} = 150^\circ$
- $\dfrac{7\pi}{4} = \dfrac{7 \cdot 180^\circ}{4} = 315^\circ$
- $-\dfrac{\pi}{3} = -60^\circ$

## When there's no $\pi$

$2$ radians $= 2 \times \dfrac{180^\circ}{\pi} \approx 114.59^\circ$. Use a calculator. (Your calculator may have a built-in conversion, but you must still know the formula.)

> **Common mistake:** $\dfrac{\pi}{6} \to 30^\circ$ is memorized, but $\dfrac{\pi}{6}$ and $\dfrac{6}{\pi}$ get confused under pressure. If a fraction has $\pi$ *on top*, it's a nice angle; if $\pi$ is on the bottom, it's a weird decimal — pause and re-read.

> **Common mistake:** multiplying by $\pi/180$ instead. Sanity check: radian numbers are small ($2\pi \approx 6.28$ is a full turn); degree numbers are big. Converting *to* degrees should make the number **bigger**.`,
    explore: {
      type: 'unitCircle', startDeg: 150, snap: 'nice', showValues: false,
      intro: 'Self-test mode: values are hidden. Type a radian measure like `5pi/6`, press Go, say the degree measure out loud, then **Reveal**.',
      tasks: r`1. Type \`5pi/6\`, \`7pi/4\`, \`4pi/3\`, \`11pi/6\` one at a time. Predict degrees before revealing.
2. Type \`2\` (two radians). Estimate the degrees ($\approx 57^\circ$ each). Reveal.
3. Type \`-pi/3\`. Where does the angle land? What positive degree angle is coterminal?`
    },
    practice: [
      { q: r`Convert $\dfrac{11\pi}{6}$ to degrees.`, hint: 'Replace π with 180°.', answer: r`$330^\circ$`, solution: r`$\dfrac{11 \cdot 180^\circ}{6} = 11 \cdot 30^\circ = 330^\circ$.` },
      { q: r`Convert $-\dfrac{3\pi}{4}$ to degrees, then give a coterminal angle between $0^\circ$ and $360^\circ$.`, hint: 'Negative means clockwise. Add 360° to get a positive coterminal angle.', answer: r`$-135^\circ$; coterminal with $225^\circ$`, solution: r`$-\dfrac{3 \cdot 180^\circ}{4} = -135^\circ$. $-135^\circ + 360^\circ = 225^\circ$.` },
      { q: r`Convert $2.5$ radians to degrees, to the nearest hundredth.`, hint: 'Multiply by 180/π.', answer: r`$\approx 143.24^\circ$`, solution: r`$2.5 \times \dfrac{180}{\pi} = \dfrac{450}{\pi} \approx 143.24^\circ$.` },
      { q: r`Convert $\dfrac{\pi}{10}$ and $\dfrac{10}{\pi}$ to degrees. Which is the "nice" one?`, hint: 'Only one has π in the numerator.', answer: r`$\dfrac{\pi}{10} = 18^\circ$; $\dfrac{10}{\pi} \approx 182.38^\circ$`, solution: r`$\dfrac{\pi}{10} = \dfrac{180^\circ}{10} = 18^\circ$ — nice. $\dfrac{10}{\pi}$ radians $= \dfrac{10}{\pi} \cdot \dfrac{180^\circ}{\pi} = \dfrac{1800^\circ}{\pi^2} \approx 182.38^\circ$ — not nice.` }
    ],
    quiz: [
      function (rng) {
        const d = rng.pick(NICE_DEG) * rng.pick([1, 1, 1, -1]);
        const rad = d * DEG;
        return { type: 'number', prompt: 'Convert $' + M.texPi(rad) + '$ radians to degrees.', answer: d, tol: 0.01, unit: '°', answerText: d + '°', explanation: r`Replace $\pi$ with $180^\circ$: $` + M.texPi(rad).replace(/\\pi/g, '(180^\\circ)') + ' = ' + d + r`^\circ$.` };
      },
      function (rng) {
        const th = rng.pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.2, 2.5, 3, 3.5, 4, 4.2, 5, 5.5, 6]);
        const d = th * 180 / PI;
        return { type: 'number', prompt: 'Convert $' + th + '$ radians to degrees (nearest hundredth).', answer: d, tol: 0.05, unit: '°', answerText: M.fmt(d, 2) + '°', explanation: r`$` + th + r` \times \dfrac{180^\circ}{\pi} \approx ` + M.fmt(d, 2) + r`^\circ$. Sanity check: $1$ rad $\approx 57.3^\circ$, so $` + th + r`$ rad should be about $` + M.fmt(th * 57.3, 0) + r`^\circ$.` };
      },
      function (rng) {
        const d = rng.pick(NICE_DEG);
        const rad = d * DEG;
        const pool = [M.fmt(rad, 3), String(360 - d), String(d / 2), String(2 * d), String(180 - d)].filter(t => t !== String(d) && +t > 0);
        const uniq = Array.from(new Set(pool)).slice(0, 3);
        const choices = [{ text: d + '°', correct: true }].concat(uniq.map(t => ({ text: t + '°', correct: false })));
        return { type: 'mc', prompt: 'Which is $' + M.texPi(rad) + '$ in degrees?', choices, explanation: r`$\pi \to 180^\circ$: $` + M.texPi(rad).replace(/\\pi/g, '(180^\\circ)') + ' = ' + d + r`^\circ$. Converting to degrees should make the number larger; one option is just the radian value with a degree sign stuck on.` };
      }
    ]
  });

  // ---- Degrees → radians ----
  sec.topics.push({
    id: '2-5-deg-to-rad', title: 'Converting degrees to radians',
    notes: r`## The rule

$$\text{radians} = \text{degrees} \times \frac{\pi}{180^\circ}$$

Write the degrees over $180$, **reduce the fraction**, then attach $\pi$:

- $150^\circ = \dfrac{150}{180}\pi = \dfrac{5}{6}\pi = \dfrac{5\pi}{6}$
- $225^\circ = \dfrac{225}{180}\pi = \dfrac{5\pi}{4}$
- $-30^\circ = -\dfrac{30}{180}\pi = -\dfrac{\pi}{6}$

Leave answers **exact** (with $\pi$) unless told to round. $150^\circ \approx 2.618$ is correct but hides the structure; $\dfrac{5\pi}{6}$ shows it instantly.

## Non-special angles

$37^\circ = \dfrac{37\pi}{180}$ — that doesn't reduce, and that's fine. As a decimal: $\approx 0.6458$.

## Shortcut via landmarks

$30^\circ = \tfrac{\pi}{6}$, so $210^\circ = 7 \times 30^\circ = \tfrac{7\pi}{6}$. $45^\circ = \tfrac{\pi}{4}$, so $315^\circ = 7 \times 45^\circ = \tfrac{7\pi}{4}$.

> **Common mistake:** forgetting the $\pi$. $\dfrac{150}{180} = \dfrac56$ is **not** the answer; $\dfrac{5\pi}{6}$ is. Radian answers for "degree-y" angles almost always have a $\pi$ in them.`,
    explore: {
      type: 'unitCircle', startDeg: 210, snap: 'nice', showValues: false,
      intro: 'Self-test mode. Type a degree measure (e.g. `210`), say the exact radian measure, then **Reveal**.',
      tasks: r`1. Go through $30^\circ, 60^\circ, 90^\circ, \ldots, 330^\circ$ (multiples of $30^\circ$). Say each in radians.
2. Then $45^\circ, 135^\circ, 225^\circ, 315^\circ$.
3. Type \`-120\`. Give the radian measure (negative), then a positive coterminal radian measure.`
    },
    practice: [
      { q: r`Convert $240^\circ$ to radians (exact).`, hint: 'Over 180, reduce, attach π.', answer: r`$\dfrac{4\pi}{3}$`, solution: r`$\dfrac{240}{180} = \dfrac{4}{3}$, so $240^\circ = \dfrac{4\pi}{3}$.` },
      { q: r`Convert $-315^\circ$ to radians (exact).`, hint: 'Same process; keep the sign.', answer: r`$-\dfrac{7\pi}{4}$`, solution: r`$\dfrac{315}{180} = \dfrac{7}{4}$, so $-315^\circ = -\dfrac{7\pi}{4}$.` },
      { q: r`Convert $75^\circ$ to radians, exactly and as a decimal to four places.`, hint: '75/180 reduces by 15.', answer: r`$\dfrac{5\pi}{12} \approx 1.3090$`, solution: r`$\dfrac{75}{180} = \dfrac{5}{12}$. So $\dfrac{5\pi}{12} \approx 1.3090$.` },
      { q: r`Convert $1000^\circ$ to radians (exact), then find a coterminal angle in $[0, 2\pi)$.`, hint: 'Reduce 1000/180. Then subtract multiples of 2π.', answer: r`$\dfrac{50\pi}{9}$; coterminal with $\dfrac{14\pi}{9}$`, solution: r`$\dfrac{1000}{180} = \dfrac{50}{9}$, so $\dfrac{50\pi}{9}$. Subtract $2\pi = \dfrac{18\pi}{9}$ twice: $\dfrac{50\pi}{9} - \dfrac{36\pi}{9} = \dfrac{14\pi}{9}$.` }
    ],
    quiz: [
      function (rng) {
        const d = rng.pick(NICE_DEG) * rng.pick([1, 1, 1, -1]);
        const rad = d * DEG;
        return { type: 'number', parse: 'pi', prompt: 'Convert $' + d + '^\\circ$ to radians. Give an **exact** answer (e.g. `5pi/6`).', answer: rad, tol: 0.005, answerText: M.formatPi(rad), explanation: r`$\dfrac{` + d + r`}{180} = \dfrac{` + M.asPiFraction(rad).n + '}{' + M.asPiFraction(rad).d + '}$, so $' + d + r`^\circ = ` + M.texPi(rad) + '$.' };
      },
      function (rng) {
        const d = rng.pick([10, 25, 37, 52, 70, 85, 100, 125, 160, 200, 250, 290, 340]);
        const rad = d * DEG;
        return { type: 'number', prompt: 'Convert $' + d + '^\\circ$ to radians as a decimal (4 places).', answer: rad, tol: 0.001, answerText: M.fmt(rad, 4), explanation: r`$` + d + r` \times \dfrac{\pi}{180} \approx ` + M.fmt(rad, 4) + '$. Sanity check: $' + d + r`^\circ$ is about $` + M.fmt(d / 57.3, 1) + '$ "57-degree chunks".' };
      },
      function (rng) {
        const d = rng.pick(NICE_DEG.filter(x => x !== 180));
        const rad = d * DEG;
        const f = M.asPiFraction(rad);
        const pool = ['$\\dfrac{' + f.n + '}{' + f.d + '}$', '$' + M.texPi(rad).replace(/\\frac\{(.*?)\}\{(.*?)\}/, '\\dfrac{$2}{$1}') + '$', '$' + M.fmt(d * 180 / PI, 1) + '$', '$' + M.fmt(rad, 3) + '$'];
        const good = '$' + M.texPi(rad) + '$';
        const choices = [{ text: good, correct: true }].concat(Array.from(new Set(pool.filter(t => t !== good))).slice(0, 3).map(t => ({ text: t, correct: false })));
        return { type: 'mc', prompt: 'Which is $' + d + '^\\circ$ in radians?', choices, explanation: r`$\dfrac{` + d + '}{180}' + r`\pi = ` + M.texPi(rad) + '$. Don\'t drop the $\\pi$, don\'t flip the fraction, and don\'t multiply by $180/\\pi$ (that\'s the other direction).' };
      }
    ]
  });
})();
