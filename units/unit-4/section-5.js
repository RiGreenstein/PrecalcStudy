/* Unit 4 — section 4-5: graphs of the inverse circular functions (and transformed versions). */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const U4 = window.U4;
  const { INV, ORDER, PI } = U4;
  const r = String.raw;
  const sec = { id: '4-5', title: 'Inverse circular function graphs', topics: [] };
  U.sections.push(sec);

  const STD_VIEW = { xMin: -4.2, xMax: 4.2, yMin: -2.1, yMax: 3.7, xStep: 1, yStep: PI / 2 };
  const ASYM_TEXT = { sin: 'none', cos: 'none', tan: 'y = −π/2 and y = π/2', cot: 'y = 0 and y = π', sec: 'y = π/2', csc: 'y = 0' };
  const dirText = k => INV[k].dir > 0 ? 'increasing' : 'decreasing';

  // ======================= flashcards + drill =======================
  function flashExplorer(container, L) {
    const { Graph, R } = L;
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const ctl = R.el('div', { class: 'btn-row' }); root.appendChild(ctl);
    const st = { order: ORDER.slice(), open: {} };
    const bAll = R.el('button', { class: 'btn btn-ghost btn-sm', text: 'Reveal all' });
    const bNone = R.el('button', { class: 'btn btn-ghost btn-sm', text: 'Hide all' });
    const bShuf = R.el('button', { class: 'btn btn-ghost btn-sm', text: 'Shuffle' });
    ctl.appendChild(bAll); ctl.appendChild(bNone); ctl.appendChild(bShuf);
    const grid = R.el('div', { class: 'flash-grid' }); root.appendChild(grid);
    bAll.addEventListener('click', () => { ORDER.forEach(k => st.open[k] = true); render(); });
    bNone.addEventListener('click', () => { st.open = {}; render(); });
    bShuf.addEventListener('click', () => { st.order = M.rng(Date.now() & 0xffff).shuffle(ORDER); st.open = {}; render(); });

    function render() {
      grid.innerHTML = '';
      st.order.forEach(k => {
        const P = INV[k];
        const card = R.el('div', { class: 'flash', tabindex: '0', role: 'button', 'aria-expanded': String(!!st.open[k]) });
        card.appendChild(R.el('div', { class: 'flash-title', html: R.tex('y = ' + P.tex + ' x') }));
        if (!st.open[k]) {
          card.appendChild(R.el('div', { class: 'flash-hidden', text: 'Say the domain, range, what’s excluded, and sketch it. Then click.' }));
        } else {
          const g = R.el('div', { class: 'flash-graph' }); card.appendChild(g);
          setTimeout(() => U4.drawInverse(g, { key: k, labels: false, height: 170, view: STD_VIEW }), 0);
          const body = R.el('div', { class: 'flash-body' });
          body.innerHTML = [['Domain', P.domainText], ['Range', P.rangeText], ['Asymptotes', ASYM_TEXT[k]], ['Direction', dirText(k)]]
            .map(x => '<div class="info-row"><span>' + x[0] + '</span><strong>' + x[1] + '</strong></div>').join('') +
            '<div class="info-note">' + P.na + '</div>';
          card.appendChild(body);
        }
        const toggle = () => { st.open[k] = !st.open[k]; render(); };
        card.addEventListener('click', toggle);
        card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
        grid.appendChild(card);
      });
    }
    render();

    // ---- quick drill ----
    const drill = R.el('div', { class: 'drill' }); root.appendChild(drill);
    drill.appendChild(R.el('h4', { text: 'Quick drill' }));
    const stats = R.el('div', { class: 'drill-stats' }); drill.appendChild(stats);
    const qBox = R.el('div', { class: 'drill-q' }); drill.appendChild(qBox);
    const choiceBox = R.el('div', { class: 'drill-choices' }); drill.appendChild(choiceBox);
    const fb = R.el('div', { class: 'quiz-feedback' }); drill.appendChild(fb);
    const next = R.el('button', { class: 'btn btn-primary btn-sm', text: 'Next' }); drill.appendChild(next);
    const ds = { right: 0, total: 0, streak: 0 };
    let rng = M.rng(Date.now() & 0xffff);
    next.addEventListener('click', ask);

    function ask() {
      fb.innerHTML = ''; choiceBox.innerHTML = '';
      const k = rng.pick(ORDER), P = INV[k];
      const type = rng.pick(['range', 'range', 'domain', 'which', 'asym', 'dir']);
      let prompt, opts, correct;
      const uniq = arr => Array.from(new Set(arr));
      if (type === 'range') { prompt = 'Range of $y = ' + P.tex + ' x$?'; correct = P.rangeText; opts = rng.shuffle(uniq(ORDER.map(x => INV[x].rangeText))).filter(t => t !== correct).slice(0, 3).concat([correct]); }
      else if (type === 'domain') { prompt = 'Domain of $y = ' + P.tex + ' x$?'; correct = P.domainText; opts = uniq(ORDER.map(x => INV[x].domainText)); }
      else if (type === 'which') { prompt = 'Which function has range **' + P.rangeText + '**?'; correct = P.name; opts = rng.shuffle(ORDER.map(x => INV[x].name)).filter(t => t !== correct).slice(0, 3).concat([correct]); }
      else if (type === 'asym') { prompt = 'Horizontal asymptotes of $y = ' + P.tex + ' x$?'; correct = ASYM_TEXT[k]; opts = uniq(ORDER.map(x => ASYM_TEXT[x])); }
      else { prompt = 'Is $y = ' + P.tex + ' x$ increasing or decreasing' + (P.dom.length > 1 ? ' (on each branch)' : '') + '?'; correct = dirText(k); opts = ['increasing', 'decreasing']; }
      qBox.innerHTML = R.md(prompt);
      rng.shuffle(opts).forEach(o => {
        const b = R.el('button', { class: 'choice', text: o });
        b.addEventListener('click', () => {
          if (fb.innerHTML) return;
          ds.total++;
          const ok = o === correct;
          if (ok) { ds.right++; ds.streak++; } else ds.streak = 0;
          choiceBox.querySelectorAll('.choice').forEach(c => { if (c.textContent === correct) c.classList.add('correct'); else if (c === b) c.classList.add('wrong'); });
          fb.innerHTML = '<div class="verdict ' + (ok ? 'good' : 'bad') + '">' + (ok ? 'Correct' : 'Answer: ' + R.escapeHtml(correct)) + '</div>';
          stats.textContent = ds.right + ' / ' + ds.total + ' correct · streak ' + ds.streak;
        });
        choiceBox.appendChild(b);
      });
    }
    stats.textContent = 'Answer as fast as you can. Aim for a streak of 15.';
    ask();
  }

  // ======================= transformed-graph explorer =======================
  function transformExplorer(container, L, cfg) {
    const { Graph, R } = L;
    cfg = Object.assign({ key: 'sin', a: PI, b: 2, c: 1, d: -1 }, cfg);
    const Bs = [-3, -2.5, -2, -1.5, -1, -0.5, 0.5, 1, 1.5, 2, 2.5, 3];
    const Cs = [-4, -3, -2, -1.5, -1, -0.5, -1 / 3, -0.25, 0.25, 1 / 3, 0.5, 1, 1.5, 2, 3, 4];
    const st = { key: cfg.key, a: cfg.a, b: cfg.b, c: cfg.c, d: cfg.d, hide: false, parent: true, fit: true };
    const root = R.el('div', { class: 'explorer' }); container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' });
    const eq = R.el('div', { class: 'equation' }); const sw = R.el('div', { class: 'explorer-switches' });
    top.appendChild(eq); top.appendChild(sw); root.appendChild(top);
    Graph.segmented(sw, ORDER.map(k => ({ label: INV[k].name, value: k })), st.key, v => { st.key = v; refresh(); });
    const box = R.el('div'); root.appendChild(box);
    const g = new Graph(box, Object.assign({ xUnit: 'num', yUnit: 'rad', height: 380 }, U4.autoView(U4.transform(st.key, st.a, st.b, st.c, st.d))));
    const ctr = R.el('div', { class: 'explorer-controls' }); root.appendChild(ctr);
    const sl = R.el('div', { class: 'sliders' }); ctr.appendChild(sl);
    Graph.slider(sl, { label: 'a', min: -12, max: 12, step: 1, value: Math.round(st.a / (PI / 6)), format: v => M.formatPi(v * PI / 6), onInput: v => { st.a = v * PI / 6; refresh(); } });
    Graph.slider(sl, { label: 'b', min: 0, max: Bs.length - 1, step: 1, value: Bs.indexOf(st.b), format: i => M.fmt(Bs[i]), onInput: i => { st.b = Bs[i]; refresh(); } });
    Graph.slider(sl, { label: 'c', min: 0, max: Cs.length - 1, step: 1, value: Cs.indexOf(st.c), format: i => U4.fracText(Cs[i]), onInput: i => { st.c = Cs[i]; refresh(); } });
    Graph.slider(sl, { label: 'd', min: -6, max: 6, step: 1, value: st.d * 2, format: v => M.fmt(v / 2), onInput: v => { st.d = v / 2; refresh(); } });
    const tg = R.el('div', { class: 'toggles' }); ctr.appendChild(tg);
    Graph.toggle(tg, 'Parent function (ghost)', true, v => { st.parent = v; refresh(); });
    Graph.toggle(tg, 'Auto-fit the view', true, v => { st.fit = v; refresh(); });
    Graph.toggle(tg, 'Hide answers (predict first)', false, v => { st.hide = v; refresh(); });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);

    function refresh() {
      const T = U4.transform(st.key, st.a, st.b, st.c, st.d);
      if (st.fit) g.update(U4.autoView(T));
      const pal = g.palette || {};
      const fns = [];
      if (st.parent) INV[st.key].dom.forEach(iv => fns.push({ f: INV[st.key].f, domain: [iv.lo, iv.hi], ghost: true, hover: false }));
      T.dom.forEach(iv => fns.push({ f: T.f, domain: [iv.lo, iv.hi], width: 3 }));
      const lbl = (x, y) => st.hide ? '' : '(' + U4.fracText(x) + ', ' + U4.yText(y) + ')';
      const points = T.ends.map(([x, y]) => ({ x, y, label: lbl(x, y), color: pal.accent }))
        .concat(T.keys.filter(([x]) => !T.ends.some(e => Math.abs(e[0] - x) < 1e-9)).map(([x, y]) => ({ x, y, label: lbl(x, y), r: 3.5 })));
      g.update({ fns, points, hlines: T.hAsym.map(y => ({ y })) });
      eq.innerHTML = R.tex(U4.eqTex(st.key, st.a, st.b, st.c, st.d), true);
      const row = (k, v) => '<div class="info-row"><span>' + k + '</span><strong>' + (st.hide ? '<span class="muted">hidden</span>' : v) + '</strong></div>';
      const ends = T.ends.length ? T.ends.map(([x, y]) => '(' + U4.fracText(x) + ', ' + U4.yText(y) + ')').join(', ') : 'none';
      info.innerHTML = row('Domain', U4.domainText(T)) + row('Range', U4.rangeText(T)) + row('Endpoints', ends) +
        row('Horizontal asymptotes', T.hAsym.length ? T.hAsym.map(y => 'y = ' + U4.yText(y)).join(', ') : 'none') +
        row('Direction', T.dir > 0 ? 'increasing' : 'decreasing');
    }
    refresh();
  }

  // ---- helpers for generators ----
  function randT(rng, keys) {
    const key = rng.pick(keys || ['sin', 'sin', 'cos', 'cos']);
    const a = rng.pick([0, PI / 2, PI, 2 * PI, PI / 3, -PI / 2, PI / 4, -PI]);
    const b = rng.pick([1, 2, 3, 0.5, -1, -2]);
    const c = rng.pick([1, 2, 3, 0.5, 1 / 3, 0.25]);
    const d = rng.pick([0, 1, -1, 2, -2, 3]);
    return { key, a, b, c, d };
  }
  const piAns = v => ({ parse: 'pi', answer: v, tol: 0.01, answerText: U4.yText(v) });
  const xAns = v => ({ parse: 'any', answer: v, tol: 0.01, answerText: U4.fracText(v) });

  // ======================= 4-5a the six inverse functions =======================
  sec.topics.push({
    id: '4-5-six', title: 'The six inverse functions: domain, range & graphs (memorize)',
    notes: r`## Why each inverse has the range it does

$y = \sin x$ fails the horizontal-line test, so to get an inverse **function** we keep one piece of it that (1) hits every output exactly once and (2) is nice and centered. The inverse's **range is that piece**. Same story for all six.

## The one picture to remember

{{fig:u4-range-map}}

- **arcsin, arctan, arccsc** answer on the **right half** of the circle: $-\tfrac{\pi}{2}$ to $\tfrac{\pi}{2}$.
- **arccos, arccot, arcsec** answer on the **top half**: $0$ to $\pi$.
- Then **cross out** any angle where the *original* function is undefined: $\tan$ at $\pm\tfrac{\pi}{2}$, $\cot$ at $0$ and $\pi$, $\sec$ at $\tfrac{\pi}{2}$, $\csc$ at $0$.

Memory hook: *"co"-functions live on top* — cos, cot, and sec (sec is 1/cos) all use $[0, \pi]$.

## The table (memorize this)

| **function** | **domain** | **range** | **never reached** |
| --- | --- | --- | --- |
| $y = \arcsin x$ | $-1 \le x \le 1$ | $-\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}$ | — |
| $y = \arccos x$ | $-1 \le x \le 1$ | $0 \le y \le \pi$ | — |
| $y = \arctan x$ | all reals | $-\tfrac{\pi}{2} < y < \tfrac{\pi}{2}$ | $\pm\tfrac{\pi}{2}$ (asymptotes) |
| $y = \operatorname{arccot} x$ | all reals | $0 < y < \pi$ | $0$, $\pi$ (asymptotes) |
| $y = \operatorname{arcsec} x$ | $x \le -1$ or $x \ge 1$ | $0 \le y \le \pi$, $y \ne \tfrac{\pi}{2}$ | $\tfrac{\pi}{2}$ (asymptote) |
| $y = \operatorname{arccsc} x$ | $x \le -1$ or $x \ge 1$ | $-\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}$, $y \ne 0$ | $0$ (asymptote) |

## "N/A" inputs — where there is no answer

- **arcsin, arccos:** $x$ outside $[-1, 1]$ — sine and cosine never go past $\pm 1$. ($\arcsin 2$ is undefined.)
- **arcsec, arccsc:** $x$ strictly between $-1$ and $1$ — secant and cosecant are **never** in that gap. ($\operatorname{arcsec}\tfrac12$ is undefined.)
- **arctan, arccot:** every $x$ works.

## What the graphs look like

- **arcsin:** increasing S from $(-1, -\tfrac{\pi}{2})$ through $(0,0)$ to $(1, \tfrac{\pi}{2})$.
- **arccos:** decreasing S from $(-1, \pi)$ through $(0, \tfrac{\pi}{2})$ to $(1, 0)$.
- **arctan:** increasing through the origin, flattening toward $y = \pm\tfrac{\pi}{2}$.
- **arccot:** decreasing through $(0, \tfrac{\pi}{2})$, flattening toward $y = \pi$ (left) and $y = 0$ (right).
- **arcsec:** two pieces. Right piece starts at $(1, 0)$ and rises toward $\tfrac{\pi}{2}$; left piece ends at $(-1, \pi)$ and comes down toward $\tfrac{\pi}{2}$ as you go left.
- **arccsc:** two pieces. Right piece starts at $(1, \tfrac{\pi}{2})$ and falls toward $0$; left piece ends at $(-1, -\tfrac{\pi}{2})$ and comes up toward $0$ as you go left.

Handy identities (they explain the shapes):
$\operatorname{arcsec} x = \arccos\tfrac1x$, $\;\operatorname{arccsc} x = \arcsin\tfrac1x$, $\;\operatorname{arccot} x = \tfrac{\pi}{2} - \arctan x$.

> **Range conventions:** some textbooks (mostly calculus books) choose different ranges for arcsec and arccsc. The ones above are the standard precalc choice. If your teacher's notes differ, tell me and I'll switch them.

> **Common mistake:** giving arccot the range $(-\tfrac{\pi}{2}, \tfrac{\pi}{2})$ because it's "like arctan." It's a co-function: top half, $(0, \pi)$.`,
    explore: {
      type: 'custom',
      intro: 'Flashcards: say each card’s **domain, range, excluded values and shape** out loud (or sketch them), then click to check. Use **Shuffle** and run the **Quick drill** below until you can do all six without hesitating.',
      setup(c, L) { flashExplorer(c, L); }
    },
    practice: [
      { q: 'From memory, write the domain and range of all six inverse circular functions.', hint: 'Right half (−π/2 to π/2): arcsin, arctan, arccsc. Top half (0 to π): arccos, arccot, arcsec. Then cross out where the original is undefined.', answer: r`arcsin: $[-1,1]$, $[-\tfrac{\pi}{2},\tfrac{\pi}{2}]$ · arccos: $[-1,1]$, $[0,\pi]$ · arctan: all reals, $(-\tfrac{\pi}{2},\tfrac{\pi}{2})$ · arccot: all reals, $(0,\pi)$ · arcsec: $x\le-1$ or $x\ge1$, $[0,\pi]$ with $y\ne\tfrac{\pi}{2}$ · arccsc: $x\le-1$ or $x\ge1$, $[-\tfrac{\pi}{2},\tfrac{\pi}{2}]$ with $y\ne0$`, solution: 'See the table in Notes. Check yourself with the flashcards.' },
      { q: 'Which of the six inverse functions have horizontal asymptotes? Give the equations.', hint: 'Look for range endpoints that are NOT included.', answer: r`arctan: $y = \pm\tfrac{\pi}{2}$ · arccot: $y = 0$ and $y = \pi$ · arcsec: $y = \tfrac{\pi}{2}$ · arccsc: $y = 0$`, solution: 'A value that the range approaches but never reaches (because the original function is undefined there) becomes a horizontal asymptote. arcsin and arccos have closed ranges and finite domains — no asymptotes.' },
      { q: r`Why is $\operatorname{arcsec}\tfrac12$ undefined, but $\arccos\tfrac12$ is fine?`, hint: 'What values can sec θ take?', answer: r`$\sec\theta$ is never between $-1$ and $1$, so no angle has secant $\tfrac12$. Cosine can equal $\tfrac12$ ($\arccos\tfrac12 = \tfrac{\pi}{3}$).`, solution: r`$\sec\theta = 1/\cos\theta$ and $|\cos\theta| \le 1$, so $|\sec\theta| \ge 1$. Equivalently $\operatorname{arcsec}\tfrac12 = \arccos 2$, which doesn't exist.` },
      { q: r`Sketch $y = \operatorname{arcsec} x$. Label the endpoints and the asymptote.`, hint: 'arcsec x = arccos(1/x). Start at x = 1 and x = −1.', answer: r`Endpoints $(1, 0)$ and $(-1, \pi)$; horizontal asymptote $y = \tfrac{\pi}{2}$; nothing for $-1 < x < 1$. Both pieces increase.`, answerGraph: c => U4.drawInverse(c, { key: 'sec', view: STD_VIEW }) },
      { q: r`Sketch $y = \operatorname{arccot} x$. Label three points and both asymptotes.`, hint: 'arccot 0 = π/2; arccot 1 = π/4; arccot(−1) = 3π/4.', answer: r`Through $(-1, \tfrac{3\pi}{4})$, $(0, \tfrac{\pi}{2})$, $(1, \tfrac{\pi}{4})$; asymptotes $y = 0$ and $y = \pi$; decreasing.`, answerGraph: c => U4.drawInverse(c, { key: 'cot', view: STD_VIEW }) },
      { q: 'Which inverse functions are increasing, and which are decreasing?', hint: 'Look at the original function on its restricted piece.', answer: 'Increasing: arcsin, arctan, arcsec (each branch). Decreasing: arccos, arccot, arccsc (each branch).', solution: 'Each inverse goes the same direction as its original on the restricted piece: sine and tangent rise on (−π/2, π/2); cosine and cotangent fall on (0, π); secant rises on [0, π/2) and (π/2, π]; cosecant falls on each half of [−π/2, π/2].' }
    ],
    quiz: [
      function (rng) {
        const k = rng.pick(ORDER), P = INV[k];
        const others = rng.shuffle(Array.from(new Set(ORDER.map(x => INV[x].rangeText))).filter(t => t !== P.rangeText)).slice(0, 3);
        return { type: 'mc', mentionsUndefined: true, prompt: 'What is the **range** of $y = ' + P.tex + ' x$?', choices: [{ text: P.rangeText, correct: true }].concat(others.map(t => ({ text: t, correct: false }))), explanation: P.name + ' answers on the ' + (P.group === 'right' ? '**right half** ($-\\tfrac{\\pi}{2}$ to $\\tfrac{\\pi}{2}$)' : '**top half** ($0$ to $\\pi$)') + (P.excl !== null ? ', minus $' + U4.yTex(P.excl) + '$ where ' + k + ' is undefined' : k === 'tan' || k === 'cot' ? ', with the endpoints excluded (asymptotes)' : '') + '.' };
      },
      function (rng) {
        const k = rng.pick(ORDER), P = INV[k];
        const opts = Array.from(new Set(ORDER.map(x => INV[x].domainText)));
        return { type: 'mc', prompt: 'What is the **domain** of $y = ' + P.tex + ' x$?', choices: opts.map(t => ({ text: t, correct: t === P.domainText })), explanation: 'The domain of the inverse is the set of values the original can output: sine/cosine give $[-1,1]$; tangent/cotangent give every real number; secant/cosecant give $|x| \\ge 1$.' };
      },
      function (rng) {
        const k = rng.pick(ORDER);
        const others = rng.shuffle(ORDER.filter(x => x !== k)).slice(0, 3);
        return { type: 'mc', prompt: 'Which function is graphed?', graph: c => U4.drawInverse(c, { key: k, labels: false, view: STD_VIEW, height: 260 }), choices: [k].concat(others).map(x => ({ text: '$y = ' + INV[x].tex + ' x$', correct: x === k })), explanation: INV[k].shape };
      },
      function (rng) {
        const k = rng.pick(['tan', 'cot', 'sec', 'csc']), P = INV[k];
        const near = (p, q) => Math.abs(p - q) < 1e-9;
        const never = P.hAsym;
        const correct = rng.pick(never);
        const inRange = v => (v > P.rng.lo || (P.rng.loC && near(v, P.rng.lo))) && (v < P.rng.hi || (P.rng.hiC && near(v, P.rng.hi)));
        const distract = rng.shuffle([-PI / 2, -PI / 4, 0, PI / 4, PI / 3, PI / 2, 3 * PI / 4, PI].filter(v => inRange(v) && !never.some(n => near(n, v)))).slice(0, 3);
        return { type: 'mc', mentionsUndefined: true, prompt: 'Which value is **never** an output of $y = ' + P.tex + ' x$?', choices: [{ text: '$' + U4.yTex(correct) + '$', correct: true }].concat(distract.map(v => ({ text: '$' + U4.yTex(v) + '$', correct: false }))), explanation: '$' + P.trig + '$ is undefined at $' + U4.yTex(correct) + '$, so no input to ' + P.name + ' produces it — that’s a horizontal asymptote. Range: ' + P.rangeText + '.' };
      },
      function (rng) {
        const k = rng.pick(ORDER), P = INV[k];
        const x = rng.pick([0.5, -0.5, 2, -2, 0, 1.5, -3, 0.9]);
        const ok = isFinite(P.f(x)) && !isNaN(P.f(x));
        return { type: 'mc', prompt: 'Is $' + P.tex + '(' + x + ')$ defined?', choices: [{ text: 'Yes', correct: ok }, { text: 'No', correct: !ok }], explanation: 'Domain of ' + P.name + ': ' + P.domainText + '. ' + (ok ? '$' + x + '$ is in it.' : '$' + x + '$ is not — ' + P.na) };
      },
      function (rng) {
        const k = rng.pick(ORDER), P = INV[k];
        return { type: 'mc', prompt: 'Is $y = ' + P.tex + ' x$ increasing or decreasing' + (P.dom.length > 1 ? ' on each branch' : '') + '?', choices: [{ text: 'increasing', correct: P.dir > 0 }, { text: 'decreasing', correct: P.dir < 0 }], explanation: P.shape };
      }
    ]
  });

  // ======================= 4-5b transformed inverse graphs =======================
  sec.topics.push({
    id: '4-5-transform', title: 'Graphing y = a + b·arcsin(c(x + d)) and friends',
    notes: r`## Same four transformations as sinusoids

$$y = a + b\,\arcsin\big(c(x + d)\big)$$

| **letter** | **what it does** | **affects** |
| --- | --- | --- |
| $a$ | vertical shift (up $a$) | range |
| $b$ | vertical dilation by $b$ (negative flips upside down) | range |
| $c$ | horizontal dilation by $\tfrac1c$ | domain |
| $d$ | horizontal shift: $x + d$ moves **left** $d$; $x - 1$ moves **right** 1 | domain |

The same pattern works for arccos, arctan, arccot, arcsec and arccsc.

## The method: inside → domain, outside → range

1. **Domain** — the *inside* must be a legal input. For arcsin/arccos: $-1 \le c(x+d) \le 1$; solve for $x$.
2. **Range** — take the parent range and apply the *outside*: $a + b \cdot (\text{parent range})$. If $b < 0$, the ends swap.
3. **Key points** — move each parent point: input $u$ goes to $x = \tfrac{u}{c} - d$, output $v$ goes to $y = a + b\,v$.
4. **Asymptotes** (arctan, arccot, arcsec, arccsc) — horizontal lines move with the range: $y \to a + b\,y$.
5. **Sketch** and check direction: it flips if exactly one of $b$, $c$ is negative.

## Worked example: $y = \pi + 2\arcsin(x - 1)$

- Here $a = \pi$, $b = 2$, $c = 1$, $d = -1$.
- Domain: $-1 \le x - 1 \le 1 \Rightarrow 0 \le x \le 2$.
- Range: $\pi + 2\big[-\tfrac{\pi}{2}, \tfrac{\pi}{2}\big] = [0, 2\pi]$.
- Key points: $(-1, -\tfrac{\pi}{2}) \to (0, 0)$; $\;(0, 0) \to (1, \pi)$; $\;(1, \tfrac{\pi}{2}) \to (2, 2\pi)$.
- Increasing S-curve from $(0, 0)$ to $(2, 2\pi)$, centered at $(1, \pi)$.

## Worked example with asymptotes: $y = \tfrac{\pi}{4} + \arctan(2x)$

- Domain: all reals.
- Range: $\tfrac{\pi}{4} + \big(-\tfrac{\pi}{2}, \tfrac{\pi}{2}\big) = \big(-\tfrac{\pi}{4}, \tfrac{3\pi}{4}\big)$, with asymptotes $y = -\tfrac{\pi}{4}$ and $y = \tfrac{3\pi}{4}$.
- Key points: $(-1, -\tfrac{\pi}{4}) \to (-\tfrac12, 0)$; $(0,0) \to (0, \tfrac{\pi}{4})$; $(1, \tfrac{\pi}{4}) \to (\tfrac12, \tfrac{\pi}{2})$.

> **Common mistake:** applying $a$ and $b$ to the domain, or $c$ and $d$ to the range. Inside changes $x$; outside changes $y$.

> **Common mistake:** dilating the domain by $c$ instead of $\tfrac1c$. In $\arcsin(3x)$ the domain *shrinks* to $[-\tfrac13, \tfrac13]$.`,
    explore: {
      type: 'custom',
      intro: 'Pick a function and move $a, b, c, d$. The **dashed ghost** is the parent graph. Turn on **Hide answers** and predict the domain, range and endpoints before you look.',
      setup(c, L) { transformExplorer(c, L, { key: 'sin', a: PI, b: 2, c: 1, d: -1 }); },
      tasks: r`1. Build $y = \pi + 2\arcsin(x - 1)$ (the default) and compare with the worked example.
2. Set $c = 3$. Predict the new domain, then check.
3. Make $b$ negative. What happens to the range's endpoints? To the direction?
4. Switch to **arctan**. Which slider moves the asymptotes, and which doesn't?`
    },
    practice: [
      {
        q: r`Graph $y = 2\pi + 3\arcsin\!\left(\tfrac14 x\right)$. Give the domain, range, the endpoints, and the center point.`,
        hint: r`Inside: $-1 \le \tfrac{x}{4} \le 1$. Outside: $2\pi + 3 \cdot [-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$.`,
        answer: r`Domain $-4 \le x \le 4$; range $\tfrac{\pi}{2} \le y \le \tfrac{7\pi}{2}$; endpoints $(-4, \tfrac{\pi}{2})$ and $(4, \tfrac{7\pi}{2})$; center $(0, 2\pi)$; increasing.`,
        solution: r`$a = 2\pi$, $b = 3$, $c = \tfrac14$, $d = 0$.
- Domain: $-1 \le \tfrac{x}{4} \le 1 \Rightarrow -4 \le x \le 4$ (horizontal dilation by $\tfrac{1}{1/4} = 4$).
- Range: $2\pi + 3(-\tfrac{\pi}{2}) = \tfrac{\pi}{2}$ up to $2\pi + 3(\tfrac{\pi}{2}) = \tfrac{7\pi}{2}$.
- Points: $(-1, -\tfrac{\pi}{2}) \to (-4, \tfrac{\pi}{2})$, $(0,0) \to (0, 2\pi)$, $(1, \tfrac{\pi}{2}) \to (4, \tfrac{7\pi}{2})$.`,
        answerGraph: c => U4.drawInverse(c, { key: 'sin', a: 2 * PI, b: 3, c: 0.25, d: 0, parent: true })
      },
      {
        q: r`Graph $y = \tfrac{\pi}{3} + \tfrac12\arccos\big(3(x - 1)\big)$. Give the domain, range, endpoints, and middle point.`,
        hint: r`Inside: $-1 \le 3(x - 1) \le 1$. arccos's parent points are $(-1, \pi)$, $(0, \tfrac{\pi}{2})$, $(1, 0)$.`,
        answer: r`Domain $\tfrac23 \le x \le \tfrac43$; range $\tfrac{\pi}{3} \le y \le \tfrac{5\pi}{6}$; endpoints $(\tfrac23, \tfrac{5\pi}{6})$ and $(\tfrac43, \tfrac{\pi}{3})$; middle $(1, \tfrac{7\pi}{12})$; decreasing.`,
        solution: r`$a = \tfrac{\pi}{3}$, $b = \tfrac12$, $c = 3$, $d = -1$.
- Domain: $-1 \le 3(x-1) \le 1 \Rightarrow -\tfrac13 \le x - 1 \le \tfrac13 \Rightarrow \tfrac23 \le x \le \tfrac43$.
- Range: $\tfrac{\pi}{3} + \tfrac12[0, \pi] = [\tfrac{\pi}{3}, \tfrac{\pi}{3} + \tfrac{\pi}{2}] = [\tfrac{\pi}{3}, \tfrac{5\pi}{6}]$.
- Points ($x = \tfrac{u}{3} + 1$, $y = \tfrac{\pi}{3} + \tfrac{v}{2}$): $(-1, \pi) \to (\tfrac23, \tfrac{5\pi}{6})$; $(0, \tfrac{\pi}{2}) \to (1, \tfrac{7\pi}{12})$; $(1, 0) \to (\tfrac43, \tfrac{\pi}{3})$.`,
        answerGraph: c => U4.drawInverse(c, { key: 'cos', a: PI / 3, b: 0.5, c: 3, d: -1 })
      },
      {
        q: r`Graph $y = -\pi + 2\arctan(x + 1)$. Give the domain, range, asymptotes, and three key points.`,
        hint: 'arctan’s asymptotes ±π/2 move to −π ± π.',
        answer: r`Domain all reals; range $-2\pi < y < 0$; asymptotes $y = -2\pi$ and $y = 0$; points $(-2, -\tfrac{3\pi}{2})$, $(-1, -\pi)$, $(0, -\tfrac{\pi}{2})$.`,
        solution: r`$-\pi + 2(\pm\tfrac{\pi}{2}) = -2\pi$ or $0$. Points: $(-1, -\tfrac{\pi}{4}) \to (-2, -\pi - \tfrac{\pi}{2})$, $(0,0) \to (-1, -\pi)$, $(1, \tfrac{\pi}{4}) \to (0, -\tfrac{\pi}{2})$.`,
        answerGraph: c => U4.drawInverse(c, { key: 'tan', a: -PI, b: 2, c: 1, d: 1 })
      },
      {
        q: r`Find the domain and range of $y = \tfrac{\pi}{2} - \arccos(2x)$, then explain why its graph looks exactly like another function you know.`,
        hint: 'b = −1 flips the range.',
        answer: r`Domain $-\tfrac12 \le x \le \tfrac12$; range $-\tfrac{\pi}{2} \le y \le \tfrac{\pi}{2}$; it is $y = \arcsin(2x)$.`,
        solution: r`Inside: $-1 \le 2x \le 1$. Outside: $\tfrac{\pi}{2} - [0, \pi] = [-\tfrac{\pi}{2}, \tfrac{\pi}{2}]$ (ends swap because $b = -1$). Since $\arcsin u + \arccos u = \tfrac{\pi}{2}$, we have $\tfrac{\pi}{2} - \arccos u = \arcsin u$.`,
        answerGraph: c => U4.drawInverse(c, { key: 'cos', a: PI / 2, b: -1, c: 2, d: 0 })
      },
      {
        q: r`Find the domain, range and asymptote of $y = \operatorname{arcsec}\!\left(\tfrac{x}{2}\right)$, and its two endpoints.`,
        hint: r`Inside must satisfy $\left|\tfrac{x}{2}\right| \ge 1$.`,
        answer: r`Domain $x \le -2$ or $x \ge 2$; range $0 \le y \le \pi$, $y \ne \tfrac{\pi}{2}$; asymptote $y = \tfrac{\pi}{2}$; endpoints $(2, 0)$ and $(-2, \pi)$.`,
        answerGraph: c => U4.drawInverse(c, { key: 'sec', a: 0, b: 1, c: 0.5, d: 0 })
      },
      {
        q: r`Write an equation $y = a + b\arcsin\big(c(x + d)\big)$ whose graph has domain $1 \le x \le 5$ and range $0 \le y \le \pi$, and is increasing.`,
        hint: 'Center of the domain gives d; half-width gives 1/c. Middle of the range gives a; half-height ÷ (π/2) gives b.',
        answer: r`$y = \tfrac{\pi}{2} + \arcsin\!\left(\tfrac12(x - 3)\right)$`,
        solution: r`Domain centered at $x = 3$ with half-width $2$: $c = \tfrac12$, $d = -3$. Range centered at $\tfrac{\pi}{2}$ with half-height $\tfrac{\pi}{2}$: $a = \tfrac{\pi}{2}$, $b = 1$. Check: $-1 \le \tfrac{x-3}{2} \le 1 \Rightarrow 1 \le x \le 5$ ✓.`
      }
    ],
    quiz: [
      function (rng) {
        const t = randT(rng);
        const T = U4.transform(t.key, t.a, t.b, t.c, t.d);
        return {
          type: 'multi', prompt: 'For $' + U4.eqTex(t.key, t.a, t.b, t.c, t.d) + '$, find the domain and range. (Fractions like `2/3`; π like `7pi/2`.)',
          fields: [Object.assign({ label: 'domain: left end $x =$' }, xAns(T.dom[0].lo)), Object.assign({ label: 'domain: right end $x =$' }, xAns(T.dom[0].hi)), Object.assign({ label: 'range: lowest $y$' }, piAns(T.rng.lo)), Object.assign({ label: 'range: highest $y$' }, piAns(T.rng.hi))],
          explanation: 'Inside: $-1 \\le ' + (t.c === 1 ? '' : U4.fracTex(t.c)) + (t.d === 0 ? 'x' : '(x ' + (t.d > 0 ? '+' : '-') + ' ' + Math.abs(t.d) + ')') + ' \\le 1$ gives ' + U4.domainText(T) + '. Outside: $' + U4.yTex(t.a) + ' + ' + U4.fracTex(t.b) + '\\cdot[' + U4.yTex(INV[t.key].rng.lo) + ', ' + U4.yTex(INV[t.key].rng.hi) + ']$ gives ' + U4.rangeText(T) + (t.b < 0 ? ' (ends swap because $b < 0$).' : '.'),
          explainGraph: c => U4.drawInverse(c, Object.assign({}, t, { parent: true }))
        };
      },
      function (rng) {
        const t = randT(rng);
        const T = U4.transform(t.key, t.a, t.b, t.c, t.d);
        const [L1, R1] = T.ends.slice().sort((p, q) => p[0] - q[0]);
        return {
          type: 'multi', prompt: 'Find the coordinates of both endpoints of $' + U4.eqTex(t.key, t.a, t.b, t.c, t.d) + '$.',
          fields: [Object.assign({ label: 'left endpoint $x$' }, xAns(L1[0])), Object.assign({ label: 'left endpoint $y$' }, piAns(L1[1])), Object.assign({ label: 'right endpoint $x$' }, xAns(R1[0])), Object.assign({ label: 'right endpoint $y$' }, piAns(R1[1]))],
          explanation: 'Parent endpoints of ' + INV[t.key].name + ': ' + INV[t.key].ends.map(([u, v]) => '$(' + u + ', ' + U4.yTex(v) + ')$').join(' and ') + '. Move each with $x = u/c - d$ and $y = a + bv$.',
          explainGraph: c => U4.drawInverse(c, Object.assign({}, t))
        };
      },
      function (rng) {
        const t = randT(rng, ['tan', 'cot']);
        const T = U4.transform(t.key, t.a, t.b, t.c, t.d);
        const hs = T.hAsym.slice().sort((p, q) => p - q);
        return {
          type: 'multi', prompt: 'Find the two horizontal asymptotes of $' + U4.eqTex(t.key, t.a, t.b, t.c, t.d) + '$.',
          fields: [Object.assign({ label: 'lower asymptote $y =$' }, piAns(hs[0])), Object.assign({ label: 'upper asymptote $y =$' }, piAns(hs[1]))],
          explanation: INV[t.key].name + '’s asymptotes are $' + INV[t.key].hAsym.map(U4.yTex).join('$ and $') + '$. Apply the outside: $y \\to ' + U4.yTex(t.a) + ' + ' + U4.fracTex(t.b) + 'y$. The inside ($c$, $d$) never moves horizontal asymptotes.',
          explainGraph: c => U4.drawInverse(c, Object.assign({}, t))
        };
      },
      function (rng) {
        const key = rng.pick(['sin', 'cos']);
        const t = { key, a: rng.pick([0, PI / 2, PI]), b: rng.pick([1, 2]), c: rng.pick([2, 0.5, 1]), d: rng.pick([1, -1, 2, -2]) };
        const good = U4.eqTex(key, t.a, t.b, t.c, t.d);
        const pool = [U4.eqTex(key, t.a, t.b, t.c, -t.d), U4.eqTex(key, t.a, t.b, 1 / t.c, t.d), U4.eqTex(key, -t.a, t.b, t.c, t.d), U4.eqTex(key, t.a, -t.b, t.c, t.d)];
        const distract = Array.from(new Set(pool.filter(p => p !== good))).slice(0, 3);
        return {
          type: 'mc', prompt: 'Which equation matches this graph?', graph: c => U4.drawInverse(c, Object.assign({}, t, { labels: true, height: 280 })),
          choices: [{ text: '$' + good + '$', correct: true }].concat(distract.map(d => ({ text: '$' + d + '$', correct: false }))),
          explanation: 'Read the domain (from $c$ and $d$: center at $x = ' + U4.fracText(-t.d) + '$, half-width $' + U4.fracText(1 / t.c) + '$) and the range (from $a$ and $b$). Remember $x + d$ shifts **left**.'
        };
      },
      function (rng) {
        const t = randT(rng, ['sin', 'cos', 'tan']);
        const T = U4.transform(t.key, t.a, t.b, t.c, t.d);
        const mid = T.keys[1];
        return {
          type: 'multi', prompt: 'Where does the parent point $' + (t.key === 'cos' ? '(0, \\tfrac{\\pi}{2})' : '(0, 0)') + '$ move to on $' + U4.eqTex(t.key, t.a, t.b, t.c, t.d) + '$?',
          fields: [Object.assign({ label: '$x$' }, xAns(mid[0])), Object.assign({ label: '$y$' }, piAns(mid[1]))],
          explanation: '$x = \\tfrac{0}{c} - d = ' + U4.fracTex(mid[0]) + '$; $y = a + b \\cdot ' + (t.key === 'cos' ? '\\tfrac{\\pi}{2}' : '0') + ' = ' + U4.yTex(mid[1]) + '$.'
        };
      }
    ]
  });

  // ======================= sketch-and-check generators =======================
  // largest grid step (from the candidates) that every value is a multiple of
  function bestStep(values, cands) {
    for (const c of cands) if (values.every(v => Math.abs(v / c - Math.round(v / c)) < 1e-6)) return c;
    return cands[cands.length - 1];
  }
  const X_STEPS = [1, 0.5, 1 / 3, 0.25, 1 / 6, 1 / 12];
  const Y_STEPS = [PI / 2, PI / 4, PI / 6, PI / 8, PI / 12, PI / 24];
  const ORD = ['Left', 'Middle', 'Right'];

  function sketchTargets(T) {
    const t = [];
    const pts = T.keys.slice().sort((p, q) => p[0] - q[0]);
    if (T.key === 'sin' || T.key === 'cos') pts.forEach((p, i) => t.push({ label: ORD[i] + (i === 1 ? ' point' : ' endpoint'), kind: 'point', x: p[0], y: p[1] }));
    else if (T.key === 'tan' || T.key === 'cot') {
      pts.forEach((p, i) => t.push({ label: ['Left', 'Center', 'Right'][i] + ' key point', kind: 'point', x: p[0], y: p[1] }));
      T.hAsym.slice().sort((a, b) => a - b).forEach((y, i) => t.push({ label: (i ? 'Upper' : 'Lower') + ' asymptote', kind: 'hline', y }));
    } else {
      T.ends.slice().sort((p, q) => p[0] - q[0]).forEach((p, i) => t.push({ label: (i ? 'Right' : 'Left') + ' branch endpoint', kind: 'point', x: p[0], y: p[1] }));
      T.hAsym.forEach(y => t.push({ label: 'Horizontal asymptote', kind: 'hline', y }));
    }
    return t;
  }
  // snap step: divides every target value, but fine enough (≥ minCells positions) that the grid doesn't hint at the answer
  function snapStep(values, cands, span, minCells) {
    let s = bestStep(values, cands);
    while (span / s < minCells) s /= 2;
    return s;
  }
  function sketchQuestion(T, view, prompt, explanation) {
    const targets = sketchTargets(T);
    const xs = targets.filter(t => t.kind === 'point').map(t => t.x);
    const ys = targets.map(t => t.y);
    return {
      type: 'sketch', prompt,
      sketch: {
        view: Object.assign({ xUnit: 'num', yUnit: 'rad' }, view),
        snapX: snapStep(xs, X_STEPS, view.xMax - view.xMin, 20), snapY: snapStep(ys, Y_STEPS, view.yMax - view.yMin, 16),
        targets,
        answerFns: T.dom.map(iv => ({ f: T.f, domain: [iv.lo, iv.hi] }))
      },
      explanation
    };
  }
  // pad the auto view by random amounts so the window itself doesn't give away the domain
  function looseView(T, rng) {
    const v = U4.autoView(T);
    const w = v.xMax - v.xMin, h = v.yMax - v.yMin;
    v.xMin -= w * rng.pick([0.1, 0.25, 0.4]); v.xMax += w * rng.pick([0.1, 0.25, 0.4]);
    v.yMin -= h * rng.pick([0, 0.15, 0.3]); v.yMax += h * rng.pick([0, 0.15, 0.3]);
    v.xStep = [0.25, 0.5, 1, 2, 5].find(s => (v.xMax - v.xMin) / s <= 12) || 5;
    return v;
  }

  sec.topics.find(t => t.id === '4-5-transform').quiz.push(function sketchTransformed(rng) {
    const t = randT(rng, ['sin', 'sin', 'cos', 'cos', 'tan', 'cot']);
    const T = U4.transform(t.key, t.a, t.b, t.c, t.d);
    return sketchQuestion(T, looseView(T, rng),
      '**Sketch** $' + U4.eqTex(t.key, t.a, t.b, t.c, t.d) + '$: place each item on the grid.',
      'Move each parent point with $x = \\tfrac{u}{c} - d$ and $y = a + b\\,v$' + (T.hAsym.length ? '; asymptotes move with $y \\to a + b\\,y$' : '') + '. Domain: ' + U4.domainText(T) + '. Range: ' + U4.rangeText(T) + '.');
  });
  sec.topics.find(t => t.id === '4-5-six').quiz.push(function sketchParent(rng) {
    const k = rng.pick(ORDER);
    const T = U4.transform(k, 0, 1, 1, 0);
    return sketchQuestion(T, STD_VIEW,
      '**Sketch** the parent graph $y = ' + INV[k].tex + ' x$ from memory: place each item.',
      INV[k].shape + ' Domain: ' + INV[k].domainText + '. Range: ' + INV[k].rangeText + '.');
  });
  window.U4.sketchQuestion = sketchQuestion;
})();
