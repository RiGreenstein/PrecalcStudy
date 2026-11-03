/* Unit 4 — hand-written challenge set (fixed questions, timed). Shown on the practice-test page and the unit overview. */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { SV, PI } = U4;
  const r = String.raw;

  // ---------- diagram: belt-driven winch lifting a bucket ----------
  window.FIGURES['u4-winch'] = () => {
    const y = 150, x1 = 170, r1 = 96, x2 = 470, r2 = 12, rd = 32;   // 8 px per inch
    const B = U4.beltPoints(x1, x2, y, r1, r2);
    const f1 = n => Math.round(n * 10) / 10;
    const ropeX = x1 + rd, bucketTop = 330;
    return SV.open(640, 430, 'Motor pulley belted to a large pulley; a winch drum on the large pulley’s axle winds a rope that lifts a bucket') +
      SV.circle(x1, y, r1, 'fill-surface') +
      // belt
      SV.line(B.t1[0], B.t1[1], B.t2[0], B.t2[1], 'acc thick') + SV.line(B.b1[0], B.b1[1], B.b2[0], B.b2[1], 'acc thick') +
      SV.path('M' + f1(B.t1[0]) + ',' + f1(B.t1[1]) + ' A' + r1 + ',' + r1 + ' 0 1 0 ' + f1(B.b1[0]) + ',' + f1(B.b1[1]), 'acc thick') +
      SV.path('M' + f1(B.t2[0]) + ',' + f1(B.t2[1]) + ' A' + r2 + ',' + r2 + ' 0 0 1 ' + f1(B.b2[0]) + ',' + f1(B.b2[1]), 'acc thick') +
      // drum (same axle as the large pulley)
      SV.circle(x1, y, rd, 'acc3 fill-soft') +
      SV.dot(x1, y) +
      SV.line(x1, y, x1 - r1 * 0.71, y - r1 * 0.71, 'thin') + SV.text(x1 - 58, y - 38, '12 in', 't-sm', 'end') +
      SV.line(x1 - rd, y + 8, x1 + rd, y + 8, 'thin acc3') + SV.text(x1, y + 24, '8 in', 't-sm t-acc3') +
      SV.text(x1, y - r1 - 12, 'large pulley, radius 12 in', 't-sm t-b') +
      // rope + bucket
      SV.line(ropeX, y, ropeX, bucketTop, 'thick acc2') +
      SV.path('M' + (ropeX - 30) + ',' + bucketTop + ' L' + (ropeX + 30) + ',' + bucketTop + ' L' + (ropeX + 22) + ',' + (bucketTop + 46) + ' L' + (ropeX - 22) + ',' + (bucketTop + 46) + ' Z', 'acc2 fill-surface') +
      SV.text(ropeX + 40, bucketTop + 28, 'bucket', 't-sm', 'start') +
      SV.line(ropeX + 100, bucketTop + 30, ropeX + 100, bucketTop - 90, 'thin', 'ah') + SV.text(ropeX + 106, bucketTop - 40, 'rises', 't-sm', 'start') +
      SV.line(ropeX + 4, y + 70, ropeX + 60, y + 100, 'thin acc2') + SV.text(ropeX + 64, y + 106, 'rope winds onto the drum', 't-sm t-acc2', 'start') +
      // drum label
      SV.line(x1 + 10, y - 20, x1 + 120, y - 120, 'thin acc3') +
      SV.text(x1 + 124, y - 124, 'winch drum, diameter 8 in', 't-sm t-acc3', 'start') +
      SV.text(x1 + 124, y - 108, '(fixed to the large pulley’s axle)', 't-sm t-acc3', 'start') +
      // motor
      SV.rect(x2 - 34, y + 22, 68, 46, 'fill-surface', 6) + SV.text(x2, y + 50, 'motor', 't-sm') +
      SV.line(x2, y + 12, x2, y + 22, 'thick') +
      SV.circle(x2, y, r2, 'acc2 fill-acc2') + SV.dot(x2, y, 'fill-bg', 2.5) +
      SV.text(x2 + 22, y - 6, 'motor pulley', 't-sm t-b', 'start') + SV.text(x2 + 22, y + 10, 'r = 1.5 in · 1200 rpm', 't-sm t-acc2', 'start') +
      SV.text(330, 120, 'belt (no slipping)', 't-sm t-acc') +
      SV.text(20, 420, 'Drawn roughly to scale. Rope thickness is negligible.', 't-sm t-mut', 'start') +
      SV.close;
  };

  const ANG = { parse: 'angle', tol: 0.005 };
  const FRAC = { parse: 'any', tol: 0.002 };

  // ---------- diagram: stock vs. oversized tires + speedometer ----------
  window.FIGURES['u4-tires'] = () => {
    const gy = 270, k = 6.5;                 // px per inch
    const tire = (cx, d, label, cls) => {
      const R = d / 2 * k, cy = gy - R;
      return SV.circle(cx, cy, R, (cls || '') + ' fill-surface') + SV.circle(cx, cy, R * 0.62, 'thin fill-bg') + SV.dot(cx, cy) +
        SV.line(cx - R, cy, cx + R, cy, 'thin dash') +
        SV.text(cx, cy - 8, d + ' in diameter', 't-sm t-b') +
        SV.text(cx, gy + 22, label, 't-sm');
    };
    // speedometer
    const sx = 560, sy = 120, sr = 62;
    let dial = SV.circle(sx, sy, sr, 'fill-surface');
    for (let i = 0; i <= 8; i++) {
      const a = 225 - i * 33.75, [x1, y1] = SV.pt(sx, sy, sr - 8, a), [x2, y2] = SV.pt(sx, sy, sr - 2, a), [tx, ty] = SV.pt(sx, sy, sr - 20, a);
      dial += SV.line(x1, y1, x2, y2, 'thin') + (i % 2 === 0 ? SV.text(tx, ty + 4, String(i * 10), 't-sm t-mut') : '');
    }
    const [nx, ny] = SV.pt(sx, sy, sr - 32, 225 - 6 * 33.75);
    dial += SV.line(sx, sy, nx, ny, 'thick acc2') + SV.dot(sx, sy, 'fill-acc2', 4) + SV.text(sx, sy + 30, 'mi/hr', 't-sm t-mut');
    return SV.open(680, 330, 'A stock 26-inch tire, an oversized 32-inch tire, and a speedometer reading 60 miles per hour') +
      SV.line(20, gy, 460, gy, 'thick') +
      tire(120, 26, 'stock tire (speedometer calibrated for this)') +
      tire(340, 32, 'new oversized tire', 'acc') +
      dial +
      SV.text(sx, sy - sr - 14, 'speedometer reads 60', 't-b t-acc2') +
      SV.text(sx, sy + sr + 26, 'It measures how fast', 't-sm', 'middle') +
      SV.text(sx, sy + sr + 42, 'the wheels turn (rpm).', 't-sm', 'middle') +
      SV.close;
  };

  U.challenges = [{
    id: 'hard-1',
    title: 'Unit 4 challenge — version 1 (hard)',
    minutes: 25,
    description: 'Winch velocity chain, an arcsec sketch, and eight tough exact values.',
    questions: [
      {
        topicId: '4-4-word',
        gen: () => ({
          type: 'multi',
          prompt: r`**Well winch.** A motor turns a pulley of radius $1.5$ in at $1200$ rpm. A belt connects it to a large pulley of radius $12$ in. A winch drum of **diameter** $8$ in is fixed to the large pulley's axle; a rope winds onto the drum and lifts a bucket out of a well.

{{fig:u4-winch}}`,
          fields: [
            { label: '(a) rpm of the large pulley', answer: 150, tol: 0.5, answerText: '150' },
            { label: '(b) speed of the bucket (ft/s)', answer: 5 * PI / 3, tol: 0.03, answerText: '5π/3 ≈ 5.236' },
            { label: '(c) seconds to lift the bucket 60 ft', answer: 36 / PI, tol: 0.1, answerText: '36/π ≈ 11.46' },
            { label: '(d) motor rpm needed to raise the bucket at exactly 8 ft/s', answer: 5760 / PI, tol: 3, answerText: '5760/π ≈ 1833.5' }
          ],
          explanation: r`- **Belt → same rim speed:** $1.5 \times 1200 = 12\,\omega \Rightarrow \omega = 150$ rpm.
- **Same axle → same ω:** the drum also turns at $150$ rpm. Drum radius $= 4$ in (diameter $8$!). The rope moves at the drum's rim speed: $v = 4 \times 150 \times 2\pi = 1200\pi$ in/min $= 100\pi$ ft/min $= \tfrac{5\pi}{3} \approx 5.236$ ft/s.
- **Time:** $t = \tfrac{60}{5\pi/3} = \tfrac{36}{\pi} \approx 11.46$ s.
- **Work backwards for (d):** $8$ ft/s $= 96$ in/s $= 5760$ in/min. Drum: $\omega = v/r = 5760/4 = 1440$ rad/min $= \tfrac{1440}{2\pi} = \tfrac{720}{\pi} \approx 229.2$ rpm. Same axle → large pulley also $\tfrac{720}{\pi}$ rpm. Belt: $1.5\,\omega_{motor} = 12 \cdot \tfrac{720}{\pi} \Rightarrow \omega_{motor} = \tfrac{5760}{\pi} \approx 1833.5$ rpm.
  *Check:* the motor always spins $12 / 1.5 = 8$ times as fast as the drum: $8 \times 229.2 \approx 1833.5$ ✓.`
        })
      },
      {
        topicId: '4-5-transform',
        gen: () => {
          const T = U4.transform('sec', -PI / 2, 2, 0.5, 1);
          return {
            type: 'sketch',
            prompt: r`**Sketch** $y = -\tfrac{\pi}{2} + 2\operatorname{arcsec}\!\left(\dfrac{x + 1}{2}\right)$. Place both branch endpoints, the horizontal asymptote, and the points on the graph where $x = -5$ and $x = 3$.`,
            sketch: {
              view: { xMin: -8, xMax: 6, yMin: -5 * PI / 6, yMax: 5 * PI / 3, xStep: 1, yStep: PI / 2, xUnit: 'num', yUnit: 'rad' },
              snapX: 0.5, snapY: PI / 12,
              targets: [
                { label: 'Left branch endpoint', kind: 'point', x: -3, y: 3 * PI / 2 },
                { label: 'Right branch endpoint', kind: 'point', x: 1, y: -PI / 2 },
                { label: 'Horizontal asymptote', kind: 'hline', y: PI / 2 },
                { label: 'Point at x = −5', kind: 'point', x: -5, y: 5 * PI / 6 },
                { label: 'Point at x = 3', kind: 'point', x: 3, y: PI / 6 }
              ],
              answerFns: T.dom.map(iv => ({ f: T.f, domain: [iv.lo, iv.hi] }))
            },
            explanation: r`Here $a = -\tfrac{\pi}{2}$, $b = 2$, $c = \tfrac12$, $d = 1$.
- **Domain:** $\left|\tfrac{x+1}{2}\right| \ge 1 \Rightarrow x \le -3$ or $x \ge 1$ (nothing in between).
- **Range:** $-\tfrac{\pi}{2} + 2[0, \pi] = [-\tfrac{\pi}{2}, \tfrac{3\pi}{2}]$, except $-\tfrac{\pi}{2} + 2\cdot\tfrac{\pi}{2} = \tfrac{\pi}{2}$ → **asymptote** $y = \tfrac{\pi}{2}$.
- **Endpoints:** inside $= 1$ at $x = 1$: $\operatorname{arcsec} 1 = 0 \Rightarrow (1, -\tfrac{\pi}{2})$. Inside $= -1$ at $x = -3$: $\operatorname{arcsec}(-1) = \pi \Rightarrow (-3, \tfrac{3\pi}{2})$.
- $x = -5$: inside $= -2$, $\operatorname{arcsec}(-2) = \arccos(-\tfrac12) = \tfrac{2\pi}{3}$, $y = -\tfrac{\pi}{2} + \tfrac{4\pi}{3} = \tfrac{5\pi}{6}$.
- $x = 3$: inside $= 2$, $\operatorname{arcsec} 2 = \tfrac{\pi}{3}$, $y = -\tfrac{\pi}{2} + \tfrac{2\pi}{3} = \tfrac{\pi}{6}$.
- Both branches **increase** (arcsec increases; $b, c > 0$).`
          };
        }
      },
      {
        topicId: '4-6-compose',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly, in radians**, without a calculator. (None of these simply "cancel.")`,
          fields: [
            Object.assign({ label: r`(a) $\arccos\!\left(\sin\left(-\tfrac{4\pi}{3}\right)\right)$`, answer: PI / 6, answerText: 'π/6' }, ANG),
            Object.assign({ label: r`(b) $\operatorname{arccot}\!\left(\tan\tfrac{5\pi}{3}\right)$`, answer: 5 * PI / 6, answerText: '5π/6' }, ANG),
            Object.assign({ label: r`(c) $\operatorname{arcsec}\!\left(\csc\left(-\tfrac{7\pi}{6}\right)\right)$`, answer: PI / 3, answerText: 'π/3' }, ANG),
            Object.assign({ label: r`(d) $\arcsin\!\left(\sin\tfrac{13\pi}{5}\right)$`, answer: 2 * PI / 5, answerText: '2π/5' }, ANG)
          ],
          explanation: r`- **(a)** $-\tfrac{4\pi}{3}$ is coterminal with $\tfrac{2\pi}{3}$, so $\sin(-\tfrac{4\pi}{3}) = \tfrac{\sqrt3}{2}$. Then $\arccos\tfrac{\sqrt3}{2} = \tfrac{\pi}{6}$.
- **(b)** $\tan\tfrac{5\pi}{3} = -\sqrt3$ (QIV, ref $\tfrac{\pi}{3}$). arccot answers on the top half; negative → QII: reference $\tfrac{\pi}{6}$ (since $\cot\tfrac{\pi}{6} = \sqrt3$), so $\pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}$.
- **(c)** $-\tfrac{7\pi}{6}$ is coterminal with $\tfrac{5\pi}{6}$: $\sin = \tfrac12$, so $\csc = 2$. $\operatorname{arcsec} 2 = \arccos\tfrac12 = \tfrac{\pi}{3}$.
- **(d)** $\tfrac{13\pi}{5} - 2\pi = \tfrac{3\pi}{5}$, which is in QII — outside arcsin's range. Same sine as its reflection $\pi - \tfrac{3\pi}{5} = \tfrac{2\pi}{5}$, which **is** in $[-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$. Answer $\tfrac{2\pi}{5}$ (not a special angle — you get it by symmetry, not the table).`
        })
      },
      {
        topicId: '4-6-recip',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly**, without a calculator. Fractions like \`-4/3\` are fine; give (d) in radians.`,
          fields: [
            Object.assign({ label: r`(a) $\cos\!\left(\arcsin\left(-\tfrac{5}{13}\right)\right)$`, answer: 12 / 13, answerText: '12/13' }, FRAC),
            Object.assign({ label: r`(b) $\tan\!\left(\operatorname{arcsec}\left(-\tfrac{5}{3}\right)\right)$`, answer: -4 / 3, answerText: '−4/3' }, FRAC),
            Object.assign({ label: r`(c) $\csc\!\left(\operatorname{arccot}\left(-\tfrac{7}{24}\right)\right)$`, answer: 25 / 24, answerText: '25/24' }, FRAC),
            Object.assign({ label: r`(d) $\operatorname{arccsc}(-2) - \operatorname{arcsec}(-2)$`, answer: -5 * PI / 6, answerText: '−5π/6' }, ANG)
          ],
          explanation: r`- **(a)** $\theta = \arcsin(-\tfrac{5}{13})$ is in **QIV** (right half, negative). Opposite $-5$, hypotenuse $13$, adjacent $12$. Cosine is positive in QIV: $\tfrac{12}{13}$.
- **(b)** $\operatorname{arcsec}(-\tfrac53) = \arccos(-\tfrac35)$, in **QII**. Adjacent $-3$, hypotenuse $5$, opposite $4$. $\tan\theta = \tfrac{4}{-3} = -\tfrac43$.
- **(c)** arccot of a negative number is in **QII** (top half). $\cot\theta = \tfrac{x}{y} = \tfrac{-7}{24}$ → $x = -7$, $y = 24$, $r = 25$. $\csc\theta = \tfrac{r}{y} = \tfrac{25}{24}$ (positive in QII).
- **(d)** $\operatorname{arccsc}(-2) = \arcsin(-\tfrac12) = -\tfrac{\pi}{6}$ (QIV). $\operatorname{arcsec}(-2) = \arccos(-\tfrac12) = \tfrac{2\pi}{3}$ (QII). Difference: $-\tfrac{\pi}{6} - \tfrac{2\pi}{3} = -\tfrac{5\pi}{6}$.`
        })
      }
    ]
  }, {
    id: 'hard-2',
    title: 'Unit 4 challenge — version 2 (hard)',
    minutes: 25,
    description: 'Oversized-tire speedometer problem, an arccot sketch, and eight tough exact values.',
    questions: [
      {
        topicId: '4-4-connected',
        gen: () => ({
          type: 'multi',
          prompt: r`**Oversized tires.** A truck's speedometer is calibrated for stock tires of **diameter** $26$ in. A speedometer works by measuring how fast the wheels turn (their rpm) and converting that to a speed **assuming** the stock tire size. The owner installs tires of diameter $32$ in. Assume the tires roll without slipping. ($1$ mi $= 5280$ ft.)

{{fig:u4-tires}}`,
          fields: [
            { label: '(a) With the **stock** tires at a true $60$ mi/hr, the wheels turn at how many rpm?', answer: 63360 / 13 / (2 * PI), tol: 1.5, answerText: '775.7' },
            { label: '(b) With the **new** tires, the speedometer reads $60$ mi/hr. True speed (mi/hr)?', answer: 60 * 16 / 13, tol: 0.1, answerText: '960/13 ≈ 73.85' },
            { label: '(c) With the new tires at a **true** $60$ mi/hr: angular velocity of the wheels (rad/s)?', answer: 66, tol: 0.2, answerText: '66' },
            { label: '(d) …and what does the speedometer read then (mi/hr)?', answer: 60 * 13 / 16, tol: 0.1, answerText: '48.75' }
          ],
          explanation: r`- **(a)** $60$ mi/hr $= 60 \times 63{,}360 \div 60 = 63{,}360$ in/min. Stock radius $= 13$ in. $\omega = v/r = 63{,}360/13 \approx 4873.8$ rad/min $\div 2\pi \approx 775.7$ rpm.
- **(b)** A reading of $60$ means the wheels turn at the rpm from (a), $775.7$ rpm. The same $\omega$ on a radius-$16$ tire gives $v = r\omega$, which scales with $r$: $60 \times \tfrac{16}{13} \approx 73.85$ mi/hr. (The truck is going **faster** than the speedometer says.)
- **(c)** $60$ mi/hr $= 88$ ft/s $= 1056$ in/s. $\omega = v/r = 1056/16 = 66$ rad/s.
- **(d)** The wheels now turn **slower** than stock wheels would at 60 (radius 16 vs 13), so the reading is $60 \times \tfrac{13}{16} = 48.75$ mi/hr.
  *Check:* a stock tire at 48.75 mi/hr: $\omega = 48.75 \times 1056/60 \div 13 = 66$ rad/s — the same as (c) ✓.`
        })
      },
      {
        topicId: '4-5-transform',
        gen: () => {
          const T = U4.transform('cot', 2 * PI, -2, 1 / 3, -3);
          return {
            type: 'sketch',
            prompt: r`**Sketch** $y = 2\pi - 2\operatorname{arccot}\!\left(\dfrac{x}{3} - 1\right)$. Place both horizontal asymptotes, the center point, and the points on the graph where $x = 0$ and $x = 6$.`,
            sketch: {
              view: { xMin: -6, xMax: 12, yMin: -PI / 2, yMax: 5 * PI / 2, xStep: 1, yStep: PI / 2, xUnit: 'num', yUnit: 'rad' },
              snapX: 0.5, snapY: PI / 12,
              targets: [
                { label: 'Lower asymptote', kind: 'hline', y: 0 },
                { label: 'Upper asymptote', kind: 'hline', y: 2 * PI },
                { label: 'Center point', kind: 'point', x: 3, y: PI },
                { label: 'Point at x = 0', kind: 'point', x: 0, y: PI / 2 },
                { label: 'Point at x = 6', kind: 'point', x: 6, y: 3 * PI / 2 }
              ],
              answerFns: T.dom.map(iv => ({ f: T.f, domain: [iv.lo, iv.hi] }))
            },
            explanation: r`**Factor the inside first:** $\tfrac{x}{3} - 1 = \tfrac13(x - 3)$, so $c = \tfrac13$ and the shift is **right 3**. Outside: $a = 2\pi$, $b = -2$.
- **Asymptotes:** arccot's are $y = 0$ and $y = \pi$ → $2\pi - 2(0) = 2\pi$ and $2\pi - 2\pi = 0$. Range $(0, 2\pi)$.
- **Center:** inside $= 0$ at $x = 3$; $\operatorname{arccot} 0 = \tfrac{\pi}{2}$; $y = 2\pi - \pi = \pi$.
- $x = 0$: inside $= -1$; $\operatorname{arccot}(-1) = \tfrac{3\pi}{4}$; $y = 2\pi - \tfrac{3\pi}{2} = \tfrac{\pi}{2}$.
- $x = 6$: inside $= 1$; $\operatorname{arccot} 1 = \tfrac{\pi}{4}$; $y = 2\pi - \tfrac{\pi}{2} = \tfrac{3\pi}{2}$.
- arccot **decreases**, but $b < 0$ flips it: this graph **increases**, from $y \to 0$ on the left to $y \to 2\pi$ on the right. Domain: all reals.`
          };
        }
      },
      {
        topicId: '4-6-compose',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly, in radians**, without a calculator.`,
          fields: [
            Object.assign({ label: r`(a) $\arcsin\!\left(\cos\left(-\tfrac{5\pi}{6}\right)\right)$`, answer: -PI / 3, answerText: '−π/3' }, ANG),
            Object.assign({ label: r`(b) $\operatorname{arccsc}\!\left(\sec\tfrac{4\pi}{3}\right)$`, answer: -PI / 6, answerText: '−π/6' }, ANG),
            Object.assign({ label: r`(c) $\arccos\!\left(\tan\tfrac{3\pi}{4}\right)$`, answer: PI, answerText: 'π' }, ANG),
            Object.assign({ label: r`(d) $\arccos\!\left(\cos\left(-\tfrac{11\pi}{7}\right)\right)$`, answer: 3 * PI / 7, answerText: '3π/7' }, ANG)
          ],
          explanation: r`- **(a)** $\cos(-\tfrac{5\pi}{6}) = \cos\tfrac{5\pi}{6} = -\tfrac{\sqrt3}{2}$ (cosine is even). arcsin of a negative → QIV: $-\tfrac{\pi}{3}$.
- **(b)** $\cos\tfrac{4\pi}{3} = -\tfrac12$, so $\sec\tfrac{4\pi}{3} = -2$. $\operatorname{arccsc}(-2) = \arcsin(-\tfrac12) = -\tfrac{\pi}{6}$.
- **(c)** $\tan\tfrac{3\pi}{4} = -1$. $\arccos(-1) = \pi$.
- **(d)** $-\tfrac{11\pi}{7} + 2\pi = \tfrac{3\pi}{7}$, so $\cos(-\tfrac{11\pi}{7}) = \cos\tfrac{3\pi}{7}$. Since $\tfrac{3\pi}{7}$ is in $[0, \pi]$, $\arccos$ returns it: $\tfrac{3\pi}{7}$. (Not a table angle — you get it with a coterminal angle, not a calculator.)`
        })
      },
      {
        topicId: '4-6-recip',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly**, without a calculator. Fractions like \`-21/20\` are fine; give (d) in radians.`,
          fields: [
            Object.assign({ label: r`(a) $\sin\!\left(\arccos\left(-\tfrac{8}{17}\right)\right)$`, answer: 15 / 17, answerText: '15/17' }, FRAC),
            Object.assign({ label: r`(b) $\cot\!\left(\arcsin\left(-\tfrac{20}{29}\right)\right)$`, answer: -21 / 20, answerText: '−21/20' }, FRAC),
            Object.assign({ label: r`(c) $\sec\!\left(\arctan\left(-\tfrac{12}{5}\right)\right)$`, answer: 13 / 5, answerText: '13/5' }, FRAC),
            Object.assign({ label: r`(d) $\arccos\!\left(-\tfrac12\right) - 2\arctan\!\left(-\sqrt3\right)$`, answer: 4 * PI / 3, answerText: '4π/3' }, ANG)
          ],
          explanation: r`- **(a)** $\theta = \arccos(-\tfrac{8}{17})$ is in **QII**. Adjacent $-8$, hypotenuse $17$, opposite $\sqrt{17^2 - 8^2} = 15$. Sine is positive in QII: $\tfrac{15}{17}$.
- **(b)** $\theta = \arcsin(-\tfrac{20}{29})$ is in **QIV**. Opposite $-20$, hypotenuse $29$, adjacent $21$. $\cot\theta = \tfrac{21}{-20} = -\tfrac{21}{20}$.
- **(c)** $\theta = \arctan(-\tfrac{12}{5})$ is in **QIV**. Opposite $-12$, adjacent $5$, hypotenuse $13$. $\sec\theta = \tfrac{13}{5}$ (cosine, and so secant, is positive in QIV).
- **(d)** $\arccos(-\tfrac12) = \tfrac{2\pi}{3}$. $\arctan(-\sqrt3) = -\tfrac{\pi}{3}$, so $-2 \cdot (-\tfrac{\pi}{3}) = +\tfrac{2\pi}{3}$. Total: $\tfrac{4\pi}{3}$.`
        })
      }
    ]
  }];
})();
