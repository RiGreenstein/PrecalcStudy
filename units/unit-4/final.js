/* Unit 4 — final practice test: fixed, timed, covers all five test topics
   (velocity · exact values · writing one inverse as another · equations · inequalities). Listed first among the challenges. */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { PI } = U4;
  const r = String.raw;
  const ANG = { parse: 'angle', tol: 0.005 };
  const FRAC = { parse: 'any', tol: 0.002 };
  const TWO = 2 * PI;
  const IV = (lo, hi, loC, hiC) => ({ lo, hi, loC, hiC });

  const EXPR = ' Type it like `arcsin(sqrt(1-x^2)/(2x))` or `pi - arccos(abs(x)/3)` (use parentheses).';
  const SOLS = ' List **every** solution separated by commas (exact values like `sqrt(3)/2` or `2 - sqrt(3)`), or type `no solution`.';
  const INTS = ' on $0 \\le x < 2\\pi$. Answer in interval notation, like `[0, pi/6] U (5pi/6, 2pi)`.';
  const expr = (prompt, F, G, region, answerText, explanation) => ({
    type: 'text', placeholder: 'e.g. pi - arccos(abs(x)/3)', prompt: prompt + EXPR,
    check: U4.convCheck(F, G, region), answerText, explanation
  });
  const sols = (prompt, answers, explanation, verify, text) => ({
    type: 'text', placeholder: 'e.g. 1/6, -sqrt(3)/2', prompt: prompt + SOLS,
    check: U4.valuesCheck(answers), answerText: text || answers.map(v => U4.surd(v)).join(', '), explanation, verify
  });
  const ints = (prompt, list, explanation, verify, label) => ({
    type: 'text', placeholder: 'e.g. [0, pi/6] U (5pi/6, 2pi)', prompt: prompt + INTS,
    check: U4.intervalsCheck(list), answerText: U4.intervalsText(list, label), explanation, verify
  });

  const A3 = Math.atan(3);
  const lab3 = x => Math.abs(x - A3) < 1e-9 ? { t: 'arctan(3)', tex: '\\arctan 3' } : Math.abs(x - PI - A3) < 1e-9 ? { t: 'π + arctan(3)', tex: '\\pi + \\arctan 3' } : { t: M.formatPi(x, 24), tex: M.texPi(x, 24) };

  const FINAL = {
    id: 'final',
    title: 'Unit 4 final practice test',
    minutes: 60,
    description: 'Full-length test on all five topics: velocity, exact values, writing one inverse function as another, equations, and inequalities.',
    questions: [
      // ---------- velocity ----------
      {
        topicId: '4-4-connected',
        gen: () => ({
          type: 'multi',
          prompt: r`**Bicycle.** The pedal sprocket has radius $4$ in and the rear sprocket has radius $1.6$ in, connected by a chain. The rear wheel (diameter $26$ in) is on the same axle as the rear sprocket. The rider pedals at $60$ rpm. ($1$ mi $= 63{,}360$ in.)

{{fig:u4-bike}}`,
          fields: [
            { label: '(a) rpm of the rear wheel', answer: 150, tol: 0.5, answerText: '150' },
            { label: '(b) speed of the bike (mi/hr)', answer: 11.6025, tol: 0.05, answerText: '11.60' },
            { label: '(c) pedaling rpm needed to go $20$ mi/hr', answer: 103.426, tol: 0.3, answerText: '103.4' },
            { label: '(d) angular velocity of the pedal sprocket at $60$ rpm (rad/s)', answer: TWO, tol: 0.01, answerText: '2π ≈ 6.283' }
          ],
          explanation: r`- **(a) Chain → same linear speed** at both sprockets: $4 \cdot 60 = 1.6\,\omega \Rightarrow \omega = 150$ rpm. The wheel shares the rear sprocket's axle, so it also turns at $150$ rpm.
- **(b)** $v = r\omega = 13 \cdot 150 \cdot 2\pi = 3900\pi$ in/min $\approx 12{,}252$ in/min. Multiply by $60$, divide by $63{,}360$: $\approx 11.60$ mi/hr.
- **(c)** $20$ mi/hr $= 20 \cdot 63{,}360 / 60 = 21{,}120$ in/min. Wheel: $\omega = 21{,}120/13 \approx 1624.6$ rad/min $\div 2\pi \approx 258.6$ rpm. Chain: $1.6 \cdot 258.6 = 4\,\omega_p \Rightarrow \omega_p \approx 103.4$ rpm. *(Shortcut: speed is proportional to pedal rpm, so $60 \cdot \frac{20}{11.60} \approx 103.4$.)*
- **(d)** $60$ rev/min $= 1$ rev/s $= 2\pi$ rad/s $\approx 6.283$.`
        })
      },
      {
        topicId: '4-4-linear',
        gen: () => ({
          type: 'multi',
          prompt: r`**Ferris wheel.** A Ferris wheel with **diameter** $150$ ft makes one revolution every $4$ minutes.`,
          fields: [
            { label: '(a) angular velocity (rad/min)', answer: PI / 2, tol: 0.005, answerText: 'π/2 ≈ 1.571' },
            { label: '(b) linear speed of a rider (ft/s)', answer: 5 * PI / 8, tol: 0.005, answerText: '5π/8 ≈ 1.963' },
            { label: '(c) distance a rider travels in $10$ minutes (ft)', answer: 375 * PI, tol: 0.5, answerText: '375π ≈ 1178.1' },
            { label: '(d) angle the wheel turns in $50$ seconds (degrees)', answer: 75, tol: 0.5, answerText: '75' }
          ],
          explanation: r`- **(a)** $\omega = \frac{\theta}{t} = \frac{2\pi}{4} = \frac{\pi}{2}$ rad/min.
- **(b)** Radius $75$ ft (not 150!). $v = r\omega = 75 \cdot \frac{\pi}{2} = \frac{75\pi}{2}$ ft/min $\div 60 = \frac{5\pi}{8} \approx 1.963$ ft/s.
- **(c)** $a = vt = \frac{75\pi}{2} \cdot 10 = 375\pi \approx 1178.1$ ft.
- **(d)** $50$ s $= \frac56$ min. $\theta = \omega t = \frac{\pi}{2} \cdot \frac56 = \frac{5\pi}{12}$ rad $= 75^\circ$.`
        })
      },
      // ---------- exact values ----------
      {
        topicId: '4-6-recip',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly, in radians**, without a calculator.`,
          fields: [
            Object.assign({ label: r`(a) $\arcsin\left(-\tfrac{\sqrt3}{2}\right)$`, answer: -PI / 3, answerText: '−π/3' }, ANG),
            Object.assign({ label: r`(b) $\arccos\left(-\tfrac{\sqrt2}{2}\right)$`, answer: 3 * PI / 4, answerText: '3π/4' }, ANG),
            Object.assign({ label: r`(c) $\operatorname{arccot}\left(-\sqrt3\right)$`, answer: 5 * PI / 6, answerText: '5π/6' }, ANG),
            Object.assign({ label: r`(d) $\operatorname{arccsc}(-2)$`, answer: -PI / 6, answerText: '−π/6' }, ANG)
          ],
          explanation: r`- **(a)** Reference $\frac{\pi}{3}$. arcsin answers on the right half, negative → QIV: $-\frac{\pi}{3}$.
- **(b)** Reference $\frac{\pi}{4}$. arccos answers on the top half, negative → QII: $\pi - \frac{\pi}{4} = \frac{3\pi}{4}$.
- **(c)** $\cot\frac{\pi}{6} = \sqrt3$, so the reference is $\frac{\pi}{6}$. arccot is top half → QII: $\frac{5\pi}{6}$. (**Not** $-\frac{\pi}{6}$.)
- **(d)** $\operatorname{arccsc}(-2) = \arcsin(-\frac12) = -\frac{\pi}{6}$.`
        })
      },
      {
        topicId: '4-6-compose',
        gen: () => ({
          type: 'multi',
          prompt: r`Find each **exactly**, without a calculator. Give (a) and (b) in radians; fractions like \`-3/4\` are fine for (c) and (d).`,
          fields: [
            Object.assign({ label: r`(a) $\arccos\left(\sin\left(-\tfrac{\pi}{6}\right)\right)$`, answer: 2 * PI / 3, answerText: '2π/3' }, ANG),
            Object.assign({ label: r`(b) $\arctan\left(\tan\tfrac{5\pi}{6}\right)$`, answer: -PI / 6, answerText: '−π/6' }, ANG),
            Object.assign({ label: r`(c) $\sin\left(\arccos\left(-\tfrac{5}{13}\right)\right)$`, answer: 12 / 13, answerText: '12/13' }, FRAC),
            Object.assign({ label: r`(d) $\tan\left(\operatorname{arcsec}\left(-\tfrac{5}{4}\right)\right)$`, answer: -0.75, answerText: '−3/4' }, FRAC)
          ],
          explanation: r`- **(a)** $\sin(-\frac{\pi}{6}) = -\frac12$, and $\arccos(-\frac12) = \frac{2\pi}{3}$.
- **(b)** $\tan\frac{5\pi}{6} = -\frac{\sqrt3}{3}$, and $\arctan(-\frac{\sqrt3}{3}) = -\frac{\pi}{6}$. It does **not** cancel to $\frac{5\pi}{6}$, which is outside arctan's range.
- **(c)** $\theta$ is in QII. Adjacent $-5$, hypotenuse $13$, opposite $12$. Sine is positive: $\frac{12}{13}$.
- **(d)** $\operatorname{arcsec}(-\frac54) = \arccos(-\frac45)$, in QII. Adjacent $-4$, hypotenuse $5$, opposite $3$. $\tan\theta = \frac{3}{-4} = -\frac34$.`
        })
      },
      // ---------- writing one inverse as another ----------
      {
        topicId: '4-7-triangle',
        gen: () => expr(r`Write $\arccos x$ using **only** arccot, for $-1 < x < 1$.`, 'cos', 'cot', 'all', 'arccot(x/sqrt(1-x^2))',
          r`$\theta = \arccos x$, so $\cos\theta = \frac{x}{1}$: adjacent $x$, hypotenuse $1$, opposite $\sqrt{1-x^2}$. $\cot\theta = \frac{x}{\sqrt{1-x^2}}$.

Range check: arccos and arccot both answer on the **top half**, and the ratio has the sign of $x$. So one formula works for all $-1 < x < 1$:
$$\arccos x = \operatorname{arccot}\frac{x}{\sqrt{1-x^2}}$$`)
      },
      {
        topicId: '4-7-range',
        gen: () => expr(r`Write $\arcsin x$ using **only** arccos, for $-1 \le x < 0$.`, 'sin', 'cos', 'neg', '-arccos(sqrt(1-x^2))',
          r`Triangle: opposite $x$, hypotenuse $1$, adjacent $\sqrt{1-x^2}$, so the Quadrant I formula is $\arccos\sqrt{1-x^2}$.

For $x < 0$, $\arcsin x$ is a **negative** angle (QIV), but arccos is never negative. $\arccos\sqrt{1-x^2}$ is the reference angle, so negate it:
$$\arcsin x = -\arccos\sqrt{1-x^2} \quad (-1 \le x < 0)$$
Check $x = -\frac12$: $-\arccos\frac{\sqrt3}{2} = -\frac{\pi}{6}$ ✓.`)
      },
      {
        topicId: '4-7-range',
        gen: () => expr(r`Write $\operatorname{arcsec} x$ using **only** arctan, for $x \le -1$.`, 'sec', 'tan', 'neg', 'pi - arctan(sqrt(x^2-1))',
          r`Triangle: hypotenuse $x$, adjacent $1$, opposite $\sqrt{x^2-1}$, so $\tan\theta = \sqrt{x^2-1}$ in Quadrant I.

For $x \le -1$, $\operatorname{arcsec} x$ is in **Quadrant II**, but $\arctan\sqrt{x^2-1}$ is in Quadrant I. It's the reference angle, so
$$\operatorname{arcsec} x = \pi - \arctan\sqrt{x^2-1} \quad (x \le -1)$$
Check $x = -2$: $\pi - \arctan\sqrt3 = \frac{2\pi}{3} = \operatorname{arcsec}(-2)$ ✓.`)
      },
      // ---------- equations ----------
      {
        topicId: '4-8-solve',
        gen: () => sols(r`Solve: $\arctan x + \arctan(2x) = \arctan 3$.`, [0.5],
          r`Take $\tan$: $\frac{x + 2x}{1 - 2x^2} = 3 \Rightarrow 3x = 3 - 6x^2 \Rightarrow 2x^2 + x - 1 = 0 \Rightarrow (2x - 1)(x + 1) = 0$.

**Check** $x = -1$: $\arctan(-1) + \arctan(-2) \approx -1.89$, but $\arctan 3 \approx 1.25$ ✗ (off by $\pi$).
**Check** $x = \frac12$: $\arctan\frac12 + \arctan 1 \approx 0.464 + 0.785 = 1.249$ ✓. **Answer:** $x = \frac12$.`,
          { f: x => Math.atan(x) + Math.atan(2 * x) - A3, lo: -30, hi: 30 })
      },
      {
        topicId: '4-8-solve',
        gen: () => sols(r`Solve: $\arcsin(2x) = \arccos x$.`, [1 / Math.sqrt(5)],
          r`Take $\sin$: $2x = \sin(\arccos x) = \sqrt{1-x^2}$. Square: $4x^2 = 1 - x^2$, so $x = \pm\frac{1}{\sqrt5} = \pm\frac{\sqrt5}{5}$.

**Check** the negative one: $\arcsin$ of a negative number is negative, but $\arccos$ of a negative number is more than $\frac{\pi}{2}$ ✗ (squaring created it). **Answer:** $x = \frac{\sqrt5}{5}$.`,
          { f: x => Math.asin(2 * x) - Math.acos(x), lo: -0.5, hi: 0.5 })
      },
      {
        topicId: '4-8-complement',
        gen: () => sols(r`Solve: $\operatorname{arccot} x - \arctan x = \dfrac{\pi}{3}$.`, [2 - Math.sqrt(3)],
          r`Use $\operatorname{arccot} x = \frac{\pi}{2} - \arctan x$: $\frac{\pi}{2} - 2\arctan x = \frac{\pi}{3} \Rightarrow \arctan x = \frac{\pi}{12}$, so $x = \tan\frac{\pi}{12}$.

$\tan\frac{\pi}{12} = \tan\left(\frac{\pi}{4} - \frac{\pi}{6}\right) = \frac{1 - \frac{\sqrt3}{3}}{1 + \frac{\sqrt3}{3}} = \frac{3 - \sqrt3}{3 + \sqrt3} = \frac{(3-\sqrt3)^2}{6} = 2 - \sqrt3$.

**Answer:** $x = 2 - \sqrt3 \approx 0.268$.`,
          { f: x => (PI / 2 - Math.atan(x)) - Math.atan(x) - PI / 3, lo: -30, hi: 30 }, '2 − √3')
      },
      {
        topicId: '4-8-solve',
        gen: () => sols(r`Solve: $\arcsin x = \arctan\left(\sqrt3\,x\right)$.`, [0, Math.sqrt(6) / 3, -Math.sqrt(6) / 3],
          r`Take $\sin$: $x = \frac{\sqrt3\,x}{\sqrt{1 + 3x^2}}$. **Don't divide by $x$.** Either $x = 0$, or $\sqrt{1+3x^2} = \sqrt3 \Rightarrow x^2 = \frac23 \Rightarrow x = \pm\frac{\sqrt6}{3}$.

**Check:** both sides are right-half functions with the sign of $x$, so nothing is extraneous. At $x = \frac{\sqrt6}{3} \approx 0.816$: $\arcsin(0.816) \approx 0.955$ and $\arctan(1.414) \approx 0.955$ ✓.

**Answer:** $x = 0, \pm\frac{\sqrt6}{3}$.`,
          { f: x => Math.asin(x) - Math.atan(Math.sqrt(3) * x), lo: -1, hi: 1 })
      },
      // ---------- inequalities ----------
      {
        topicId: '4-9-rewrite',
        gen: () => ints(r`Solve $2\cos^2 x - \cos x - 1 < 0$`, [IV(0, 2 * PI / 3, false, false), IV(4 * PI / 3, TWO, false, false)],
          r`Factor: $(2\cos x + 1)(\cos x - 1) < 0$, so $-\frac12 < \cos x < 1$.

Cosine is above $-\frac12$ except on $[\frac{2\pi}{3}, \frac{4\pi}{3}]$. It equals $1$ at $x = 0$, which must be **excluded**. That's why the answer starts with a parenthesis:
$$x \in \left(0, \tfrac{2\pi}{3}\right) \cup \left(\tfrac{4\pi}{3}, 2\pi\right)$$`,
          { g: x => 2 * Math.cos(x) ** 2 - Math.cos(x) - 1, op: '<', undef: [] })
      },
      {
        topicId: '4-9-rewrite',
        gen: () => ints(r`Solve $4\cos^2\left(x - \dfrac{\pi}{6}\right) \ge 3$`, [IV(0, PI / 3, true, true), IV(PI, 4 * PI / 3, true, true)],
          r`Let $u = x - \frac{\pi}{6}$, so $u \in [-\frac{\pi}{6}, \frac{11\pi}{6})$. We need $|\cos u| \ge \frac{\sqrt3}{2}$: $u$ within $\frac{\pi}{6}$ of $0$ or of $\pi$.

In that interval: $u \in [-\frac{\pi}{6}, \frac{\pi}{6}] \cup [\frac{5\pi}{6}, \frac{7\pi}{6}]$. (The next piece would start at $\frac{11\pi}{6}$, which is excluded.)

Add $\frac{\pi}{6}$: $x \in \left[0, \frac{\pi}{3}\right] \cup \left[\pi, \frac{4\pi}{3}\right]$.`,
          { g: x => 4 * Math.cos(x - PI / 6) ** 2 - 3, op: '>=', undef: [] })
      },
      {
        topicId: '4-9-basic',
        gen: () => ints(r`Solve $\tan x \le 3$. Exact boundaries using arctan, or decimals to 3 places.`, [IV(0, A3, true, true), IV(PI / 2, PI + A3, false, true), IV(3 * PI / 2, TWO, false, false)],
          r`Boundary points: $\tan x = 3$ at $x = \arctan 3 \approx 1.249$ and $\pi + \arctan 3 \approx 4.391$. Asymptotes at $\frac{\pi}{2}, \frac{3\pi}{2}$.

Tangent is $\le 3$ from $0$ up to $\arctan 3$, then again right after each asymptote (it starts at $-\infty$) until it reaches $3$:
$$x \in [0, \arctan 3] \cup \left(\tfrac{\pi}{2}, \pi + \arctan 3\right] \cup \left(\tfrac{3\pi}{2}, 2\pi\right)$$`,
          { g: x => Math.tan(x) - 3, op: '<=', undef: [PI / 2, 3 * PI / 2] }, lab3)
      },
      {
        topicId: '4-9-rewrite',
        gen: () => ints(r`Solve $\cos x - \sin x > 0$`, [IV(0, PI / 4, true, false), IV(5 * PI / 4, TWO, false, false)],
          r`**Don't divide by $\cos x$.** Its sign changes. Instead combine into one sinusoid: $\cos x - \sin x = \sqrt2\cos\left(x + \frac{\pi}{4}\right)$.

So we need $\cos u > 0$ with $u = x + \frac{\pi}{4} \in [\frac{\pi}{4}, \frac{9\pi}{4})$: $u \in [\frac{\pi}{4}, \frac{\pi}{2}) \cup (\frac{3\pi}{2}, \frac{9\pi}{4})$.

Subtract $\frac{\pi}{4}$: $x \in \left[0, \frac{\pi}{4}\right) \cup \left(\frac{5\pi}{4}, 2\pi\right)$. (Check $x = 0$: $1 - 0 > 0$ ✓, so $0$ is included.)`,
          { g: x => Math.cos(x) - Math.sin(x), op: '>', undef: [] })
      }
    ]
  };

  U.challenges = [FINAL].concat(U.challenges || []);
})();
