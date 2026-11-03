/* Unit 2 — section 2-7: graphing sinusoids in radians; period vs. horizontal dilation. */
(function () {
  const U = window.UNIT_DATA['unit-2'];
  const { graphOf, randomSinusoid, texEq, PI } = window.U2;
  const r = String.raw;
  const sec = { id: '2-7', title: 'Sinusoids in radians', topics: [] };
  U.sections.push(sec);

  sec.topics.push({
    id: '2-7-graphing-radians', title: 'Graphing sinusoids (radian measure)',
    notes: r`## Same equation, new unit

$$y = C + A\cos\big(B(x - D)\big) \qquad\text{with } x \text{ in radians}$$

Everything from 2-4 carries over. The **only** change: a full cycle of the parent is $2\pi$ instead of $360^\circ$.

$$\text{period} = \frac{2\pi}{B} \qquad\qquad B = \frac{2\pi}{\text{period}}$$

- $y = \cos 2x$: period $\pi$
- $y = \sin\tfrac{x}{3}$: period $6\pi$
- $y = \cos(\pi x)$: period $\dfrac{2\pi}{\pi} = 2$ — a plain number! This happens in word problems where $x$ is time.

## Sketching in radians

1. Axis $y = C$; max $C + |A|$; min $C - |A|$.
2. Period $P = 2\pi/B$; quarter-period $P/4$.
3. Start at $x = D$ (cosine high point if $A > 0$); step by $P/4$ five times.
4. Label the $x$-axis in **multiples of the quarter-period** — not in $\tfrac{\pi}{2}$ steps unless that *is* the quarter-period.

Example: $y = 1 + 2\cos\big(3(x - \tfrac{\pi}{6})\big)$. Period $\tfrac{2\pi}{3}$, quarter $\tfrac{\pi}{6}$. Points at $x = \tfrac{\pi}{6}, \tfrac{\pi}{3}, \tfrac{\pi}{2}, \tfrac{2\pi}{3}, \tfrac{5\pi}{6}$ with $y = 3, 1, -1, 1, 3$.

## Reading an equation from a radian graph

Same as before: $C$ and $A$ from max/min; period from high-to-high (now a $\pi$-fraction, usually); $B = 2\pi/\text{period}$; $D$ from a high point.

> **Common mistake:** $B = 360^\circ/\text{period}$ in a radian problem. If the axis is labeled with $\pi$'s, use $2\pi$. If you get $B = 180$ for a graph with period $2$, you've mixed units.

> **Common mistake:** when $B = \pi$ (period 2), writing the period as $2\pi$ because "$\pi$ things have $\pi$ periods." Compute it: $2\pi \div \pi = 2$.`,
    explore: {
      type: 'trig', fn: 'cos', mode: 'rad', A: 2, B: 2, C: 1, D: PI / 6, sliders: ['A', 'B', 'C', 'D'], challenge: true, modeSwitch: true,
      show: { parent: false, axis: true, amplitude: true, period: true, critical: true },
      intro: 'Radian mode. $D$ now slides in steps of $\\tfrac{\\pi}{12}$. The critical-point labels show $x$ as $\\pi$-fractions. Challenge mode accepts answers like `pi/6` for $D$.',
      tasks: r`1. Build $y = 1 + 2\cos\big(3(x - \tfrac{\pi}{6})\big)$ and compare with the example in the notes.
2. Set $B = 0.5$. Read the period off the bracket. Compute $2\pi \div 0.5$ to confirm.
3. Flip to **degrees** with the switch, then back. Which numbers changed? Which stayed the same? (Only $D$ and the period change units; $A$, $B$, $C$ don't.)
4. Do Challenge mode until you can write a radian equation in under a minute.`
    },
    practice: [
      { q: r`Find the period of each: (a) $y = \sin 4x$ (b) $y = \cos\tfrac{2x}{5}$ (c) $y = 3\sin(\pi x)$ (d) $y = \cos\big(\tfrac{\pi}{4}x\big)$.`, hint: 'Period = 2π / B. For (c) and (d), the π cancels.', answer: r`(a) $\tfrac{\pi}{2}$ (b) $5\pi$ (c) $2$ (d) $8$`, solution: r`(a) $2\pi/4 = \tfrac{\pi}{2}$. (b) $2\pi \div \tfrac25 = 5\pi$. (c) $2\pi/\pi = 2$. (d) $2\pi \div \tfrac{\pi}{4} = 8$.` },
      { q: r`Sketch one cycle of $y = -2 + 3\sin\big(2(x - \tfrac{\pi}{4})\big)$. List the five critical points.`, hint: 'Period π, quarter π/4. Sine starts on its axis going up at x = D.', answer: r`$(\tfrac{\pi}{4}, -2),\ (\tfrac{\pi}{2}, 1),\ (\tfrac{3\pi}{4}, -2),\ (\pi, -5),\ (\tfrac{5\pi}{4}, -2)$`, solution: r`$C = -2$, $A = 3$: max $1$, min $-5$. Period $2\pi/2 = \pi$, quarter $\tfrac{\pi}{4}$. Start $x = \tfrac{\pi}{4}$ on the axis, then high, axis, low, axis.` },
      { q: r`A sinusoid has a high point at $(\tfrac{\pi}{3}, 6)$ and the next low point at $(\pi, -2)$. Write a cosine equation.`, hint: 'High to low is half a period.', answer: r`$y = 2 + 4\cos\big(\tfrac32(x - \tfrac{\pi}{3})\big)$`, solution: r`$C = (6 + (-2))/2 = 2$, $A = 4$. Half-period $= \pi - \tfrac{\pi}{3} = \tfrac{2\pi}{3}$, so period $= \tfrac{4\pi}{3}$ and $B = 2\pi \div \tfrac{4\pi}{3} = \tfrac32$. $D = \tfrac{\pi}{3}$.` },
      { q: r`A sinusoid has period $6$, amplitude $1.5$, axis $y = 10$, and a high point at $x = 1$. Write the equation.`, hint: 'B = 2π / 6.', answer: r`$y = 10 + 1.5\cos\big(\tfrac{\pi}{3}(x - 1)\big)$`, solution: r`$B = 2\pi/6 = \tfrac{\pi}{3}$. Cosine with high point at $x = 1$ means $D = 1$.` },
      { q: r`Find the $y$-intercept of $y = 3 + 2\cos\big(2(x - \tfrac{\pi}{3})\big)$ exactly.`, hint: 'x = 0. Cosine is even.', answer: r`$y = 2$`, solution: r`$y = 3 + 2\cos(-\tfrac{2\pi}{3}) = 3 + 2\cos\tfrac{2\pi}{3} = 3 + 2(-\tfrac12) = 2$.` }
    ],
    quiz: [
      function (rng) {
        const Bs = [{ b: 2, tex: '2' }, { b: 3, tex: '3' }, { b: 4, tex: '4' }, { b: 0.5, tex: '\\tfrac12' }, { b: 2 / 3, tex: '\\tfrac23' }, { b: PI, tex: '\\pi' }, { b: PI / 2, tex: '\\tfrac{\\pi}{2}' }, { b: PI / 4, tex: '\\tfrac{\\pi}{4}' }, { b: 2 * PI, tex: '2\\pi' }, { b: PI / 3, tex: '\\tfrac{\\pi}{3}' }];
        const B = rng.pick(Bs);
        const fn = rng.pick(['sin', 'cos']);
        const P = 2 * PI / B.b;
        return { type: 'number', parse: 'pi', prompt: 'Find the period of $y = \\' + fn + '(' + B.tex + ' x)$, where $x$ is in radians. (Exact — type `pi/2`, `6`, etc.)', answer: P, tol: 0.005, answerText: M.formatPi(P), explanation: r`Period $= 2\pi \div B = 2\pi \div ` + B.tex + ' = ' + M.texPi(P) + '$.' + (B.tex.includes('pi') ? ' The $\\pi$\'s cancel — the period is an ordinary number.' : '') };
      },
      function (rng) {
        const Ps = [{ p: PI, tex: '\\pi' }, { p: PI / 2, tex: '\\tfrac{\\pi}{2}' }, { p: 4 * PI, tex: '4\\pi' }, { p: 2 * PI / 3, tex: '\\tfrac{2\\pi}{3}' }, { p: 3 * PI, tex: '3\\pi' }, { p: 2, tex: '2' }, { p: 4, tex: '4' }, { p: 10, tex: '10' }, { p: 0.5, tex: '0.5' }, { p: 12, tex: '12' }];
        const P = rng.pick(Ps);
        const B = 2 * PI / P.p;
        return { type: 'number', parse: 'pi', prompt: 'A sinusoid (radians) has period $' + P.tex + '$. Find $B$ exactly.', answer: B, tol: 0.005, answerText: M.formatPi(B), explanation: r`$B = 2\pi \div \text{period} = 2\pi \div ` + P.tex + ' = ' + M.texPi(B) + '$.' + (!P.tex.includes('pi') ? ' A numeric period gives a $B$ with $\\pi$ in it.' : '') };
      },
      function (rng) {
        const p = randomSinusoid(rng, { mode: 'rad', fn: 'cos', A: rng.pick([1, 2, 3, 4, 1.5]), B: rng.pick([1, 2, 3, 0.5, 4]), D: rng.pick([0, PI / 6, PI / 4, PI / 3, PI / 2, -PI / 6]) });
        const P = 2 * PI / p.B;
        return {
          type: 'multi', prompt: 'For $' + texEq('cos', p.A, p.B, p.C, p.D, 'rad') + '$ (radians), find:',
          fields: [
            { label: 'period', parse: 'pi', answer: P, tol: 0.005, answerText: M.formatPi(P) },
            { label: 'maximum value', answer: p.C + p.A, tol: 0.01 },
            { label: '$x$ of first high point with $x \\ge 0$', parse: 'pi', answer: M.normalizeRad(p.D) % P, tol: 0.005, answerText: M.formatPi(M.normalizeRad(p.D) % P) },
            { label: '$x$ of the next **low** point after that', parse: 'pi', answer: (M.normalizeRad(p.D) % P) + P / 2, tol: 0.005, answerText: M.formatPi((M.normalizeRad(p.D) % P) + P / 2) }
          ],
          explanation: r`Period $2\pi/` + M.fmt(p.B) + ' = ' + M.texPi(P) + r`$. Max $= C + A = ` + M.fmt(p.C + p.A) + r`$. Cosine with $A > 0$ has a high point at $x = D = ` + M.texPi(p.D) + '$ (add/subtract periods to land in $x \\ge 0$). Low point is half a period later.'
        };
      },
      function (rng) {
        const p = randomSinusoid(rng, { mode: 'rad', fn: 'cos', A: rng.pick([1, 2, 3, 1.5]), B: rng.pick([1, 2, 0.5, 3]), D: rng.pick([0, PI / 6, PI / 4, PI / 3, PI / 2, 2 * PI / 3]) });
        const P = 2 * PI / p.B;
        return {
          type: 'multi', prompt: r`Write this radian graph as $y = C + A\cos\big(B(x - D)\big)$ with $A > 0$. (For $D$ type like \`pi/3\`.)`, graph: graphOf(Object.assign({}, p, { xStep: PI / 6, axis: false })),
          fields: [
            { label: '$A$', answer: p.A, tol: 0.1 },
            { label: '$B$', parse: 'pi', answer: p.B, tol: 0.02 },
            { label: '$C$', answer: p.C, tol: 0.1 },
            { label: '$D$', parse: 'pi', answer: p.D, modulo: P, tol: 0.03, answerText: M.formatPi(p.D) + ' (± ' + M.formatPi(P) + 'n)' }
          ],
          explanation: r`Max $` + M.fmt(p.C + p.A) + '$, min $' + M.fmt(p.C - p.A) + r`$ → $C = ` + M.fmt(p.C) + '$, $A = ' + M.fmt(p.A) + r`$. High-to-high $= ` + M.texPi(P) + r`$ → $B = 2\pi \div ` + M.texPi(P) + ' = ' + M.fmt(p.B) + r`$. A high point sits at $x = ` + M.texPi(p.D) + '$.',
          explainGraph: function (c) { graphOf(Object.assign({}, p, { xStep: PI / 6, axis: true }))(c); }
        };
      },
      function (rng) {
        const P = rng.pick([2, 4, 6, 8, 10, 12, 24]);
        const A = rng.pick([1, 2, 3, 5, 10]);
        const C = rng.pick([0, 5, 10, 20]);
        const D = rng.int(0, 3);
        const B = 2 * PI / P;
        const good = texEq('cos', A, B, C, D, 'num');
        const d1 = texEq('cos', A, P, C, D, 'num');
        const d2 = texEq('cos', A, 2 * PI * P, C, D, 'num');
        const d3 = texEq('cos', A, 360 / P, C, D, 'num');
        return { type: 'mc', prompt: 'Which equation has period $' + P + '$, amplitude $' + A + '$, axis $y = ' + C + '$, and a high point at $x = ' + D + '$?', choices: [{ text: '$' + good + '$', correct: true }, { text: '$' + d1 + '$', correct: false }, { text: '$' + d2 + '$', correct: false }, { text: '$' + d3 + '$', correct: false }], explanation: r`$B = 2\pi/` + P + ' = ' + M.texPi(B) + '$. Not $' + P + '$ (that\'s the period), not $2\\pi \\cdot ' + P + '$, and not $360/' + P + '$ (degree formula — but there are no degrees here).' };
      }
    ]
  });

  sec.topics.push({
    id: '2-7-dilation', title: 'Period vs. horizontal dilation',
    notes: r`## Two ways to say the same thing

Replacing $x$ with $Bx$ is a **horizontal dilation by a factor of $\dfrac{1}{B}$**. Every $x$-coordinate on the parent graph gets multiplied by $\tfrac1B$.

- $B = 2$ → dilation factor $\tfrac12$ → graph is **squeezed** to half its width → period $\tfrac{2\pi}{2} = \pi$
- $B = \tfrac13$ → dilation factor $3$ → graph is **stretched** to triple width → period $6\pi$

So the period is just the parent's period, $2\pi$, times the dilation factor:

$$\text{period} = 2\pi \cdot \frac{1}{B} = \frac{2\pi}{B}$$

## Reading the four transformations

$$y = C + A\cos\big(B(x - D)\big)$$

| **letter** | **transformation** | **factor / amount** |
| --- | --- | --- |
| $A$ | vertical dilation | $A$ |
| $B$ | horizontal dilation | $\dfrac{1}{B}$ ← reciprocal! |
| $C$ | vertical translation | $C$ |
| $D$ | horizontal translation | $D$ |

The horizontal ones are "backwards" because they live **inside** the function, where they act on $x$ *before* cosine sees it. That's also why $(x - D)$ shifts **right**.

> **Common mistake:** "horizontal dilation by $B$." No — by $\tfrac1B$. A dilation by $2$ *doubles* widths; $\cos 2x$ *halves* them.

## Describing in words

"$y = \sin 3x$ is $y = \sin x$ dilated horizontally by a factor of $\tfrac13$." Equivalent: "compressed horizontally by a factor of 3," or "period reduced to $\tfrac{2\pi}{3}$." Know all three phrasings.

## Order of operations when $D \ne 0$

$y = \cos\big(2(x - \tfrac{\pi}{4})\big)$: the algebra says "subtract $D$, then multiply by $B$," which on the graph means **translate right $D$, and dilate by $\tfrac1B$ about the line $x = D$**. In practice you never have to think about that order: find $D$ (a high point) and lay out the squeezed cycle starting there. That's exactly the 5-point method — which is why it never fails.`,
    explore: {
      type: 'trig', fn: 'cos', mode: 'rad', A: 1, B: 1, C: 0, D: 0, sliders: ['B', 'D'], challenge: false, modeSwitch: false,
      show: { parent: true, axis: false, amplitude: false, period: true, critical: true },
      intro: 'Parent cosine is dashed. Slide $B$ and watch the high point that was at $x = 2\\pi$ move to $x = \\tfrac{2\\pi}{B}$ — every $x$-coordinate is multiplied by $\\tfrac1B$.',
      tasks: r`1. Set $B = 2$. The parent's low point at $x = \pi$ moved where? Multiply $\pi$ by $\tfrac12$.
2. Set $B = 0.5$. Dilation factor? Period? Which direction did the graph change — wider or narrower?
3. Set $B = 2$ and $D = \tfrac{\pi}{4}$. Is the high point at $D$, or at $D/2$? (This is the reason your book writes $B(x - D)$ and not $Bx - D$.)`
    },
    practice: [
      { q: r`Describe $y = \cos 4x$ as a transformation of $y = \cos x$. State the period.`, hint: 'Dilation factor is 1/B.', answer: r`Horizontal dilation by $\tfrac14$ (compressed to a quarter of the width); period $\tfrac{\pi}{2}$.`, solution: r`$B = 4 \Rightarrow$ factor $\tfrac14$. Period $= 2\pi \cdot \tfrac14 = \tfrac{\pi}{2}$.` },
      { q: r`$y = \sin x$ is dilated horizontally by a factor of $5$. Write the new equation and its period.`, hint: 'Factor 5 means B = 1/5.', answer: r`$y = \sin\tfrac{x}{5}$; period $10\pi$`, solution: r`Dilation factor $\tfrac1B = 5 \Rightarrow B = \tfrac15$. Period $= 2\pi \cdot 5 = 10\pi$.` },
      { q: r`The point $(\tfrac{\pi}{2}, 1)$ is on $y = \sin x$. Where does it land on $y = \sin 3x$? On $y = 2\sin 3x$? On $y = 2\sin\big(3(x - \tfrac{\pi}{6})\big)$?`, hint: 'x gets multiplied by 1/3; y by 2; then shift right π/6.', answer: r`$(\tfrac{\pi}{6}, 1)$; $(\tfrac{\pi}{6}, 2)$; $(\tfrac{\pi}{3}, 2)$`, solution: r`Horizontal dilation $\tfrac13$: $x = \tfrac{\pi}{2} \cdot \tfrac13 = \tfrac{\pi}{6}$. Vertical dilation $2$: $y = 2$. Translation right $\tfrac{\pi}{6}$: $x = \tfrac{\pi}{6} + \tfrac{\pi}{6} = \tfrac{\pi}{3}$.` },
      { q: r`Explain why $y = \cos(2x - \tfrac{\pi}{2})$ does **not** have a high point at $x = \tfrac{\pi}{2}$, and find where it does.`, hint: 'Factor the 2 out.', answer: r`$\cos(2x - \tfrac{\pi}{2}) = \cos\big(2(x - \tfrac{\pi}{4})\big)$, so the high point is at $x = \tfrac{\pi}{4}$.`, solution: r`The dilation acts on everything inside, including the shift. Factoring: $2x - \tfrac{\pi}{2} = 2(x - \tfrac{\pi}{4})$. The phase displacement is $\tfrac{\pi}{4}$, half of what it looks like.` }
    ],
    quiz: [
      function (rng) {
        const B = rng.pick([2, 3, 4, 5, 0.5, 0.25, 1 / 3, 2 / 3, 1.5]);
        const fn = rng.pick(['sin', 'cos']);
        const bt = M.fmt(B, 3);
        const fac = 1 / B;
        return { type: 'number', prompt: 'By what **factor** is $y = \\' + fn + ' x$ dilated horizontally to get $y = \\' + fn + '(' + bt + 'x)$? (Type a fraction or decimal.)', answer: fac, tol: 0.01, answerText: M.fmt(fac, 4), explanation: r`Horizontal dilation factor $= \dfrac1B = \dfrac{1}{` + bt + '} = ' + M.fmt(fac, 4) + '$. ' + (B > 1 ? 'Factor less than 1 → compressed.' : 'Factor greater than 1 → stretched.') };
      },
      function (rng) {
        const fac = rng.pick([2, 3, 4, 5, 0.5, 0.25, 1.5]);
        const fn = rng.pick(['sin', 'cos']);
        const B = 1 / fac;
        return { type: 'multi', prompt: '$y = \\' + fn + ' x$ is dilated horizontally by a factor of $' + M.fmt(fac) + '$. Find $B$ in the new equation and the new period.', fields: [{ label: '$B$', answer: B, tol: 0.01, answerText: M.fmt(B, 4) }, { label: 'period', parse: 'pi', answer: 2 * PI * fac, tol: 0.01, answerText: M.formatPi(2 * PI * fac) }], explanation: r`Factor $= 1/B$, so $B = 1/` + M.fmt(fac) + ' = ' + M.fmt(B, 4) + r`$. Period $= 2\pi \times ` + M.fmt(fac) + ' = ' + M.texPi(2 * PI * fac) + '$.' };
      },
      function (rng) {
        const B = rng.pick([2, 3, 4, 0.5]);
        const A = rng.pick([1, 2, 3]);
        const D = rng.pick([0, PI / 6, PI / 4, PI / 3]);
        const fn = rng.pick(['sin', 'cos']);
        const px = fn === 'sin' ? PI / 2 : PI;  // a landmark point on the parent
        const py = fn === 'sin' ? 1 : -1;
        const nx = px / B + D, ny = A * py;
        return { type: 'multi', prompt: 'The point $\\left(' + M.texPi(px) + ', ' + py + '\\right)$ is on $y = \\' + fn + ' x$. Where does it land on $' + texEq(fn, A, B, 0, D, 'rad') + '$? (For $x$ type like `pi/6`.)', fields: [{ label: 'new $x$', parse: 'pi', answer: nx, tol: 0.005, answerText: M.formatPi(nx) }, { label: 'new $y$', answer: ny, tol: 0.01 }], explanation: r`$x$: multiply by $\tfrac1B = ` + M.fmt(1 / B, 4) + '$ to get $' + M.texPi(px / B) + '$, then translate by $D = ' + M.texPi(D) + '$: $' + M.texPi(nx) + r`$. $y$: multiply by $A$: $` + ny + '$.' };
      },
      function (rng) {
        const B = rng.pick([2, 3, 4, 0.5]);
        const fn = rng.pick(['sin', 'cos']);
        const P = 2 * PI / B;
        const choices = [
          { text: 'horizontal dilation by $' + M.fmt(1 / B, 3) + '$; period $' + M.texPi(P) + '$', correct: true },
          { text: 'horizontal dilation by $' + M.fmt(B) + '$; period $' + M.texPi(P) + '$', correct: false },
          { text: 'horizontal dilation by $' + M.fmt(1 / B, 3) + '$; period $' + M.texPi(2 * PI * B) + '$', correct: false },
          { text: 'vertical dilation by $' + M.fmt(B) + '$; period $2\\pi$', correct: false }
        ];
        return { type: 'mc', prompt: 'Which correctly describes $y = \\' + fn + '(' + M.fmt(B) + 'x)$ relative to $y = \\' + fn + ' x$?', choices, explanation: r`Inside the function, $B$ dilates horizontally by the **reciprocal** $\tfrac1B = ` + M.fmt(1 / B, 3) + r`$, and the period becomes $2\pi \cdot \tfrac1B = ` + M.texPi(P) + '$.' };
      }
    ]
  });
})();
