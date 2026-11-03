/* Unit 2 — section 2-5 (part b): degrees & minutes, radian measure of angles, evaluating sin/cos in radians. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { PI, DEG, NICE_VALUES } = window.U2;
  const r = String.raw;
  const sec = U.sections.find(s => s.id === '2-5');

  // ---- Degrees, minutes (and seconds) ----
  sec.topics.push({
    id: '2-5-dms', title: 'Degrees and minutes',
    notes: r`## Base-60 subdivisions

$$1^\circ = 60' \text{ (minutes)} \qquad 1' = 60'' \text{ (seconds)}$$

So $1' = \tfrac{1}{60}^\circ$ and $1'' = \tfrac{1}{3600}^\circ$. Navigation, astronomy, and surveying still use this.

## DMS → decimal degrees

$$32^\circ 45' = 32 + \frac{45}{60} = 32.75^\circ \qquad\qquad 12^\circ 18' 36'' = 12 + \frac{18}{60} + \frac{36}{3600} = 12.31^\circ$$

## Decimal degrees → DMS

Take the whole degrees; multiply the leftover decimal by $60$ to get minutes; multiply *that* leftover by $60$ for seconds.

$$57.2958^\circ:\quad 0.2958 \times 60 = 17.748' \;\Rightarrow\; 17',\quad 0.748 \times 60 \approx 44.9'' \;\Rightarrow\; 57^\circ 17' 45''$$

## DMS → radians

Convert to decimal degrees **first**, then multiply by $\pi/180$:

$$32^\circ 45' = 32.75^\circ = 32.75 \cdot \frac{\pi}{180} \approx 0.5716$$

> **Common mistake:** writing $32^\circ 45'$ as $32.45^\circ$. Minutes are out of **60**, not 100. $45' = 0.75^\circ$.

> **Common mistake:** on the way back, multiplying the whole number by 60 instead of just the decimal part.`,
    explore: {
      type: 'unitCircle', startDeg: 32.75, snap: 0, showValues: true,
      intro: 'Free-drag mode. The readout shows the same angle as decimal degrees, degrees-and-minutes, and radians. Type a decimal like `32.75` or a DMS angle like `32°45\'` (or `32 45`) and press Go.',
      tasks: r`1. Type \`32 45\` (meaning $32^\circ 45'$). Check the decimal-degree readout against your own conversion.
2. Type \`57.2958\`. Read off the degrees-and-minutes form. Why is this angle special?
3. Drag freely to an angle with an odd decimal; convert it to DMS by hand; compare.`
    },
    practice: [
      { q: r`Convert $48^\circ 30'$ to decimal degrees.`, hint: "30' is half a degree.", answer: r`$48.5^\circ$`, solution: r`$30/60 = 0.5$, so $48^\circ 30' = 48.5^\circ$.` },
      { q: r`Convert $73.4^\circ$ to degrees and minutes.`, hint: 'Multiply the decimal part by 60.', answer: r`$73^\circ 24'$`, solution: r`$0.4 \times 60 = 24$, so $73.4^\circ = 73^\circ 24'$.` },
      { q: r`Convert $125^\circ 12'$ to radians, to four decimal places.`, hint: 'DMS → decimal degrees → radians.', answer: r`$\approx 2.1852$`, solution: r`$12/60 = 0.2$, so $125.2^\circ$. Then $125.2 \times \pi/180 \approx 2.1852$.` },
      { q: r`Convert $2$ radians to degrees and minutes (nearest minute).`, hint: 'Radians → decimal degrees → DMS.', answer: r`$\approx 114^\circ 35'$`, solution: r`$2 \times 180/\pi \approx 114.5916^\circ$. $0.5916 \times 60 \approx 35.5'$, so about $114^\circ 35'$ (or $114^\circ 36'$ if you round up; nearest minute is $35'$ since $0.5916 \times 60 = 35.496$).` },
      { q: r`Convert $10^\circ 15' 36''$ to decimal degrees.`, hint: 'Seconds are out of 3600.', answer: r`$10.26^\circ$`, solution: r`$15/60 = 0.25$; $36/3600 = 0.01$. Total $10.26^\circ$.` }
    ],
    quiz: [
      function (rng) {
        const d = rng.int(5, 170);
        const m = rng.pick([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
        const dec = d + m / 60;
        return { type: 'number', prompt: 'Convert $' + d + "^\\circ " + m + "'$ to decimal degrees.", answer: dec, tol: 0.005, unit: '°', answerText: M.fmt(dec, 3) + '°', explanation: r`$` + m + '/60 = ' + M.fmt(m / 60, 3) + '$, so $' + d + r`^\circ ` + m + "' = " + M.fmt(dec, 3) + r`^\circ$. (Not $` + d + '.' + m + r`^\circ$ — minutes are sixtieths.)` };
      },
      function (rng) {
        const d = rng.int(5, 170);
        const m = rng.pick([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54, 3, 9, 21, 27, 33, 39, 51, 57]);
        const dec = d + m / 60;
        return { type: 'text', prompt: 'Convert $' + M.fmt(dec, 3) + '^\\circ$ to degrees and minutes. (Type like `48 30` or `48°30\'`.)', placeholder: "e.g. 48°30'", check: s => { const v = M.parseDMS(s); return !isNaN(v) && Math.abs(v - dec) < 1 / 120; }, answerText: d + '°' + String(m).padStart(2, '0') + "'", explanation: r`Whole degrees: $` + d + '$. Decimal part $' + M.fmt(dec - d, 3) + r` \times 60 = ` + m + "'$." };
      },
      function (rng) {
        const d = rng.int(10, 170);
        const m = rng.pick([6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54]);
        const dec = d + m / 60;
        const rad = dec * DEG;
        return { type: 'number', prompt: 'Convert $' + d + "^\\circ " + m + "'$ to radians (4 decimal places).", answer: rad, tol: 0.001, answerText: M.fmt(rad, 4), explanation: r`First $` + d + r`^\circ ` + m + "' = " + M.fmt(dec, 3) + r`^\circ$. Then $` + M.fmt(dec, 3) + r` \times \pi/180 \approx ` + M.fmt(rad, 4) + '$.' };
      },
      function (rng) {
        const rad = rng.pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.3, 2.7, 3]);
        const dec = rad * 180 / PI;
        return { type: 'text', prompt: 'Convert $' + rad + '$ radians to degrees and minutes (nearest minute). Type like `57 18`.', placeholder: "e.g. 57°18'", check: s => { const v = M.parseDMS(s); return !isNaN(v) && Math.abs(v - dec) <= 1 / 60 + 1e-9; }, answerText: M.formatDMS(dec), explanation: r`$` + rad + r` \times 180/\pi \approx ` + M.fmt(dec, 4) + r`^\circ$. Decimal part $\times 60 \approx ` + M.fmt((dec % 1) * 60, 1) + "'$, giving $" + M.formatDMS(dec).replace('°', '^\\circ ') + '$.' };
      }
    ]
  });

  // ---- Radian measure of angles in standard position / unit circle ----
  sec.topics.push({
    id: '2-5-angle-radians', title: 'Finding the radian measure of angles',
    notes: r`## Angles in standard position

An angle in [[standard position]] has its vertex at the origin and initial side on the positive $x$-axis. Counterclockwise is positive; clockwise is negative. Its radian measure is the arc it sweeps out on the **unit circle**.

## Reading a radian measure off a picture

1. Identify which **quadrant** the terminal side is in (or which axis it's on).
2. Find the **reference angle** $\theta_{\text{ref}}$ — the acute angle to the nearest $x$-axis.
3. Build the angle:
   - QI: $\theta_{\text{ref}}$
   - QII: $\pi - \theta_{\text{ref}}$
   - QIII: $\pi + \theta_{\text{ref}}$
   - QIV: $2\pi - \theta_{\text{ref}}$ (or the negative $-\theta_{\text{ref}}$)

Example: terminal side in QIII making $\tfrac{\pi}{4}$ with the negative $x$-axis → $\pi + \tfrac{\pi}{4} = \tfrac{5\pi}{4}$.

## Coterminal angles

Adding or subtracting $2\pi$ (a full turn) gives a **coterminal** angle — same terminal side, same trig values. $\tfrac{\pi}{3}$, $\tfrac{7\pi}{3}$, and $-\tfrac{5\pi}{3}$ are all the same ray.

## From arc length

On a circle of radius $r$, an arc of length $s$ subtends $\theta = s/r$ radians. On the **unit** circle, the radian measure *is* the arc length.

## Reference angles in radians

| **Quadrant** | **$\theta$** | **$\theta_{\text{ref}}$** |
| --- | --- | --- |
| II | $\tfrac{5\pi}{6}$ | $\pi - \tfrac{5\pi}{6} = \tfrac{\pi}{6}$ |
| III | $\tfrac{4\pi}{3}$ | $\tfrac{4\pi}{3} - \pi = \tfrac{\pi}{3}$ |
| IV | $\tfrac{7\pi}{4}$ | $2\pi - \tfrac{7\pi}{4} = \tfrac{\pi}{4}$ |

> **Common mistake:** using $\tfrac{\pi}{2}$ as the "flip" value in QII or QIII. Reference angles are measured from the **$x$-axis**, so the pivot numbers are $\pi$ and $2\pi$, never $\tfrac{\pi}{2}$ or $\tfrac{3\pi}{2}$.`,
    explore: {
      type: 'unitCircle', startDeg: 225, snap: 'nice', showValues: true,
      intro: 'Drag to any of the special angles. Watch **Quadrant**, **Reference angle**, and **θ (radians)** together — the reference angle is always the acute angle to the horizontal axis.',
      tasks: r`1. Put the point in QIII at reference angle $\tfrac{\pi}{6}$. What is $\theta$? Check.
2. Find every angle on the circle with reference angle $\tfrac{\pi}{4}$. There should be four.
3. Type \`-5pi/3\`. Where does it land? Which positive angle is coterminal?`
    },
    practice: [
      { q: r`An angle in standard position has its terminal side in QII, making an angle of $\tfrac{\pi}{3}$ with the negative $x$-axis. Find its radian measure.`, hint: 'QII: π − reference.', answer: r`$\tfrac{2\pi}{3}$`, solution: r`$\pi - \tfrac{\pi}{3} = \tfrac{2\pi}{3}$.` },
      { q: r`Find the reference angle of $\tfrac{7\pi}{6}$ and the quadrant it's in.`, hint: '7π/6 is just past π.', answer: r`QIII; reference angle $\tfrac{\pi}{6}$`, solution: r`$\pi < \tfrac{7\pi}{6} < \tfrac{3\pi}{2}$, so QIII. Reference: $\tfrac{7\pi}{6} - \pi = \tfrac{\pi}{6}$.` },
      { q: r`Find a positive angle less than $2\pi$ coterminal with $-\tfrac{\pi}{4}$, and another coterminal with $\tfrac{13\pi}{6}$.`, hint: 'Add or subtract 2π.', answer: r`$\tfrac{7\pi}{4}$ and $\tfrac{\pi}{6}$`, solution: r`$-\tfrac{\pi}{4} + 2\pi = \tfrac{7\pi}{4}$. $\tfrac{13\pi}{6} - 2\pi = \tfrac{13\pi}{6} - \tfrac{12\pi}{6} = \tfrac{\pi}{6}$.` },
      { q: r`The terminal side of $\theta$ passes through the point $(-3, -3)$. Find $\theta$ in radians for $0 \le \theta < 2\pi$.`, hint: 'Equal coordinates → 45° reference angle. Both negative → QIII.', answer: r`$\tfrac{5\pi}{4}$`, solution: r`$(-3,-3)$ is in QIII on the line $y = x$, so the reference angle is $\tfrac{\pi}{4}$. $\theta = \pi + \tfrac{\pi}{4} = \tfrac{5\pi}{4}$.` },
      { q: r`A wheel of radius $0.4$ m rolls so that a point on its rim travels $1.5$ m of arc. Through how many radians did the wheel turn? How many degrees?`, hint: 'θ = s / r.', answer: r`$3.75$ rad $\approx 214.9^\circ$`, solution: r`$\theta = 1.5 / 0.4 = 3.75$ radians $= 3.75 \times 180/\pi \approx 214.9^\circ$.` }
    ],
    quiz: [
      function (rng) {
        const ref = rng.pick([PI / 6, PI / 4, PI / 3]);
        const q = rng.int(1, 4);
        const th = q === 1 ? ref : q === 2 ? PI - ref : q === 3 ? PI + ref : 2 * PI - ref;
        const axis = q <= 2 ? (q === 1 ? 'positive' : 'negative') : (q === 3 ? 'negative' : 'positive');
        return { type: 'number', parse: 'pi', prompt: r`An angle in standard position terminates in Quadrant ` + ['I', 'II', 'III', 'IV'][q - 1] + ', making an angle of $' + M.texPi(ref) + '$ with the ' + axis + r` $x$-axis. Find $\theta$ for $0 \le \theta < 2\pi$ (exact, e.g. \`5pi/4\`).`, answer: th, tol: 0.005, answerText: M.formatPi(th), explanation: ['QI: $\\theta = \\theta_{ref}$', 'QII: $\\theta = \\pi - \\theta_{ref}$', 'QIII: $\\theta = \\pi + \\theta_{ref}$', 'QIV: $\\theta = 2\\pi - \\theta_{ref}$'][q - 1] + ' $= ' + M.texPi(th) + '$.' };
      },
      function (rng) {
        const th = rng.pick([2 * PI / 3, 3 * PI / 4, 5 * PI / 6, 7 * PI / 6, 5 * PI / 4, 4 * PI / 3, 5 * PI / 3, 7 * PI / 4, 11 * PI / 6]);
        const n = M.normalizeRad(th);
        const ref = n <= PI / 2 ? n : n <= PI ? PI - n : n <= 3 * PI / 2 ? n - PI : 2 * PI - n;
        return { type: 'number', parse: 'pi', prompt: 'Find the **reference angle** of $\\theta = ' + M.texPi(th) + '$ (exact).', answer: ref, tol: 0.005, answerText: M.formatPi(ref), explanation: r`$` + M.texPi(th) + '$ is in Q' + (n <= PI / 2 ? 'I' : n <= PI ? 'II' : n <= 3 * PI / 2 ? 'III' : 'IV') + '. Measure to the nearest $x$-axis ($\\pi$ or $2\\pi$): reference angle $' + M.texPi(ref) + '$.' };
      },
      function (rng) {
        const base = rng.pick([PI / 6, PI / 4, PI / 3, 2 * PI / 3, 5 * PI / 6, 5 * PI / 4, 7 * PI / 6, 3 * PI / 2, 11 * PI / 6]);
        const k = rng.pick([-2, -1, 1, 2]);
        const th = base + 2 * PI * k;
        return { type: 'number', parse: 'pi', prompt: 'Find the angle in $[0, 2\\pi)$ coterminal with $' + M.texPi(th) + '$ (exact).', answer: base, tol: 0.005, answerText: M.formatPi(base), explanation: r`` + (k > 0 ? 'Subtract' : 'Add') + ' $2\\pi$ ' + (Math.abs(k) === 1 ? 'once' : 'twice') + ': $' + M.texPi(th) + (k > 0 ? ' - ' : ' + ') + M.texPi(2 * PI * Math.abs(k)) + ' = ' + M.texPi(base) + '$.' };
      },
      function (rng) {
        const pts = [[1, 1, PI / 4], [-1, 1, 3 * PI / 4], [-1, -1, 5 * PI / 4], [1, -1, 7 * PI / 4], [Math.sqrt(3), 1, PI / 6], [-Math.sqrt(3), 1, 5 * PI / 6], [-Math.sqrt(3), -1, 7 * PI / 6], [Math.sqrt(3), -1, 11 * PI / 6], [1, Math.sqrt(3), PI / 3], [-1, Math.sqrt(3), 2 * PI / 3], [-1, -Math.sqrt(3), 4 * PI / 3], [1, -Math.sqrt(3), 5 * PI / 3]];
        const p = rng.pick(pts);
        const k = rng.pick([1, 2, 3]);
        const fmtC = v => Math.abs(Math.abs(v) - Math.sqrt(3)) < 1e-9 ? (v < 0 ? '-' : '') + k + '\\sqrt{3}' : String(v * k);
        return { type: 'number', parse: 'pi', prompt: 'The terminal side of $\\theta$ (standard position) passes through $(' + fmtC(p[0]) + ', ' + fmtC(p[1]) + ')$. Find $\\theta$ in $[0, 2\\pi)$, exact.', answer: p[2], tol: 0.005, answerText: M.formatPi(p[2]), explanation: r`Quadrant from the signs: ` + (p[0] > 0 ? (p[1] > 0 ? 'QI' : 'QIV') : (p[1] > 0 ? 'QII' : 'QIII')) + r`. Reference angle from the ratio $|y/x| = ` + M.formatExact(Math.abs(p[1] / p[0]), true) + r`$ → $\theta_{ref} = ` + M.texPi(Math.atan(Math.abs(p[1] / p[0]))) + '$. Then build $\\theta = ' + M.texPi(p[2]) + '$.' };
      }
    ]
  });

  // ---- Evaluating sin/cos at radian inputs ----
  sec.topics.push({
    id: '2-5-evaluate', title: 'Evaluating sin and cos of radian measures',
    notes: r`## Two kinds of input

**1. A multiple of $\pi$** → use the unit circle, get an **exact** value.

$$\cos\tfrac{5\pi}{6} = -\tfrac{\sqrt3}{2} \qquad \sin\tfrac{7\pi}{4} = -\tfrac{\sqrt2}{2} \qquad \sin\tfrac{3\pi}{2} = -1$$

Method: quadrant → sign; reference angle → magnitude from the $\tfrac{\pi}{6}, \tfrac{\pi}{4}, \tfrac{\pi}{3}$ table.

| **$\theta_{\text{ref}}$** | $\tfrac{\pi}{6}$ | $\tfrac{\pi}{4}$ | $\tfrac{\pi}{3}$ |
| --- | --- | --- | --- |
| $\sin$ | $\tfrac12$ | $\tfrac{\sqrt2}{2}$ | $\tfrac{\sqrt3}{2}$ |
| $\cos$ | $\tfrac{\sqrt3}{2}$ | $\tfrac{\sqrt2}{2}$ | $\tfrac12$ |

**2. A plain number** → calculator in **RADIAN mode**, get a decimal.

$$\sin 2 \approx 0.9093 \qquad \cos 4.7 \approx -0.0124 \qquad \cos(-1) \approx 0.5403$$

> **Common mistake:** calculator left in degree mode. $\sin 2^\circ = 0.0349$, but $\sin 2 = 0.9093$. If an answer looks suspiciously tiny, check the mode. Rule of thumb: $\sin\theta \approx \theta$ *only* for small radian angles, and $2$ is not small.

> **Common mistake:** $\cos\tfrac{\pi}{3} = \tfrac{\sqrt3}{2}$. No — that's $\sin\tfrac{\pi}{3}$ (or $\cos\tfrac{\pi}{6}$). For $\tfrac{\pi}{3} = 60^\circ$, the "tall" triangle: $\sin$ is big ($\tfrac{\sqrt3}{2}$), $\cos$ is small ($\tfrac12$).

## Sign sanity check

Quadrant signs are your safety net. $\theta = 4$ is in QIII (between $\pi \approx 3.14$ and $\tfrac{3\pi}{2} \approx 4.71$), so **both** $\sin 4$ and $\cos 4$ should come out negative. If your calculator disagrees, you're in the wrong mode.`,
    explore: {
      type: 'unitCircle', startDeg: 150, snap: 'nice', showValues: false,
      intro: 'Self-test: values hidden. Type a radian measure (`5pi/6`, `4pi/3`, or a plain number like `2`), say $\\cos\\theta$ and $\\sin\\theta$, then **Reveal**.',
      tasks: r`1. Run through all twelve special angles $\tfrac{\pi}{6}, \tfrac{\pi}{4}, \tfrac{\pi}{3}, \tfrac{2\pi}{3}, \ldots$ saying cos then sin for each.
2. Type \`2\` and \`4\` and \`5.5\`. Predict the **signs** of cos and sin from the quadrant before revealing.
3. Type \`pi/3\` and \`pi/6\`. Which has the larger cosine? Make sure you can explain why from the picture.`
    },
    practice: [
      { q: r`Evaluate exactly: $\cos\tfrac{5\pi}{6}$, $\sin\tfrac{5\pi}{6}$.`, hint: '5π/6 is in QII with reference angle π/6.', answer: r`$\cos\tfrac{5\pi}{6} = -\tfrac{\sqrt3}{2}$, $\sin\tfrac{5\pi}{6} = \tfrac12$`, solution: r`QII: cosine negative, sine positive. Reference $\tfrac{\pi}{6}$: $\cos = \tfrac{\sqrt3}{2}$, $\sin = \tfrac12$. Apply signs.` },
      { q: r`Evaluate exactly: $\sin\tfrac{4\pi}{3}$, $\cos\tfrac{7\pi}{4}$, $\cos\tfrac{3\pi}{2}$.`, hint: 'QIII, QIV, and an axis.', answer: r`$-\tfrac{\sqrt3}{2}$, $\tfrac{\sqrt2}{2}$, $0$`, solution: r`$\tfrac{4\pi}{3}$: QIII, ref $\tfrac{\pi}{3}$, sine negative → $-\tfrac{\sqrt3}{2}$. $\tfrac{7\pi}{4}$: QIV, ref $\tfrac{\pi}{4}$, cosine positive → $\tfrac{\sqrt2}{2}$. $\tfrac{3\pi}{2}$: the point $(0,-1)$, cosine $= 0$.` },
      { q: r`Evaluate to four decimal places: $\sin 2.5$, $\cos 2.5$. Check the signs against the quadrant first.`, hint: '2.5 radians is in QII.', answer: r`$\sin 2.5 \approx 0.5985$, $\cos 2.5 \approx -0.8011$`, solution: r`$\tfrac{\pi}{2} < 2.5 < \pi$ → QII → sine $+$, cosine $-$. Calculator (radian mode): $0.5985$ and $-0.8011$.` },
      { q: r`A student says $\sin 3 \approx 0.0523$. Explain the error and give the correct value.`, hint: 'What is sin 3° ?', answer: r`Calculator was in degree mode ($\sin 3^\circ = 0.0523$). Correct: $\sin 3 \approx 0.1411$.`, solution: r`$3$ radians is just under $\pi$, so $\sin 3$ should be small but positive — and $0.1411$ fits. $0.0523$ is $\sin 3^\circ$.` },
      { q: r`Evaluate exactly: $\cos\left(-\tfrac{\pi}{3}\right)$ and $\sin\left(-\tfrac{\pi}{3}\right)$.`, hint: 'Negative angle → QIV. Or use even/odd.', answer: r`$\tfrac12$ and $-\tfrac{\sqrt3}{2}$`, solution: r`$-\tfrac{\pi}{3}$ is in QIV: cosine positive, sine negative. Reference $\tfrac{\pi}{3}$. Or: $\cos(-x) = \cos x = \tfrac12$; $\sin(-x) = -\sin x = -\tfrac{\sqrt3}{2}$.` }
    ],
    quiz: [
      function (rng) {
        const fn = rng.pick(['sin', 'cos']);
        const th = rng.pick([PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3, 3 * PI / 4, 5 * PI / 6, PI, 7 * PI / 6, 5 * PI / 4, 4 * PI / 3, 3 * PI / 2, 5 * PI / 3, 7 * PI / 4, 11 * PI / 6, -PI / 6, -PI / 4, -PI / 3, -PI / 2, 0]);
        const v = (fn === 'sin' ? Math.sin : Math.cos)(th);
        return { type: 'number', parse: 'exact', prompt: 'Evaluate exactly: $\\' + fn + '\\left(' + M.texPi(th) + '\\right)$. (Type like `-sqrt3/2`, `1/2`, `0`.)', answer: v, tol: 0.002, answerText: M.formatExact(v), explanation: r`$` + M.texPi(th) + '$ ' + quadrantPhrase(th) + '. Reference angle $' + M.texPi(refOf(th)) + '$ gives magnitude $' + M.formatExact(Math.abs(v), true) + '$; the quadrant gives the sign.' };
      },
      function (rng) {
        const fn = rng.pick(['sin', 'cos']);
        const th = rng.pick([0.5, 0.8, 1, 1.3, 1.7, 2, 2.4, 2.8, 3, 3.3, 3.7, 4, 4.4, 4.9, 5.3, 5.8, 6, -1, -2, -0.6]);
        const v = (fn === 'sin' ? Math.sin : Math.cos)(th);
        return { type: 'number', prompt: 'Evaluate $\\' + fn + '(' + th + ')$ to four decimal places. (That\'s radians — no degree sign.)', answer: v, tol: 0.001, answerText: M.fmt(v, 4), explanation: r`Radian mode: $` + '\\' + fn + '(' + th + r`) \approx ` + M.fmt(v, 4) + '$. Sanity: $' + th + '$ ' + quadrantPhrase(th) + ', so ' + fn + ' should be ' + (v >= 0 ? 'positive' : 'negative') + '. (Degree mode would have given $' + M.fmt((fn === 'sin' ? Math.sin : Math.cos)(th * DEG), 4) + '$ — wrong.)' };
      },
      function (rng) {
        const th = rng.pick([0.7, 1.2, 2, 2.6, 3.5, 4, 4.4, 5, 5.7, 6.1]);
        const s = Math.sin(th) >= 0 ? '+' : '−', c = Math.cos(th) >= 0 ? '+' : '−';
        const combos = [['+', '+'], ['−', '+'], ['−', '−'], ['+', '−']];
        return { type: 'mc', prompt: 'Without a calculator: what are the **signs** of $\\cos ' + th + '$ and $\\sin ' + th + '$ (in that order)?', choices: combos.map(([cc, ss]) => ({ text: 'cos ' + cc + ', sin ' + ss, correct: cc === c && ss === s })), explanation: r`$` + th + '$ ' + quadrantPhrase(th) + '. Cosine is the $x$-coordinate, sine the $y$-coordinate of the unit-circle point there.' };
      },
      function (rng) {
        const fn = rng.pick(['sin', 'cos']);
        const pairs = [[PI / 6, PI / 3], [PI / 4, 3 * PI / 4], [2 * PI / 3, 4 * PI / 3], [PI / 3, 2 * PI / 3], [5 * PI / 6, 7 * PI / 6], [PI / 6, 5 * PI / 6]];
        const [a, b] = rng.pick(pairs);
        const f = fn === 'sin' ? Math.sin : Math.cos;
        const va = f(a), vb = f(b);
        const ans = Math.abs(va - vb) < 1e-9 ? 'equal' : va > vb ? 'first' : 'second';
        return { type: 'mc', prompt: 'Which is larger: $\\' + fn + '\\left(' + M.texPi(a) + '\\right)$ or $\\' + fn + '\\left(' + M.texPi(b) + '\\right)$?', choices: [{ text: 'the first', correct: ans === 'first' }, { text: 'the second', correct: ans === 'second' }, { text: 'they are equal', correct: ans === 'equal' }], explanation: '$\\' + fn + '(' + M.texPi(a) + ') = ' + M.formatExact(va, true) + '$ and $\\' + fn + '(' + M.texPi(b) + ') = ' + M.formatExact(vb, true) + '$.' };
      }
    ]
  });

  function refOf(th) {
    const n = M.normalizeRad(th);
    if (n <= PI / 2) return n;
    if (n <= PI) return PI - n;
    if (n <= 3 * PI / 2) return n - PI;
    return 2 * PI - n;
  }
  function quadrantPhrase(th) {
    const n = M.normalizeRad(th);
    const eps = 1e-9;
    if (Math.abs(n) < eps || Math.abs(n - PI) < eps || Math.abs(n - PI / 2) < eps || Math.abs(n - 3 * PI / 2) < eps) return 'is on an axis';
    const q = n < PI / 2 ? 'I' : n < PI ? 'II' : n < 3 * PI / 2 ? 'III' : 'IV';
    return 'is in Quadrant ' + q + (th < 0 ? ' (negative angles go clockwise)' : '');
  }
})();
