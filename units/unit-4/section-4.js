/* Unit 4 — section 4-4: angular & linear velocity. */
(function () {
  const U = window.UNIT_DATA['unit-4'];
  const { PI } = window.U4;
  const r = String.raw;
  const TAU = 2 * PI;
  const rel = a => Math.max(0.01, Math.abs(a) * 0.006);   // accept ~0.6% rounding
  const f2 = v => M.fmt(v, 2);
  const rpmTex = v => Math.abs(v - 100 / 3) < 1e-9 ? '33\\tfrac13' : M.fmt(v);
  const rpmTxt = v => Math.abs(v - 100 / 3) < 1e-9 ? '33⅓' : M.fmt(v);

  const sec = { id: '4-4', title: 'Angular & linear velocity', topics: [] };
  U.sections.push(sec);

  // ======================= wheel explorer (canvas, animated on demand) =======================
  function wheelExplorer(container, L, cfg) {
    const { Graph, M, R } = L;
    cfg = Object.assign({ mode: 'single', r: 6, rpm: 20, kind: 'belt', r1: 6, r2: 3, rpm1: 20, modeSwitch: true }, cfg);
    const st = { mode: cfg.mode, r: cfg.r, rpm: cfg.rpm, kind: cfg.kind, r1: cfg.r1, r2: cfg.r2, rpm1: cfg.rpm1, a1: -PI / 2, a2: -PI / 2, belt: 0, playing: false, slow: true, hide: false };
    const root = R.el('div', { class: 'explorer cv-explorer' });
    container.appendChild(root);
    const top = R.el('div', { class: 'explorer-top' });
    const eq = R.el('div', { class: 'equation' });
    const sw = R.el('div', { class: 'explorer-switches' });
    top.appendChild(eq); top.appendChild(sw); root.appendChild(top);
    if (cfg.modeSwitch) Graph.segmented(sw, [{ label: 'one wheel', value: 'single' }, { label: 'two connected wheels', value: 'linked' }], st.mode, v => { st.mode = v; build(); });
    const kindBox = R.el('div'); sw.appendChild(kindBox);
    Graph.segmented(kindBox, [{ label: 'belt', value: 'belt' }, { label: 'touching', value: 'touch' }, { label: 'same axle', value: 'axle' }], st.kind, v => { st.kind = v; draw(); readout(); });

    const row = R.el('div', { class: 'cv-row' }); root.appendChild(row);
    const W = 560, H = 300;
    const cv = R.el('canvas', { role: 'img', 'aria-label': 'Spinning wheel diagram' });
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = '100%'; cv.style.maxWidth = W + 'px'; cv.style.height = 'auto';
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    row.appendChild(cv);
    const side = R.el('div', { class: 'cv-side' }); row.appendChild(side);
    const sliderBox = R.el('div', { class: 'sliders' }); side.appendChild(sliderBox);
    const btns = R.el('div', { class: 'btn-row' }); side.appendChild(btns);
    const play = R.el('button', { class: 'btn btn-primary btn-sm', text: '▶ Play' });
    btns.appendChild(play);
    const tg = R.el('div', { class: 'toggles' }); side.appendChild(tg);
    Graph.toggle(tg, 'Slow motion (¼ speed)', true, v => { st.slow = v; });
    Graph.toggle(tg, 'Hide answers (predict first)', false, v => { st.hide = v; readout(); });
    const info = R.el('div', { class: 'explorer-info' }); root.appendChild(info);

    play.addEventListener('click', () => {
      st.playing = !st.playing;
      play.textContent = st.playing ? '❚❚ Pause' : '▶ Play';
      if (st.playing) { last = null; requestAnimationFrame(tick); }
    });

    const omega = rpm => rpm * TAU / 60;            // rad/s
    function linked() {
      const w1 = omega(st.rpm1);
      const w2 = st.kind === 'axle' ? w1 : w1 * st.r1 / st.r2;
      return { w1, w2, rpm2: w2 * 60 / TAU, v1: st.r1 * w1, v2: st.r2 * w2, dir2: st.kind === 'touch' ? -1 : 1 };
    }

    function build() {
      sliderBox.innerHTML = '';
      kindBox.style.display = st.mode === 'linked' ? '' : 'none';
      if (st.mode === 'single') {
        Graph.slider(sliderBox, { label: 'r', min: 1, max: 10, step: 0.5, value: st.r, format: v => M.fmt(v) + ' in', onInput: v => { st.r = v; draw(); readout(); } });
        Graph.slider(sliderBox, { label: 'rpm', min: 1, max: 60, step: 1, value: st.rpm, format: v => M.fmt(v), onInput: v => { st.rpm = v; draw(); readout(); } });
      } else {
        Graph.slider(sliderBox, { label: 'r₁', min: 1, max: 8, step: 0.5, value: st.r1, format: v => M.fmt(v) + ' in', onInput: v => { st.r1 = v; draw(); readout(); } });
        Graph.slider(sliderBox, { label: 'r₂', min: 0.5, max: 8, step: 0.5, value: st.r2, format: v => M.fmt(v) + ' in', onInput: v => { st.r2 = v; draw(); readout(); } });
        Graph.slider(sliderBox, { label: 'rpm₁', min: 5, max: 60, step: 1, value: st.rpm1, format: v => M.fmt(v), onInput: v => { st.rpm1 = v; draw(); readout(); } });
      }
      draw(); readout();
    }

    function readout() {
      const hid = '<span class="muted">hidden</span>';
      const row2 = (k, v) => '<div class="info-row"><span>' + k + '</span><strong>' + v + '</strong></div>';
      if (st.mode === 'single') {
        const w = omega(st.rpm), vP = st.r * w, vQ = st.r / 2 * w;
        eq.innerHTML = R.tex('v = r\\omega', true);
        info.innerHTML =
          row2('ω (same for every point)', M.fmt(st.rpm) + ' rpm = ' + M.formatPi(st.rpm * TAU) + ' rad/min ≈ ' + M.fmt(w, 3) + ' rad/s') +
          row2('ω in degrees', M.fmt(st.rpm * 6, 2) + '°/s') +
          row2('v of P (rim, r = ' + M.fmt(st.r) + ' in)', st.hide ? hid : M.fmt(vP * 60, 1) + ' in/min ≈ ' + M.fmt(vP, 2) + ' in/s') +
          row2('v of Q (r = ' + M.fmt(st.r / 2) + ' in)', st.hide ? hid : M.fmt(vQ * 60, 1) + ' in/min ≈ ' + M.fmt(vQ, 2) + ' in/s');
      } else {
        const k = linked();
        const rule = st.kind === 'axle' ? 'Same axle → same ω:  ω₂ = ω₁' : 'No slipping → same rim speed:  r₁ω₁ = r₂ω₂';
        eq.innerHTML = '<span>' + rule + '</span>';
        info.innerHTML =
          row2('Wheel 1: ω₁', M.fmt(st.rpm1) + ' rpm ≈ ' + M.fmt(k.w1, 3) + ' rad/s') +
          row2('Wheel 1: rim v₁ = r₁ω₁', M.fmt(k.v1, 2) + ' in/s') +
          row2('Wheel 2: ω₂', st.hide ? hid : M.fmt(k.rpm2, 2) + ' rpm ≈ ' + M.fmt(k.w2, 3) + ' rad/s' + (st.kind === 'touch' ? ' (opposite direction)' : '')) +
          row2('Wheel 2: rim v₂ = r₂ω₂', st.hide ? hid : M.fmt(k.v2, 2) + ' in/s');
      }
    }

    const css = n => getComputedStyle(root).getPropertyValue(n).trim();
    function wheel(x, y, rp, ang, color, fill) {
      ctx.beginPath(); ctx.arc(x, y, rp, 0, TAU);
      ctx.fillStyle = fill; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = color; ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = css('--graph-grid') || '#ddd';
      for (let i = 0; i < 6; i++) {
        const a = ang + i * PI / 3;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + rp * Math.cos(a), y + rp * Math.sin(a)); ctx.stroke();
      }
      ctx.fillStyle = css('--text') || '#222';
      ctx.beginPath(); ctx.arc(x, y, 3.5, 0, TAU); ctx.fill();
    }
    function marker(x, y, rp, ang, color, label) {
      const px = x + rp * Math.cos(ang), py = y + rp * Math.sin(ang);
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, 6, 0, TAU); ctx.fill();
      if (label) { ctx.font = '600 13px system-ui, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(label, px + 9, py - 7); }
    }
    function text(s, x, y, color, align) {
      ctx.fillStyle = color || css('--graph-text'); ctx.font = '13px system-ui, sans-serif'; ctx.textAlign = align || 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y);
    }

    function draw() {
      const bg = css('--graph-bg') || '#fff', acc = css('--accent'), acc2 = css('--accent-2'), acc3 = css('--accent-3'), soft = css('--surface-2'), mut = css('--text-muted');
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      if (st.mode === 'single') {
        const cx = 200, cy = 150, k = 12, rp = st.r * k, w = omega(st.rpm);
        wheel(cx, cy, rp, st.a1, css('--text'), soft);
        // arcs swept in 1 second (real time) — the "a" in v = a/t
        const sweep = Math.min(w * 1, TAU - 0.02);
        ctx.lineWidth = 6; ctx.lineCap = 'round';
        ctx.strokeStyle = acc2; ctx.beginPath(); ctx.arc(cx, cy, rp, st.a1 - sweep, st.a1); ctx.stroke();
        ctx.strokeStyle = acc3; ctx.beginPath(); ctx.arc(cx, cy, rp / 2, st.a1 - sweep, st.a1); ctx.stroke();
        ctx.lineCap = 'butt';
        marker(cx, cy, rp, st.a1, acc2, 'P');
        marker(cx, cy, rp / 2, st.a1, acc3, 'Q');
        text('Highlighted arcs = distance traveled in 1 second', 380, 40, mut, 'left');
        text('(the a in v = a / t)', 380, 58, mut, 'left');
        text('P: ' + M.fmt(st.r) + ' in from center', 380, 110, acc2);
        text('Q: ' + M.fmt(st.r / 2) + ' in from center', 380, 130, acc3);
        text('Same angle swept → same ω', 380, 170);
        text('P’s arc is twice as long → 2× v', 380, 190);
      } else {
        const k = 14, y = 150, rp1 = st.r1 * k, rp2 = st.r2 * k, L2 = linked();
        if (st.kind === 'axle') {
          const cx = 210;
          wheel(cx, y, Math.max(rp1, rp2), st.a1, mut, soft);
          ctx.lineWidth = 3; ctx.strokeStyle = acc; ctx.beginPath(); ctx.arc(cx, y, rp1, 0, TAU); ctx.stroke();
          ctx.strokeStyle = acc3; ctx.beginPath(); ctx.arc(cx, y, rp2, 0, TAU); ctx.stroke();
          marker(cx, y, rp1, st.a1, acc, '1');
          marker(cx, y, rp2, st.a1, acc3, '2');
          text('Both wheels are fixed to one axle:', 360, 110);
          text('they turn through the same angle', 360, 128);
          text('→ same ω, but the bigger one’s rim', 360, 146);
          text('   moves faster (v = rω).', 360, 164);
        } else {
          const x1 = 40 + rp1, gap = st.kind === 'belt' ? 70 : 0, x2 = x1 + rp1 + gap + rp2;
          wheel(x1, y, rp1, st.a1, acc, soft);
          wheel(x2, y, rp2, st.a2, acc3, soft);
          if (st.kind === 'belt') {
            const B = window.U4.beltPoints(x1, x2, y, rp1, rp2);
            const al = Math.asin((rp1 - rp2) / (x2 - x1));
            const aT = Math.atan2(-Math.cos(al), Math.sin(al)), aB = Math.atan2(Math.cos(al), Math.sin(al));
            ctx.lineWidth = 3.5; ctx.strokeStyle = acc2; ctx.setLineDash([12, 8]); ctx.lineDashOffset = -st.belt;
            ctx.beginPath();
            ctx.moveTo(B.t1[0], B.t1[1]); ctx.lineTo(B.t2[0], B.t2[1]);
            ctx.arc(x2, y, rp2, aT, aB, false);
            ctx.lineTo(B.b1[0], B.b1[1]);
            ctx.arc(x1, y, rp1, aB, aT + TAU, false);
            ctx.stroke(); ctx.setLineDash([]);
            text('belt speed = v₁ = v₂', (x1 + x2) / 2, 22, acc2, 'center');
          } else {
            ctx.fillStyle = acc2; ctx.beginPath(); ctx.arc(x1 + rp1, y, 6, 0, TAU); ctx.fill();
            text('contact: same v', x1 + rp1, y - Math.max(rp1, rp2) - 14, acc2, 'center');
          }
          marker(x1, y, rp1, st.a1, acc, '1');
          marker(x2, y, rp2, st.a2, acc3, '2');
          text(st.kind === 'touch' ? 'opposite directions' : 'same direction', W - 12, H - 16, mut, 'right');
        }
      }
    }

    let last = null;
    function tick(ts) {
      if (!cv.isConnected) { st.playing = false; return; }
      if (!st.playing) return;
      if (last !== null) {
        const dt = Math.min(0.05, (ts - last) / 1000) * (st.slow ? 0.25 : 1);
        if (st.mode === 'single') st.a1 += omega(st.rpm) * dt;
        else {
          const k = linked();
          st.a1 += k.w1 * dt;
          st.a2 += k.dir2 * k.w2 * dt;
          st.belt += k.v1 * 14 * dt;     // px per second along the belt
        }
      }
      last = ts;
      draw();
      requestAnimationFrame(tick);
    }
    document.addEventListener('themechange', () => { if (cv.isConnected) draw(); });
    build();
  }

  // ======================= 4-4a angular velocity =======================
  sec.topics.push({
    id: '4-4-angular', title: 'Angular velocity: ω = θ / t',
    notes: r`## How fast something spins

**Angular velocity** $\omega$ (Greek "omega") is the angle turned per unit of time:

$$\omega = \frac{\theta}{t}$$

{{fig:u4-def}}

## Units — and converting between them

| **unit** | **meaning** | **to convert** |
| --- | --- | --- |
| rad/s, rad/min | radians per second / minute | the unit you need for $v = r\omega$ |
| rpm | revolutions per minute | $\times 2\pi$ → rad/min |
| deg/s | degrees per second | $\times \tfrac{\pi}{180}$ → rad/s |

The key fact: **1 revolution $= 2\pi$ radians $= 360^\circ$.**

Example: a fan at $90$ rpm turns $90 \times 2\pi = 180\pi$ rad/min $\approx 565.5$ rad/min. Divide by 60 for seconds: $3\pi \approx 9.42$ rad/s.

## Every point on a rigid spinning object has the same $\omega$

A point near the hub and a point on the rim turn through the same angle in the same time, so they have the **same angular velocity** — even though the rim point moves much faster. (That's the next topic.)

> **Common mistake:** leaving $\omega$ in rpm and plugging it into $v = r\omega$. Formulas with $\theta$ or $\omega$ need **radians**. Convert rpm → rad/time first.

> **Common mistake:** mixing minutes and seconds. Decide on one time unit at the start and convert everything to it.`,
    explore: {
      type: 'custom',
      intro: 'Change $r$ and the rpm. Press **Play** to watch. The readout shows $\\omega$ in rpm, rad/min, rad/s and degrees per second — all the same speed in different units.',
      setup(c, L) { wheelExplorer(c, L, { mode: 'single', modeSwitch: false }); },
      tasks: r`1. Set 30 rpm. Before reading it off, convert to rad/s yourself. (Check: $30 \cdot 2\pi / 60$.)
2. Change $r$ while keeping the rpm fixed. Does $\omega$ change? Why not?
3. Find the rpm that makes $\omega \approx 1$ rad/s. Why is it about $9.5$?`
    },
    practice: [
      { q: r`A ceiling fan makes $150$ revolutions in one minute. Find its angular velocity in rpm, rad/min, and rad/s.`, hint: 'One revolution is 2π radians.', answer: r`$150$ rpm $= 300\pi \approx 942.5$ rad/min $= 5\pi \approx 15.71$ rad/s`, solution: r`$150 \times 2\pi = 300\pi$ rad/min. Divide by $60$: $5\pi$ rad/s.` },
      { q: r`A wheel turns through $1200^\circ$ in $4$ seconds. Find $\omega$ in rad/s and in rpm.`, hint: 'Convert degrees to radians first (or degrees to revolutions for rpm).', answer: r`$\tfrac{5\pi}{3} \approx 5.24$ rad/s; $50$ rpm`, solution: r`$1200^\circ = 1200 \cdot \tfrac{\pi}{180} = \tfrac{20\pi}{3}$ rad. $\omega = \tfrac{20\pi/3}{4} = \tfrac{5\pi}{3}$ rad/s. For rpm: $1200^\circ/4\text{ s} = 300^\circ$/s $= \tfrac{300}{360}$ rev/s $\times 60 = 50$ rpm.` },
      { q: r`The Earth turns once every $24$ hours. Find its angular velocity in rad/hr and in degrees per hour.`, hint: 'θ = 2π in t = 24 h.', answer: r`$\tfrac{\pi}{12} \approx 0.2618$ rad/hr $= 15^\circ$ per hour`, solution: r`$\omega = 2\pi/24 = \pi/12$ rad/hr. In degrees, $360^\circ/24 = 15^\circ$/hr.` },
      { q: r`Convert $8$ rad/s to rpm.`, hint: 'rad/s → rad/min (×60) → rev/min (÷2π).', answer: r`$\tfrac{240}{\pi} \approx 76.39$ rpm`, solution: r`$8 \times 60 = 480$ rad/min. $480 / (2\pi) = 240/\pi \approx 76.39$ rev/min.` },
      { q: r`A point near the hub of a merry-go-round and a point on its edge: which has the larger angular velocity?`, hint: 'In one second, through what angle does each turn?', answer: 'They are **equal**.', solution: r`The whole merry-go-round is rigid, so every point sweeps the same angle in the same time: same $\theta$, same $t$, same $\omega$. (Their *linear* velocities differ.)` }
    ],
    quiz: [
      function (rng) {
        const n = rng.pick([5, 8, 10, 12, 15, 20, 24, 30, 45]), t = rng.pick([2, 3, 4, 5, 6, 10]);
        const ans = TAU * n / t;
        return { type: 'number', parse: 'pi', prompt: 'A wheel makes $' + n + '$ revolutions in $' + t + '$ seconds. Find $\\omega$ in **radians per second** (exact like `4pi`, or a decimal).', answer: ans, tol: rel(ans), unit: 'rad/s', answerText: M.formatPi(ans) + ' ≈ ' + M.fmt(ans, 3), explanation: '$\\theta = ' + n + '\\text{ rev} \\times 2\\pi = ' + (2 * n) + '\\pi$ rad, so $\\omega = \\dfrac{' + (2 * n) + '\\pi}{' + t + '} = ' + M.texPi(ans) + ' \\approx ' + M.fmt(ans, 3) + '$ rad/s.' };
      },
      function (rng) {
        const rpm = rng.pick([30, 45, 60, 90, 120, 100 / 3, 78, 150, 300]);
        const ans = rpm * TAU / 60;
        return { type: 'number', parse: 'pi', prompt: 'Convert $' + rpmTex(rpm) + '$ rpm to **rad/s**.', answer: ans, tol: rel(ans), unit: 'rad/s', answerText: M.formatPi(ans) + ' ≈ ' + M.fmt(ans, 3), explanation: '$' + rpmTex(rpm) + '\\ \\tfrac{\\text{rev}}{\\text{min}} \\times 2\\pi \\tfrac{\\text{rad}}{\\text{rev}} \\times \\tfrac{1\\text{ min}}{60\\text{ s}} = ' + M.texPi(ans) + ' \\approx ' + M.fmt(ans, 3) + '$ rad/s.' };
      },
      function (rng) {
        const w = rng.pick([[PI, '\\pi'], [2 * PI, '2\\pi'], [4, '4'], [5, '5'], [10, '10'], [3 * PI / 2, '\\tfrac{3\\pi}{2}'], [12, '12']]);
        const ans = w[0] * 60 / TAU;
        return { type: 'number', prompt: 'A pulley spins at $' + w[1] + '$ rad/s. How many **rpm** is that? (2 decimals)', answer: ans, tol: rel(ans), unit: 'rpm', answerText: M.fmt(ans, 2), explanation: 'rad/s → rad/min: $\\times 60$. rad → rev: $\\div 2\\pi$. So $' + w[1] + ' \\times 60 \\div 2\\pi \\approx ' + M.fmt(ans, 2) + '$ rpm.' };
      },
      function (rng) {
        const D = rng.pick([90, 120, 270, 450, 540, 720, 1080]), t = rng.pick([2, 3, 4, 5, 6]);
        const ans = D * PI / 180 / t;
        return { type: 'number', parse: 'pi', prompt: 'A gear turns $' + D + '^\\circ$ in $' + t + '$ s. Find $\\omega$ in **rad/s**.', answer: ans, tol: rel(ans), unit: 'rad/s', answerText: M.formatPi(ans) + ' ≈ ' + M.fmt(ans, 3), explanation: '$' + D + '^\\circ = ' + M.texPi(D * PI / 180) + '$ rad. $\\omega = \\theta / t = ' + M.texPi(ans) + ' \\approx ' + M.fmt(ans, 3) + '$ rad/s.' };
      },
      function (rng) {
        const a = rng.pick(['a point on the rim', 'a point halfway out', 'a point 1 cm from the hub']);
        return { type: 'mc', prompt: 'A CD spins at $' + rng.pick([200, 300, 500]) + '$ rpm. Compared with the center region, **' + a + '** has…', choices: [{ text: 'the same angular velocity', correct: true }, { text: 'a larger angular velocity', correct: false }, { text: 'a smaller angular velocity', correct: false }], explanation: 'Every point on a rigid spinning object sweeps the same angle in the same time, so $\\omega$ is the same everywhere. What changes with distance from the center is the **linear** velocity $v = r\\omega$.' };
      }
    ]
  });

  // ======================= 4-4b linear velocity =======================
  sec.topics.push({
    id: '4-4-linear', title: 'Linear velocity: v = a / t and v = rω',
    notes: r`## How fast a point moves along its circle

**Linear velocity** $v$ is the distance a point travels along its circular path (the arc length $a$) per unit of time:

$$v = \frac{a}{t}$$

## Connecting $v$ and $\omega$

Arc length is $a = r\theta$ **when $\theta$ is in radians**. Divide both sides by $t$:

$$\frac{a}{t} = r\,\frac{\theta}{t} \qquad\Longrightarrow\qquad \boxed{v = r\omega}$$

{{fig:u4-same-disk}}

Units: $v$ comes out in (units of $r$) per (time unit of $\omega$). Radians are a ratio, so they "disappear": $\text{in} \times \tfrac{\text{rad}}{\text{min}} = \tfrac{\text{in}}{\text{min}}$.

## Worked example

A wheel of radius $6$ in turns at $20$ rpm. Speed of a point on the rim?

1. $\omega = 20 \times 2\pi = 40\pi$ rad/min
2. $v = r\omega = 6 \times 40\pi = 240\pi \approx 754$ in/min
3. In in/s: $754 / 60 \approx 12.6$ in/s

## Rearranging

- $\omega = \dfrac{v}{r}$ — given a speed, find the spin
- $r = \dfrac{v}{\omega}$ — given both, find the radius

> **Common mistake:** $v = r \times \text{rpm}$. That's missing the $2\pi$ — it treats one revolution as one radian.

> **Common mistake:** using diameter for $r$. Halve it first.`,
    explore: {
      type: 'custom',
      intro: 'P is on the rim and Q is halfway in. The highlighted arcs show how far each one travels in one second. That arc length per second **is** $v$. Turn on **Hide answers**, predict both speeds, then turn it off to check.',
      setup(c, L) { wheelExplorer(c, L, { mode: 'single', modeSwitch: false, r: 8, rpm: 15 }); },
      tasks: r`1. With $r = 8$ in and $15$ rpm, compute $v_P$ in in/s by hand, then check.
2. Double the rpm. What happens to $v_P$? Double $r$ instead. Same effect?
3. Without changing the rpm, find the $r$ that makes $v_P = 2\pi$ in/s.`
    },
    practice: [
      { q: r`A wheel of radius $12$ in turns at $30$ rpm. Find the linear velocity of a point on its rim in in/min and in ft/s.`, hint: 'ω in rad/min first.', answer: r`$720\pi \approx 2261.9$ in/min $= \pi \approx 3.14$ ft/s`, solution: r`$\omega = 30 \times 2\pi = 60\pi$ rad/min. $v = 12 \times 60\pi = 720\pi$ in/min. $\div 12$ in/ft $\div 60$ s/min: $\pi$ ft/s.` },
      { q: r`A point moves $50$ cm along a circle of radius $10$ cm in $2$ s. Find $v$ and $\omega$.`, hint: 'v = a/t; then ω = v/r.', answer: r`$v = 25$ cm/s, $\omega = 2.5$ rad/s`, solution: r`$v = 50/2 = 25$ cm/s. $\omega = v/r = 25/10 = 2.5$ rad/s. (Check: $\theta = a/r = 5$ rad in 2 s.)` },
      { q: r`The Earth's equator has radius about $3960$ mi. How fast is a person on the equator moving because of Earth's rotation?`, hint: 'ω = 2π per 24 h.', answer: r`$\approx 1036.7$ mi/hr`, solution: r`$v = r\omega = 3960 \times \tfrac{2\pi}{24} = 330\pi \approx 1036.7$ mi/hr.` },
      { q: r`The minute hand of a clock is $4$ in long. How fast does its tip move, in inches per minute?`, hint: 'One revolution per hour.', answer: r`$\tfrac{2\pi}{15} \approx 0.419$ in/min`, solution: r`$\omega = 2\pi$ rad/hr $= \tfrac{2\pi}{60} = \tfrac{\pi}{30}$ rad/min. $v = 4 \cdot \tfrac{\pi}{30} = \tfrac{2\pi}{15}$ in/min.` },
      { q: r`Two kids ride a merry-go-round turning at $10$ rpm, one $3$ ft from the center and one $6$ ft from the center. Find both linear velocities.`, hint: 'Same ω for both.', answer: r`$60\pi \approx 188.5$ ft/min and $120\pi \approx 377.0$ ft/min`, solution: r`$\omega = 20\pi$ rad/min. $v = 3 \cdot 20\pi = 60\pi$ and $6 \cdot 20\pi = 120\pi$ ft/min. Twice the radius → twice the speed.` }
    ],
    quiz: [
      function (rng) {
        const rr = rng.pick([3, 4, 5, 6, 8, 10, 12]), rpm = rng.pick([10, 20, 30, 45, 60, 100 / 3]);
        const ans = rr * rpm * TAU / 60;
        return { type: 'number', prompt: 'A wheel of radius $' + rr + '$ in turns at $' + rpmTex(rpm) + '$ rpm. Find the linear velocity of a point on its rim in **in/s** (2 decimals).', answer: ans, tol: rel(ans), unit: 'in/s', answerText: f2(ans), explanation: '$\\omega = ' + rpmTex(rpm) + ' \\times 2\\pi = ' + M.texPi(rpm * TAU) + '$ rad/min. $v = r\\omega = ' + rr + ' \\times ' + M.texPi(rpm * TAU) + ' \\approx ' + M.fmt(ans * 60, 1) + '$ in/min $\\div 60 \\approx ' + f2(ans) + '$ in/s.' };
      },
      function (rng) {
        const rr = rng.pick([0.5, 1, 1.5, 2, 2.5, 3]), v = rng.pick([6, 10, 12, 15, 20, 30]);
        const w = v / rr, rpm = w * 60 / TAU;
        return { type: 'multi', prompt: 'A point on the rim of a pulley of radius $' + rr + '$ ft moves at $' + v + '$ ft/s. Find $\\omega$.', fields: [{ label: '$\\omega$ (rad/s)', answer: w, tol: rel(w), answerText: M.fmt(w, 3) }, { label: '$\\omega$ (rpm)', answer: rpm, tol: rel(rpm), answerText: M.fmt(rpm, 2) }], explanation: '$\\omega = v / r = ' + v + ' / ' + rr + ' = ' + M.fmt(w, 3) + '$ rad/s. Then $\\times 60 \\div 2\\pi \\approx ' + M.fmt(rpm, 2) + '$ rpm.' };
      },
      function (rng) {
        const rr = rng.pick([5, 8, 10, 12, 20]), D = rng.pick([45, 60, 90, 120, 150, 270]), t = rng.pick([2, 3, 4, 5]);
        const a = rr * D * PI / 180, v = a / t;
        return { type: 'number', prompt: 'A point on a circle of radius $' + rr + '$ cm moves through a central angle of $' + D + '^\\circ$ in $' + t + '$ s. Find its linear velocity in **cm/s** (2 decimals).', answer: v, tol: rel(v), unit: 'cm/s', answerText: f2(v), explanation: '$a = r\\theta = ' + rr + ' \\cdot ' + M.texPi(D * PI / 180) + ' \\approx ' + f2(a) + '$ cm (radians!). $v = a/t \\approx ' + f2(v) + '$ cm/s.' };
      },
      function (rng) {
        const R0 = rng.pick([12, 15, 18, 20, 24]), frac = rng.pick([1 / 2, 1 / 3, 2 / 3, 1 / 4, 3 / 4]), V = rng.pick([30, 40, 60, 90]);
        const ri = R0 * frac, ans = V * frac;
        return { type: 'number', prompt: 'On a spinning disk of radius $' + R0 + '$ in, a point on the rim moves at $' + V + '$ in/s. How fast does a point $' + M.fmt(ri, 2) + '$ in from the center move (in/s)?', answer: ans, tol: rel(ans), unit: 'in/s', answerText: f2(ans), explanation: 'Same disk → same $\\omega = ' + V + '/' + R0 + '$. So $v = r\\omega$ scales with $r$: $' + V + ' \\times \\tfrac{' + M.fmt(ri, 2) + '}{' + R0 + '} = ' + f2(ans) + '$ in/s.' };
      },
      function (rng) {
        const rr = rng.pick([2, 3, 4, 5]), rpm = rng.pick([10, 20, 30]);
        const good = rr * rpm * TAU;
        const choices = [
          { text: M.fmt(good, 1) + ' in/min', correct: true },
          { text: M.fmt(rr * rpm, 1) + ' in/min', correct: false },
          { text: M.fmt(2 * rr * rpm * TAU, 1) + ' in/min', correct: false },
          { text: M.fmt(rpm * TAU / rr, 1) + ' in/min', correct: false }
        ];
        return { type: 'mc', prompt: 'A wheel of radius $' + rr + '$ in spins at $' + rpm + '$ rpm. Which is the linear velocity of its rim?', choices, explanation: '$\\omega = ' + rpm + ' \\times 2\\pi$ rad/min, $v = r\\omega = ' + rr + ' \\times ' + (2 * rpm) + '\\pi \\approx ' + M.fmt(good, 1) + '$ in/min. The distractors forgot the $2\\pi$, used the diameter, or divided by $r$.' };
      }
    ]
  });

  // ======================= 4-4c connected wheels & rolling =======================
  sec.topics.push({
    id: '4-4-connected', title: 'Belts, touching wheels, shared axles & rolling',
    notes: r`## Three rules that solve almost every problem

**1. Same axle (or same rigid object) → same $\omega$.**
Wheels fixed to one shaft turn through the same angle together.

**2. Belt, chain, or rims touching without slipping → same $v$ at the rims.**
The belt can't be in two places at different speeds, so

$$r_1\omega_1 = r_2\omega_2$$

The smaller wheel spins faster. Touching wheels turn in **opposite** directions; a belt (not crossed) keeps the **same** direction.

{{fig:u4-belt}}

{{fig:u4-gears}}

**3. Rolling without slipping → vehicle speed = rim speed $= r\omega$.**
The part of the tire touching the road isn't sliding, so the axle (and the car) moves at the speed the rim moves around the axle.

{{fig:u4-rolling}}

## Chains of connections

Problems often link several rules. Bicycle: pedals → (same axle) → front sprocket → (chain: same $v$) → rear sprocket → (same axle) → rear wheel → (rolling) → bike speed.

{{fig:u4-bike}}

## Unit conversions you'll need

- $1$ mi $= 5280$ ft $= 63{,}360$ in
- $60$ mi/hr $= 88$ ft/s $= 1056$ in/s
- mi/hr → ft/s: multiply by $\tfrac{5280}{3600} = \tfrac{22}{15}$

> **Common mistake:** setting the rpm's equal across a belt. Across a belt it's the **rim speeds** that match. The rpm's are in the *inverse* ratio of the radii.

> **Common mistake:** using rule 2 for wheels on the same axle (or rule 1 for a belt). Before computing, label each connection "same ω" or "same v".`,
    explore: {
      type: 'custom',
      intro: 'Two wheels joined three ways: a **belt**, rims **touching**, or a **same axle**. Turn on **Hide answers**, predict wheel 2’s rpm and rim speed, then check. Press **Play** to see the directions.',
      setup(c, L) { wheelExplorer(c, L, { mode: 'linked', modeSwitch: false, r1: 6, r2: 3, rpm1: 20 }); },
      tasks: r`1. **Belt**, $r_1 = 6$, $r_2 = 3$, $20$ rpm: predict rpm₂. Then make $r_2 = 2$.
2. Switch to **touching**. Do the numbers change? What changes?
3. Switch to **same axle**. Now which quantity matches, and which doesn't?
4. Find a belt setup where wheel 2 turns exactly $60$ rpm.`
    },
    practice: [
      { q: r`An $8$-in-radius pulley turning at $300$ rpm drives a $3$-in-radius pulley by a belt. How fast does the small pulley turn?

{{fig:u4-belt}}`, hint: 'Same rim speed: r₁ω₁ = r₂ω₂ — rpm works directly here because the 2π cancels.', answer: r`$800$ rpm`, solution: r`$8 \times 300 = 3 \times \omega_2 \Rightarrow \omega_2 = 800$ rpm. (The $2\pi$ would appear on both sides and cancel.)` },
      { q: r`Wheel A (radius $10$ cm) turns clockwise at $45$ rpm and touches wheel B (radius $2.5$ cm) with no slipping. Find B's rpm and direction.`, hint: 'Touching rims: same v, opposite directions.', answer: r`$180$ rpm, counterclockwise`, solution: r`$10 \times 45 = 2.5\,\omega_B \Rightarrow \omega_B = 180$ rpm. Touching wheels turn opposite ways.` },
      { q: r`A car's tires have diameter $26$ in. At $65$ mi/hr, how many rpm do the tires turn?`, hint: 'Rolling: v = rω. Convert mi/hr to in/min.', answer: r`$\approx 840.3$ rpm`, solution: r`$65$ mi/hr $= 65 \times 63{,}360 / 60 = 68{,}640$ in/min. $r = 13$ in. $\omega = 68{,}640/13 = 5280$ rad/min $\div 2\pi \approx 840.3$ rpm.` },
      { q: r`A bike's pedal sprocket has radius $4$ in, the rear sprocket $1.5$ in, and the rear wheel $13$ in. Pedaling at $60$ rpm, how fast does the bike go in mi/hr?

{{fig:u4-bike}}`, hint: 'Chain: same v. Rear sprocket & wheel: same ω. Wheel rolling: bike speed = wheel rim speed.', answer: r`$\approx 12.38$ mi/hr`, solution: r`Chain: $4 \times 60 = 1.5\,\omega \Rightarrow \omega = 160$ rpm for the rear sprocket — and the rear wheel (same axle). Wheel rim: $v = 13 \times 160 \times 2\pi = 4160\pi \approx 13{,}069$ in/min. $\times 60 \div 63{,}360 \approx 12.38$ mi/hr.` },
      { q: r`Two gears mesh. Gear 1 has $40$ teeth and gear 2 has $16$ teeth. If gear 1 turns at $50$ rpm, how fast does gear 2 turn?`, hint: 'Teeth are proportional to radius (same tooth size).', answer: r`$125$ rpm`, solution: r`Same speed at the teeth: $40 \times 50 = 16\,\omega_2 \Rightarrow \omega_2 = 125$ rpm.` }
    ],
    quiz: [
      function (rng) {
        const r1 = rng.pick([4, 5, 6, 8, 10, 12]), r2 = rng.pick([1, 1.5, 2, 2.5, 3]), rpm1 = rng.pick([30, 45, 60, 100, 120, 200]);
        const ans = rpm1 * r1 / r2;
        const how = rng.pick(['connected by a belt', 'touching rim to rim (no slipping)']);
        return { type: 'number', prompt: 'A wheel of radius $' + r1 + '$ in turning at $' + rpm1 + '$ rpm drives a wheel of radius $' + r2 + '$ in, ' + how + '. Find the second wheel’s rpm.', answer: ans, tol: rel(ans), unit: 'rpm', answerText: M.fmt(ans, 2), explanation: 'Same rim speed: $r_1\\omega_1 = r_2\\omega_2 \\Rightarrow \\omega_2 = \\dfrac{' + r1 + ' \\times ' + rpm1 + '}{' + r2 + '} = ' + M.fmt(ans, 2) + '$ rpm. Smaller wheel → faster.' };
      },
      function (rng) {
        const r1 = rng.pick([2, 3, 4]), r2 = rng.pick([6, 8, 10, 12]), rpm = rng.pick([20, 30, 45, 60]);
        const v2 = r2 * rpm * TAU;
        return { type: 'number', prompt: 'A small wheel (radius $' + r1 + '$ in) and a large wheel (radius $' + r2 + '$ in) are fixed to the **same axle**, turning at $' + rpm + '$ rpm. Find the linear velocity of the **large** wheel’s rim in **in/min** (1 decimal).', answer: v2, tol: rel(v2), unit: 'in/min', answerText: M.fmt(v2, 1), explanation: 'Same axle → same $\\omega = ' + rpm + ' \\times 2\\pi = ' + (2 * rpm) + '\\pi$ rad/min. $v = r\\omega = ' + r2 + ' \\times ' + (2 * rpm) + '\\pi \\approx ' + M.fmt(v2, 1) + '$ in/min. (The small wheel’s radius is a distractor.)' };
      },
      function (rng) {
        const D = rng.pick([24, 25, 26, 28, 30]), S = rng.pick([30, 45, 55, 60, 65, 70]);
        const vin = S * 63360 / 60, rpm = vin / (D / 2) / TAU;
        return { type: 'number', prompt: 'A car with tires of **diameter** $' + D + '$ in travels at $' + S + '$ mi/hr. How many rpm do the tires make? (1 decimal)', answer: rpm, tol: rel(rpm), unit: 'rpm', answerText: M.fmt(rpm, 1), explanation: '$' + S + '$ mi/hr $= ' + S + ' \\times 63{,}360 / 60 = ' + M.fmt(vin) + '$ in/min. $r = ' + (D / 2) + '$ in. $\\omega = v/r = ' + M.fmt(vin / (D / 2), 1) + '$ rad/min $\\div 2\\pi \\approx ' + M.fmt(rpm, 1) + '$ rpm.' };
      },
      function (rng) {
        const S = rng.pick([15, 30, 45, 60, 75, 90]);
        const ans = S * 22 / 15;
        return { type: 'number', prompt: 'Convert $' + S + '$ mi/hr to **ft/s**.', answer: ans, tol: rel(ans), unit: 'ft/s', answerText: M.fmt(ans, 2), explanation: '$' + S + ' \\tfrac{\\text{mi}}{\\text{hr}} \\times \\tfrac{5280\\text{ ft}}{1\\text{ mi}} \\times \\tfrac{1\\text{ hr}}{3600\\text{ s}} = ' + S + ' \\times \\tfrac{22}{15} = ' + M.fmt(ans, 2) + '$ ft/s.' };
      },
      function (rng) {
        const items = [
          ['two pulleys connected by a belt', 'v'], ['two gears that mesh', 'v'], ['a bike’s front and rear sprockets (joined by the chain)', 'v'],
          ['a turntable and the drive wheel fixed under it on the same axle', 'w'], ['a bike’s rear sprocket and rear wheel', 'w'],
          ['a point on the rim and a point halfway to the hub of one wheel', 'w'], ['the pedals and the front sprocket of a bike', 'w']
        ];
        const [desc, ans] = rng.pick(items);
        return { type: 'mc', prompt: 'For ' + desc + ', which quantity must be the **same**?', choices: [{ text: 'angular velocity $\\omega$', correct: ans === 'w' }, { text: 'linear velocity $v$ at the rims / contact', correct: ans === 'v' }], explanation: ans === 'w' ? 'They are rigidly attached (same axle / same object), so they turn through the same angle in the same time: same $\\omega$. Their rim speeds differ if their radii differ.' : 'They are linked at their rims (belt, chain, or teeth), which can’t slip, so the rims move at the same speed: same $v$, i.e. $r_1\\omega_1 = r_2\\omega_2$.' };
      },
      function (rng) {
        const r1 = rng.pick([3, 3.5, 4, 4.5]), r2 = rng.pick([1, 1.25, 1.5, 2]), R0 = rng.pick([12, 13, 13.5, 14]), p = rng.pick([50, 60, 70, 80]);
        const rpm2 = p * r1 / r2, vin = R0 * rpm2 * TAU, mph = vin * 60 / 63360;
        return { type: 'multi', prompt: 'Bicycle: pedal sprocket radius $' + r1 + '$ in, rear sprocket $' + r2 + '$ in, rear wheel $' + R0 + '$ in. The rider pedals at $' + p + '$ rpm.', fields: [{ label: 'rear wheel rpm', answer: rpm2, tol: rel(rpm2), answerText: M.fmt(rpm2, 2) }, { label: 'bike speed (mi/hr)', answer: mph, tol: rel(mph), answerText: M.fmt(mph, 2) }], explanation: 'Chain → same $v$: $' + r1 + ' \\times ' + p + ' = ' + r2 + '\\,\\omega$, so the rear sprocket — and the wheel on its axle — turns $' + M.fmt(rpm2, 2) + '$ rpm. Wheel rim: $v = ' + R0 + ' \\times ' + M.fmt(rpm2, 2) + ' \\times 2\\pi \\approx ' + M.fmt(vin, 0) + '$ in/min $\\times 60 \\div 63{,}360 \\approx ' + M.fmt(mph, 2) + '$ mi/hr.' };
      }
    ]
  });

  // ======================= 4-4d word problems =======================
  sec.topics.push({
    id: '4-4-word', title: 'Word problems: the train & the record player',
    notes: r`## A routine for any velocity word problem

1. **Draw it.** Label every radius (careful: diameter vs radius, and "projects 1 in beyond" means *add* to the radius).
2. **Label each connection** "same $\omega$" (same axle/object) or "same $v$" (belt, touching, rolling).
3. **Pick units** and convert at the start: rpm → rad/min ($\times 2\pi$), mi/hr → in/min, etc.
4. **Walk the chain** with $v = r\omega$, one connection at a time.
5. **Sanity check.** Smaller wheel on a belt → faster spin. Farther from the center on one wheel → faster linear speed.

## A useful shortcut

When two points share $\omega$, their speeds are in the ratio of their radii:

$$\frac{v_1}{v_2} = \frac{r_1}{r_2}$$

When two rims share $v$, their spins are in the *inverse* ratio:

$$\frac{\omega_1}{\omega_2} = \frac{r_2}{r_1}$$

Both shortcuts work in rpm directly — the $2\pi$ cancels.`,
    explore: {
      type: 'custom',
      intro: 'Use this to check your setup on the practice problems. For the record player: the turntable and the large drive wheel are **same axle**; the large and small drive wheels are **touching**.',
      setup(c, L) { wheelExplorer(c, L, { mode: 'linked', modeSwitch: true, kind: 'axle', r1: 5, r2: 3, rpm1: 33 }); }
    },
    practice: [
      {
        q: r`**The Train Problem (easy).** A train wheel has a diameter of $30$ in to the rim, which rests on the track. The **flange**, which keeps the wheel from slipping off the track, projects $1$ in beyond the rim. When the train is traveling $60$ mi/hr, what is the linear velocity of a point on the outer edge of the flange?

{{fig:u4-train}}`,
        hint: r`The rim rolls on the track, so a point on the rim moves (around the axle) at the train's speed. The flange is on the same wheel → same $\omega$. What are the two radii?`,
        answer: r`$64$ mi/hr $\;(= 1126.4$ in/s $\approx 93.9$ ft/s$)$`,
        solution: r`- Rim radius $= 30/2 = 15$ in. Flange radius $= 15 + 1 = 16$ in.
- Rolling: rim speed $= 60$ mi/hr $= 60 \times 63{,}360 / 3600 = 1056$ in/s.
- $\omega = v/r = 1056 / 15 = 70.4$ rad/s (same for the whole wheel).
- Flange: $v = r\omega = 16 \times 70.4 = 1126.4$ in/s $= 64$ mi/hr.

**Shortcut:** same $\omega$, so speeds scale with radius: $60 \times \tfrac{16}{15} = 64$ mi/hr.

*Fun fact:* this is speed relative to the axle. Relative to the ground, the bottom of the flange is below the rail and actually moves **backward** for an instant.`
      },
      {
        q: r`**The Record Player Problem (hard).** The turntable on a record player rotates at $33\tfrac13$ rpm. The turntable has radius $5$ in.

- **a.** What is the linear velocity of a point on its rim?
- **b.** A large drive wheel (radius $3$ in) is attached to the turntable's axle, below the turntable. What is the linear velocity of its rim?
- **c.** A motor drives a small drive wheel at $600$ rpm. What must the radius of the small drive wheel be so that the turntable rotates at $33\tfrac13$ rpm with no slippage between the two drive wheels?

{{fig:u4-record}}`,
        hint: r`(a) convert rpm to rad/min. (b) same axle → same $\omega$. (c) touching drive wheels → same rim $v$ — use your answer to (b).`,
        answer: r`- **a.** $\tfrac{1000\pi}{3} \approx 1047.2$ in/min $(\approx 17.45$ in/s$)$
- **b.** $200\pi \approx 628.3$ in/min $(\approx 10.47$ in/s$)$
- **c.** $r = \tfrac16$ in $\approx 0.167$ in`,
        solution: r`**a.** $\omega = 33\tfrac13 \times 2\pi = \tfrac{100}{3} \cdot 2\pi = \tfrac{200\pi}{3}$ rad/min. $v = r\omega = 5 \cdot \tfrac{200\pi}{3} = \tfrac{1000\pi}{3} \approx 1047.2$ in/min.

**b.** The large drive wheel is on the **same axle** → same $\omega = \tfrac{200\pi}{3}$ rad/min. $v = 3 \cdot \tfrac{200\pi}{3} = 200\pi \approx 628.3$ in/min.

**c.** The small wheel **touches** the large one with no slipping → same rim speed, $200\pi$ in/min. Its $\omega = 600 \times 2\pi = 1200\pi$ rad/min. So $r = v/\omega = \tfrac{200\pi}{1200\pi} = \tfrac16$ in.

**Shortcut for c:** $r_{\text{small}} \times 600 = 3 \times 33\tfrac13 = 100 \Rightarrow r_{\text{small}} = \tfrac16$ in.`
      },
      {
        q: r`A conveyor belt runs over a roller of radius $4$ in turning at $90$ rpm. How fast does a box on the belt move, in ft/min?`,
        hint: 'The belt moves at the roller’s rim speed.',
        answer: r`$60\pi \approx 188.5$ ft/min`,
        solution: r`$\omega = 180\pi$ rad/min. $v = 4 \times 180\pi = 720\pi$ in/min $= 60\pi$ ft/min.`
      },
      {
        q: r`A clothes-dryer drum has radius $1$ ft and turns at $50$ rpm. How fast does a sock pressed against the drum move, in mi/hr?`,
        hint: 'v in ft/min, then convert.',
        answer: r`$\approx 3.57$ mi/hr`,
        solution: r`$v = 1 \times 100\pi = 100\pi \approx 314.16$ ft/min $\times 60 = 18{,}850$ ft/hr $\div 5280 \approx 3.57$ mi/hr.`
      },
      {
        q: r`A lawn-mower engine pulley (radius $1.5$ in) turns at $3000$ rpm and drives the blade pulley (radius $4$ in) by a belt. The blade tip is $10$ in from the blade's center. How fast does the blade tip move, in ft/s?

{{fig:u4-belt}}`,
        hint: 'Belt → same v. Blade pulley & blade → same ω.',
        answer: r`$\approx 98.2$ ft/s`,
        solution: r`Belt: $1.5 \times 3000 = 4\,\omega \Rightarrow \omega = 1125$ rpm for the blade pulley and blade. Tip: $v = 10 \times 1125 \times 2\pi = 22{,}500\pi$ in/min $\approx 70{,}686$ in/min $\div 12 \div 60 \approx 98.2$ ft/s.`
      }
    ],
    quiz: [
      function (rng) {
        const D = rng.pick([28, 30, 32, 36, 40]), e = rng.pick([1, 1.5, 2]), S = rng.pick([30, 45, 50, 60, 75]);
        const ans = S * (D / 2 + e) / (D / 2);
        return { type: 'number', prompt: 'A train wheel has diameter $' + D + '$ in to the rim, and its flange projects $' + e + '$ in beyond the rim. At $' + S + '$ mi/hr, how fast is a point on the outer edge of the flange moving, in **mi/hr**? (2 decimals)', answer: ans, tol: rel(ans), unit: 'mi/hr', answerText: f2(ans), explanation: 'Rim radius $' + (D / 2) + '$ in rolls at $' + S + '$ mi/hr. Flange radius $' + (D / 2 + e) + '$ in, same $\\omega$, so $v = ' + S + ' \\times \\tfrac{' + (D / 2 + e) + '}{' + (D / 2) + '} \\approx ' + f2(ans) + '$ mi/hr.' };
      },
      function (rng) {
        const RT = rng.pick([5, 6]), rpm = rng.pick([100 / 3, 45, 78]), RD = rng.pick([2, 2.5, 3]), motor = rng.pick([300, 600, 900, 1200]);
        const w = rpm * TAU, va = RT * w, vb = RD * w, rs = vb / (motor * TAU);
        return { type: 'multi', prompt: 'A turntable (radius $' + RT + '$ in) spins at $' + rpmTex(rpm) + '$ rpm. A large drive wheel (radius $' + RD + '$ in) is on the same axle. A small drive wheel, turned by a motor at $' + motor + '$ rpm, touches the large drive wheel without slipping.', fields: [{ label: 'turntable rim $v$ (in/min)', answer: va, tol: rel(va), answerText: M.fmt(va, 1) }, { label: 'large drive wheel rim $v$ (in/min)', answer: vb, tol: rel(vb), answerText: M.fmt(vb, 1) }, { label: 'small drive wheel radius (in)', answer: rs, tol: Math.max(0.002, rs * 0.01), answerText: M.fmt(rs, 4) }], explanation: '$\\omega = ' + rpmTex(rpm) + ' \\times 2\\pi$ rad/min. Turntable: $v = ' + RT + '\\omega \\approx ' + M.fmt(va, 1) + '$. Same axle: $v = ' + RD + '\\omega \\approx ' + M.fmt(vb, 1) + '$. Touching: $r \\times ' + motor + ' = ' + RD + ' \\times ' + rpmTex(rpm) + '$, so $r \\approx ' + M.fmt(rs, 4) + '$ in.' };
      },
      function (rng) {
        const rr = rng.pick([3, 4, 5, 6]), rpm = rng.pick([30, 60, 90, 120]);
        const ans = rr * rpm * TAU / 12;
        return { type: 'number', prompt: 'A conveyor belt runs over a roller of radius $' + rr + '$ in turning at $' + rpm + '$ rpm. How fast does the belt move, in **ft/min**? (1 decimal)', answer: ans, tol: rel(ans), unit: 'ft/min', answerText: M.fmt(ans, 1), explanation: '$v = r\\omega = ' + rr + ' \\times ' + (2 * rpm) + '\\pi$ in/min $\\div 12 \\approx ' + M.fmt(ans, 1) + '$ ft/min.' };
      },
      function (rng) {
        const re = rng.pick([1, 1.5, 2]), rpmE = rng.pick([1800, 2400, 3000, 3600]), rb = rng.pick([3, 4, 5]), L = rng.pick([8, 9, 10, 11]);
        const wB = rpmE * re / rb, v = L * wB * TAU / 12 / 60;
        return { type: 'number', prompt: 'An engine pulley (radius $' + re + '$ in) turns at $' + rpmE + '$ rpm and drives a blade pulley (radius $' + rb + '$ in) by a belt. The blade tip is $' + L + '$ in from the blade’s center. How fast does the tip move, in **ft/s**? (1 decimal)', answer: v, tol: rel(v), unit: 'ft/s', answerText: M.fmt(v, 1), explanation: 'Belt: $' + re + ' \\times ' + rpmE + ' = ' + rb + '\\,\\omega \\Rightarrow \\omega = ' + M.fmt(wB, 2) + '$ rpm (blade, same axle). Tip: $v = ' + L + ' \\times ' + M.fmt(wB, 2) + ' \\times 2\\pi$ in/min $\\div 720 \\approx ' + M.fmt(v, 1) + '$ ft/s.' };
      }
    ]
  });
})();
