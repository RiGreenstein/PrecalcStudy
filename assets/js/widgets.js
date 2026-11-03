/* Interactive explorers: sinusoid/trig transformer, unit circle, inverse functions, real-world models. */
(function () {
  const PI = Math.PI;
  const el = R.el;

  const TRIG = {
    sin: { f: Math.sin, tex: '\\sin', period: 2 * PI, kind: 'sinusoid' },
    cos: { f: Math.cos, tex: '\\cos', period: 2 * PI, kind: 'sinusoid' },
    tan: { f: Math.tan, tex: '\\tan', period: PI, kind: 'tan' },
    cot: { f: x => 1 / Math.tan(x), tex: '\\cot', period: PI, kind: 'tan' },
    sec: { f: x => 1 / Math.cos(x), tex: '\\sec', period: 2 * PI, kind: 'recip', parent: 'cos' },
    csc: { f: x => 1 / Math.sin(x), tex: '\\csc', period: 2 * PI, kind: 'recip', parent: 'sin' }
  };

  // Build the function x ↦ C + A·trig(B(x − D)) in the given unit (deg | rad | num).
  function makeFn(name, A, B, C, D, mode) {
    const t = TRIG[name];
    const k = mode === 'deg' ? M.DEG : 1;
    return x => C + A * t.f(B * (x - D) * k);
  }
  function periodOf(name, B, mode) {
    const base = mode === 'deg' ? (TRIG[name].kind === 'tan' ? 180 : 360) : TRIG[name].period;
    return base / Math.abs(B);
  }
  function asymptotesOf(name, B, D, mode, xMin, xMax) {
    const kind = TRIG[name].kind;
    if (kind === 'sinusoid') return [];
    const P = periodOf(name, B, mode);
    // tan & sec: asymptotes where cos(B(x−D)) = 0 → offset of a quarter of the sinusoid period
    // cot & csc: where sin(B(x−D)) = 0 → at x = D + n·P(tan)
    let first;
    if (name === 'tan') first = D + P / 2;
    else if (name === 'cot') first = D;
    else if (name === 'sec') first = D + P / 4;
    else first = D;
    const step = kind === 'tan' ? P : P / 2;
    const out = [];
    const n0 = Math.floor((xMin - first) / step) - 1;
    for (let n = n0; ; n++) { const x = first + n * step; if (x > xMax) break; if (x >= xMin) out.push(x); }
    return out;
  }

  function fmtArg(v, mode) {
    if (mode === 'deg') return M.fmt(v, 2) + '^\\circ';
    if (mode === 'rad') return M.texPi(v, 24);
    return M.fmt(v, 3);
  }
  function fmtNum(v) {
    const f = M.asPiFraction(v, 12);
    if (f && f.d !== 1 && Math.abs(v) > 1e-9) return M.texPi(v, 12);
    return M.fmt(v, 3);
  }

  // LaTeX for y = C + A·trig(B(x − D)) with the usual simplifications.
  function texEquation(name, A, B, C, D, mode) {
    let s = 'y = ';
    if (Math.abs(C) > 1e-9) s += fmtNum(C) + ' ' + (A < 0 ? '- ' : '+ ');
    else if (A < 0) s += '-';
    const a = Math.abs(A);
    if (Math.abs(a - 1) > 1e-9) s += fmtNum(a);
    s += TRIG[name].tex;
    let inner;
    if (Math.abs(D) < 1e-9) inner = 'x';
    else inner = '(x ' + (D < 0 ? '+ ' : '- ') + fmtArg(Math.abs(D), mode) + ')';
    if (Math.abs(B - 1) > 1e-9) {
      if (Math.abs(D) < 1e-9) inner = fmtNum(B) + 'x';
      else inner = fmtNum(B) + inner;
    }
    const needParens = Math.abs(D) < 1e-9 || Math.abs(B - 1) > 1e-9;
    s += needParens ? '(' + inner + ')' : inner;
    return s;
  }

  // Compare two functions numerically on a window (so sin vs cos forms both count).
  function sameGraph(f, g, xMin, xMax, tol) {
    let bad = 0, n = 0;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (xMax - xMin) * i / 200;
      const a = f(x), b = g(x);
      if (!isFinite(a) || !isFinite(b) || Math.abs(a) > 50 || Math.abs(b) > 50) continue;
      n++;
      if (Math.abs(a - b) > (tol || 0.05)) bad++;
    }
    return n > 20 && bad / n < 0.02;
  }

  // ---------- Transform explorer (all six functions) ----------
  function trig(container, cfg) {
    cfg = Object.assign({ fn: 'cos', mode: 'deg', A: 1, B: 1, C: 0, D: 0, show: {}, challenge: true, fnChoices: null, modeSwitch: true, sliders: ['A', 'B', 'C', 'D'] }, cfg);
    const show = Object.assign({ parent: true, axis: true, amplitude: true, period: true, phase: true, critical: true, asymptotes: true }, cfg.show);
    const state = { fn: cfg.fn, mode: cfg.mode, A: cfg.A, B: cfg.B, C: cfg.C, D: cfg.D, challenge: null };

    const root = el('div', { class: 'explorer' });
    container.appendChild(root);
    const top = el('div', { class: 'explorer-top' });
    const eq = el('div', { class: 'equation' });
    top.appendChild(eq);
    const switches = el('div', { class: 'explorer-switches' });
    top.appendChild(switches);
    root.appendChild(top);

    const fnChoices = cfg.fnChoices || ['sin', 'cos'];
    if (fnChoices.length > 1) {
      Graph.segmented(switches, fnChoices.map(n => ({ label: n, value: n })), state.fn, v => { state.fn = v; refresh(); });
    }
    if (cfg.modeSwitch) {
      Graph.segmented(switches, [{ label: 'degrees', value: 'deg' }, { label: 'radians', value: 'rad' }], state.mode, v => setMode(v));
    }

    const graphBox = el('div');
    root.appendChild(graphBox);
    const view = viewFor(state.mode);
    const graph = new Graph(graphBox, Object.assign({ height: 340, yStep: 1, home: [view.xMin, view.xMax, view.yMin, view.yMax] }, view));

    const controls = el('div', { class: 'explorer-controls' });
    root.appendChild(controls);
    const sliderBox = el('div', { class: 'sliders' });
    controls.appendChild(sliderBox);
    const toggleBox = el('div', { class: 'toggles' });
    controls.appendChild(toggleBox);

    const S = {};
    const defs = {
      A: { label: 'A', min: -4, max: 4, step: 0.5 },
      B: { label: 'B', min: 0.25, max: 4, step: 0.25 },
      C: { label: 'C', min: -4, max: 4, step: 0.5 },
      D: { label: 'D', min: -180, max: 360, step: 15, format: v => M.fmt(v) + '°' }
    };
    cfg.sliders.forEach(k => {
      const d = defs[k];
      S[k] = Graph.slider(sliderBox, Object.assign({ value: state[k], onInput: v => { state[k] = v; refresh(); } }, d));
    });
    function setDSlider() {
      if (!S.D) return;
      if (state.mode === 'deg') { S.D.setRange(-180, 360, 15); state.D = Math.round(state.D / 15) * 15; }
      else { S.D.setRange(-PI, 2 * PI, PI / 12); state.D = Math.round(state.D / (PI / 12)) * (PI / 12); }
      S.D.set(state.D);
    }
    if (S.D) {
      // D is the only slider whose readout depends on the angle unit
      const fmtD = v => state.mode === 'deg' ? M.fmt(v) + '°' : M.formatPi(v, 12);
      S.D.set = v => { S.D.input.value = v; S.D.row.querySelector('.slider-val').textContent = fmtD(+v); };
      S.D.input.addEventListener('input', () => { S.D.row.querySelector('.slider-val').textContent = fmtD(+S.D.input.value); });
      setDSlider();
    }

    const tg = {};
    const kind = () => TRIG[state.fn].kind;
    tg.parent = Graph.toggle(toggleBox, 'Parent function', show.parent, v => { show.parent = v; refresh(); });
    tg.axis = Graph.toggle(toggleBox, 'Sinusoidal axis', show.axis, v => { show.axis = v; refresh(); });
    tg.critical = Graph.toggle(toggleBox, 'Critical points', show.critical, v => { show.critical = v; refresh(); });
    tg.period = Graph.toggle(toggleBox, 'Period', show.period, v => { show.period = v; refresh(); });
    tg.amplitude = Graph.toggle(toggleBox, 'Amplitude', show.amplitude, v => { show.amplitude = v; refresh(); });

    const info = el('div', { class: 'explorer-info' });
    root.appendChild(info);

    let challengeBox = null;
    if (cfg.challenge) {
      challengeBox = el('div', { class: 'challenge' });
      root.appendChild(challengeBox);
      renderChallengeIdle();
    }

    function viewFor(mode) {
      return mode === 'deg'
        ? { xMin: -120, xMax: 480, yMin: -5, yMax: 5, xUnit: 'deg', xStep: 90 }
        : { xMin: -PI * 2 / 3, xMax: 2 * PI + PI * 2 / 3, yMin: -5, yMax: 5, xUnit: 'rad', xStep: PI / 2 };
    }
    function setMode(m) {
      if (m === state.mode) return;
      state.D = m === 'deg' ? M.radToDeg(state.D) : M.degToRad(state.D);
      state.mode = m;
      setDSlider();
      const v = viewFor(m);
      graph.opts.home = [v.xMin, v.xMax, v.yMin, v.yMax];
      graph.update(v);
      refresh();
    }

    function refresh() {
      const { fn, mode, A, B, C, D } = state;
      const f = makeFn(fn, A, B, C, D, mode);
      const P = periodOf(fn, B, mode);
      const fns = [];
      const k = kind();
      const hiding = !!state.challenge && !state.challenge.revealed;

      if (show.parent && !hiding) {
        const parentName = k === 'recip' ? TRIG[fn].parent : fn;
        if (k === 'recip') fns.push({ f: makeFn(parentName, A, B, C, D, mode), ghost: true, label: parentName + ' (same A,B,C,D)' });
        else fns.push({ f: makeFn(fn, 1, 1, 0, 0, mode), ghost: true, label: 'parent ' + fn });
      }
      const main = { f, label: hiding ? 'mystery graph' : fn, asymptotes: show.asymptotes ? asymptotesOf(fn, B, D, mode, -1e4, 1e4).filter(x => x >= graph.opts.xMin - P && x <= graph.opts.xMax + P) : [] };
      fns.push(main);
      if (state.challenge && state.challenge.guessFn) fns.push({ f: state.challenge.guessFn, color: graph.palette ? graph.palette.accent2 : '#d97706', dashed: true, label: 'your equation' });

      const hlines = [], brackets = [], points = [];
      if (show.axis && !hiding) hlines.push({ y: C, label: 'axis' });
      if (!hiding) {
        if (show.period) {
          const y = k === 'sinusoid' ? C - Math.abs(A) - 0.55 : k === 'tan' ? C - Math.abs(A) - 0.9 : C - 0.6;
          brackets.push({ type: 'h', x1: D, x2: D + P, y: y, below: true, label: 'period = ' + (mode === 'deg' ? M.fmt(P) + '°' : M.formatPi(P, 24)) });
        }
        if (show.amplitude && k === 'sinusoid') {
          // measure from the axis to the low point of the first cycle (label sits to the left, clear of point labels)
          const x = D + P * (fn === 'cos' ? 0.5 : 0.75);
          brackets.push({ type: 'v', x: x, y1: C, y2: C - A, label: '|A| = ' + M.fmt(Math.abs(A)), left: true });
        }
      }
      if (show.critical) {
        points.push.apply(points, criticalPoints(fn, A, B, C, D, mode, P, hiding));
      }
      graph.update({ fns, hlines, brackets, points });

      if (hiding) {
        eq.innerHTML = '<span class="muted">Equation hidden — write it from the graph.</span>';
        info.innerHTML = '';
      } else {
        eq.innerHTML = R.tex(texEquation(fn, A, B, C, D, mode), true);
        const rows = [];
        if (k !== 'tan') rows.push(['Amplitude |A|', k === 'sinusoid' ? M.fmt(Math.abs(A)) : '— (none for ' + fn + ')']);
        rows.push(['Period', (mode === 'deg' ? M.fmt(P) + '°' : M.formatPi(P, 24)) + '  = ' + (mode === 'deg' ? (k === 'tan' ? '180°' : '360°') : (k === 'tan' ? 'π' : '2π')) + ' ÷ ' + M.fmt(Math.abs(B))]);
        rows.push([k === 'tan' ? 'Center line y = C' : 'Sinusoidal axis y = C', M.fmt(C)]);
        rows.push(['Phase displacement D', mode === 'deg' ? M.fmt(D) + '°' : M.formatPi(D, 12)]);
        if (k !== 'sinusoid') rows.push(['Asymptotes', asymptoteText(fn, B, D, mode, P)]);
        info.innerHTML = rows.map(r => '<div class="info-row"><span>' + r[0] + '</span><strong>' + r[1] + '</strong></div>').join('');
      }
      // some toggles don't apply to tan/cot
      tg.amplitude.parentElement.style.display = k === 'sinusoid' ? '' : 'none';
    }

    function asymptoteText(fn, B, D, mode, P) {
      const step = TRIG[fn].kind === 'tan' ? P : P / 2;
      const first = asymptotesOf(fn, B, D, mode, D - step, D + step).find(x => x >= D - 1e-9);
      const u = v => mode === 'deg' ? M.fmt(v) + '°' : M.formatPi(v, 24);
      return 'x = ' + u(first) + ' + n·' + u(step);
    }

    refresh();

    // ---- Challenge mode ----
    function renderChallengeIdle() {
      challengeBox.innerHTML = '';
      challengeBox.appendChild(el('div', { class: 'challenge-head' }, [
        el('strong', { text: 'Challenge mode' }),
        el('span', { class: 'muted', text: ' — I draw a mystery graph; you write its equation. Any equivalent equation (sin or cos form) is accepted.' })
      ]));
      const b = el('button', { class: 'btn btn-primary', text: 'Give me a mystery graph' });
      b.addEventListener('click', startChallenge);
      challengeBox.appendChild(b);
    }

    function startChallenge() {
      const rng = M.rng(Date.now() & 0xffff);
      const fnName = rng.pick(fnChoices);
      const A = rng.pick([1, 2, 3, 0.5, 1.5, -1, -2]);
      const B = rng.pick(kind() === 'sinusoid' ? [0.5, 1, 2, 3] : [0.5, 1, 2]);
      const C = rng.int(-3, 3);
      const D = state.mode === 'deg' ? rng.pick([-60, -30, 0, 30, 45, 60, 90]) : rng.pick([-PI / 6, 0, PI / 6, PI / 4, PI / 3, PI / 2]);
      Object.assign(state, { fn: fnName, A, B, C, D, challenge: { revealed: false, guessFn: null } });
      Object.keys(S).forEach(k => S[k].set(state[k]));
      sliderBox.style.display = 'none';
      switches.style.visibility = 'hidden';
      refresh();

      challengeBox.innerHTML = '';
      const form = el('div', { class: 'challenge-form' });
      const fnSel = el('select', { class: 'input' });
      ['sin', 'cos', 'tan', 'cot', 'sec', 'csc'].filter(n => fnChoices.includes(n) || n === 'sin' || n === 'cos').forEach(n => fnSel.appendChild(el('option', { value: n, text: n })));
      fnSel.value = fnChoices[0];
      const inputs = {};
      form.appendChild(el('div', { class: 'challenge-row', html: '<span>y = </span>' }));
      const row = form.lastChild;
      inputs.C = el('input', { class: 'input input-sm', placeholder: 'C' });
      inputs.A = el('input', { class: 'input input-sm', placeholder: 'A' });
      inputs.B = el('input', { class: 'input input-sm', placeholder: 'B' });
      inputs.D = el('input', { class: 'input input-sm', placeholder: state.mode === 'deg' ? 'D (deg)' : 'D (e.g. pi/6)' });
      row.appendChild(inputs.C); row.appendChild(el('span', { text: ' + ' }));
      row.appendChild(inputs.A); row.appendChild(fnSel); row.appendChild(el('span', { text: '( ' }));
      row.appendChild(inputs.B); row.appendChild(el('span', { text: ' ( x − ' })); row.appendChild(inputs.D); row.appendChild(el('span', { text: ' ) )' }));
      challengeBox.appendChild(form);
      const msg = el('div', { class: 'challenge-msg' });
      const btns = el('div', { class: 'btn-row' });
      const check = el('button', { class: 'btn btn-primary', text: 'Check my equation' });
      const giveUp = el('button', { class: 'btn btn-ghost', text: 'Reveal answer' });
      const again = el('button', { class: 'btn btn-ghost', text: 'New mystery graph' });
      btns.appendChild(check); btns.appendChild(giveUp); btns.appendChild(again);
      challengeBox.appendChild(msg); challengeBox.appendChild(btns);

      check.addEventListener('click', () => {
        const C2 = M.parseFraction(inputs.C.value || '0');
        const A2 = M.parseFraction(inputs.A.value || '1');
        const B2 = M.parsePi(inputs.B.value || '1');
        const D2 = state.mode === 'deg' ? M.parseDMS(inputs.D.value || '0') : M.parsePi(inputs.D.value || '0');
        if ([C2, A2, B2, D2].some(v => isNaN(v))) { msg.innerHTML = '<span class="bad">I couldn\'t read one of those numbers.</span>'; return; }
        const g = makeFn(fnSel.value, A2, B2, C2, D2, state.mode);
        const target = makeFn(state.fn, state.A, state.B, state.C, state.D, state.mode);
        const ok = sameGraph(target, g, graph.opts.xMin, graph.opts.xMax);
        state.challenge.guessFn = g;
        if (ok) {
          state.challenge.revealed = true;
          msg.innerHTML = '<span class="good">Correct — your equation produces exactly this graph.</span> ' + (fnSel.value !== state.fn ? '<span class="muted">(I had written it with ' + state.fn + '; both are valid.)</span>' : '');
          sliderBox.style.display = ''; switches.style.visibility = '';
        } else {
          msg.innerHTML = '<span class="bad">Not yet.</span> Your equation is drawn dashed so you can compare it to the mystery graph. Check: does the dashed graph have the right period? right axis? right starting point?';
        }
        refresh();
      });
      giveUp.addEventListener('click', () => {
        state.challenge.revealed = true;
        sliderBox.style.display = ''; switches.style.visibility = '';
        msg.innerHTML = '<span class="muted">Revealed. Study how each parameter shows up in the graph, then try another.</span>';
        refresh();
      });
      again.addEventListener('click', startChallenge);
    }

    return { graph, state, refresh };
  }

  function criticalPoints(fn, A, B, C, D, mode, P, hideLabels) {
    const k = TRIG[fn].kind;
    const pts = [];
    const u = v => mode === 'deg' ? M.fmt(v) + '°' : M.formatPi(v, 24);
    const lab = (x, y) => hideLabels ? '' : '(' + u(x) + ', ' + M.fmt(y, 2) + ')';
    if (k === 'sinusoid') {
      const seq = fn === 'cos' ? [1, 0, -1, 0, 1] : [0, 1, 0, -1, 0];
      for (let i = 0; i <= 4; i++) {
        const x = D + P * i / 4, y = C + A * seq[i];
        pts.push({ x, y, label: lab(x, y), hollow: seq[i] === 0 });
      }
    } else if (k === 'tan') {
      const seq = fn === 'tan' ? [[0, 0], [0.25, 1]] : [[0.25, 1], [0.5, 0]];
      // one period's worth of points starting at D
      const base = fn === 'tan' ? [[-0.25, -1], [0, 0], [0.25, 1]] : [[0.25, 1], [0.5, 0], [0.75, -1]];
      base.forEach(([t, v]) => { const x = D + P * t, y = C + A * v; pts.push({ x, y, label: lab(x, y), hollow: v === 0 }); });
    } else {
      // sec/csc: local extrema at parent's max/min
      const seq = fn === 'sec' ? [[0, 1], [0.5, -1], [1, 1]] : [[0.25, 1], [0.75, -1]];
      seq.forEach(([t, v]) => { const x = D + P * t, y = C + A * v; pts.push({ x, y, label: lab(x, y) }); });
    }
    return pts;
  }

  // ---------- Unit circle ----------
  function unitCircle(container, cfg) {
    cfg = Object.assign({ snap: 15, showValues: true, startDeg: 30 }, cfg);
    const root = el('div', { class: 'explorer unit-circle' });
    container.appendChild(root);
    const row = el('div', { class: 'uc-row' });
    root.appendChild(row);
    const cv = el('canvas', { class: 'uc-canvas', width: 340, height: 340, role: 'img', 'aria-label': 'Unit circle' });
    row.appendChild(cv);
    const side = el('div', { class: 'uc-side' });
    row.appendChild(side);

    const state = { deg: cfg.startDeg, snap: cfg.snap, show: cfg.showValues, exact: true };
    const ctrl = el('div', { class: 'toggles' });
    Graph.segmented(ctrl, [{ label: 'snap 15°', value: 15 }, { label: 'snap 30°/45°', value: 'nice' }, { label: 'free', value: 0 }], 15, v => { state.snap = v; });
    Graph.toggle(ctrl, 'Hide values (self-test)', !cfg.showValues, v => { state.show = !v; draw(); });
    const inputRow = el('div', { class: 'uc-input' });
    const inp = el('input', { class: 'input input-sm', placeholder: 'angle, e.g. 210 or 7pi/6' });
    const go = el('button', { class: 'btn btn-ghost btn-sm', text: 'Go' });
    inputRow.appendChild(inp); inputRow.appendChild(go);
    function applyInput() {
      const s = inp.value.trim();
      if (!s) return;
      let d = /pi|π/i.test(s) ? M.radToDeg(M.parsePi(s)) : M.parseDMS(s);
      if (isNaN(d)) return;
      state.deg = d; draw();
    }
    go.addEventListener('click', applyInput);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') applyInput(); });
    side.appendChild(ctrl);
    side.appendChild(inputRow);
    const readout = el('div', { class: 'uc-readout' });
    side.appendChild(readout);
    const revealBtn = el('button', { class: 'btn btn-ghost btn-sm', text: 'Reveal values' });
    revealBtn.addEventListener('click', () => { state.peek = true; draw(); });
    side.appendChild(revealBtn);

    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    cv.width = 340 * dpr; cv.height = 340 * dpr; cv.style.width = '340px'; cv.style.height = '340px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cx = 170, cy = 170, Rr = 130;

    function snapDeg(d) {
      if (state.snap === 15) return Math.round(d / 15) * 15;
      if (state.snap === 'nice') {
        const cands = [];
        for (let a = 0; a < 360; a += 30) cands.push(a);
        for (let a = 45; a < 360; a += 90) cands.push(a);
        const n = M.normalizeDeg(d);
        let best = cands[0];
        cands.forEach(c => { if (Math.abs(c - n) < Math.abs(best - n)) best = c; });
        return best;
      }
      return Math.round(d * 10) / 10;
    }

    function draw() {
      const P = {
        bg: getComputedStyle(root).getPropertyValue('--graph-bg').trim() || '#fff',
        grid: getComputedStyle(root).getPropertyValue('--graph-grid').trim() || '#e5e5ee',
        axis: getComputedStyle(root).getPropertyValue('--graph-axis').trim() || '#555',
        text: getComputedStyle(root).getPropertyValue('--graph-text').trim() || '#555',
        accent: getComputedStyle(root).getPropertyValue('--accent').trim() || '#2563eb',
        accent2: getComputedStyle(root).getPropertyValue('--accent-2').trim() || '#d97706',
        accent3: getComputedStyle(root).getPropertyValue('--accent-3').trim() || '#059669'
      };
      ctx.clearRect(0, 0, 340, 340);
      ctx.fillStyle = P.bg; ctx.fillRect(0, 0, 340, 340);
      // axes
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(10, cy); ctx.lineTo(330, cy); ctx.moveTo(cx, 10); ctx.lineTo(cx, 330); ctx.stroke();
      // tick marks every 30/45
      ctx.strokeStyle = P.grid;
      for (let a = 0; a < 360; a += 15) {
        const r = a % 45 === 0 || a % 30 === 0 ? 8 : 4;
        const t = M.degToRad(a);
        ctx.beginPath(); ctx.moveTo(cx + (Rr - r) * Math.cos(t), cy - (Rr - r) * Math.sin(t)); ctx.lineTo(cx + Rr * Math.cos(t), cy - Rr * Math.sin(t)); ctx.stroke();
      }
      // circle
      ctx.strokeStyle = P.axis; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, Rr, 0, 2 * PI); ctx.stroke();
      // angle arc
      const t = M.degToRad(state.deg);
      ctx.strokeStyle = P.accent3; ctx.lineWidth = 2.5;
      ctx.beginPath();
      // draw arc from 0 to θ (handles >360 by drawing full circle + remainder visually simple)
      const turns = Math.trunc(state.deg / 360);
      const rem = state.deg - turns * 360;
      ctx.arc(cx, cy, 34 + Math.min(Math.abs(turns), 3) * 6, 0, -M.degToRad(rem), rem > 0 ? true : false);
      ctx.stroke();
      // terminal ray
      const X = cx + Rr * Math.cos(t), Y = cy - Rr * Math.sin(t);
      ctx.strokeStyle = P.accent; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(X, Y); ctx.stroke();
      // projections
      ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.strokeStyle = P.accent2;
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X, cy); ctx.stroke();
      ctx.strokeStyle = P.accent3;
      ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(cx, Y); ctx.stroke();
      ctx.setLineDash([]);
      // point
      ctx.fillStyle = P.accent; ctx.beginPath(); ctx.arc(X, Y, 6, 0, 2 * PI); ctx.fill();
      // labels
      ctx.fillStyle = P.text; ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText('1', cx + Rr + 4, cy - 2); ctx.fillText('−1', 4, cy - 2);
      ctx.fillText('1', cx + 4, cy - Rr - 2); ctx.fillText('−1', cx + 4, cy + Rr + 14);
      const show = state.show || state.peek;
      if (show) {
        ctx.fillStyle = P.accent3; ctx.textAlign = 'center'; ctx.textBaseline = Y < cy ? 'top' : 'bottom';
        ctx.fillText('cos θ = ' + M.formatExact(Math.cos(t)), (cx + X) / 2, Y < cy ? Y + 6 : Y - 6);
        ctx.fillStyle = P.accent2; ctx.textAlign = X < cx ? 'right' : 'left'; ctx.textBaseline = 'middle';
        ctx.fillText('sin θ = ' + M.formatExact(Math.sin(t)), X < cx ? X - 6 : X + 6, (cy + Y) / 2);
        ctx.fillStyle = P.text; ctx.textAlign = X < cx ? 'right' : 'left'; ctx.textBaseline = Y < cy ? 'bottom' : 'top';
        ctx.fillText('(' + M.formatExact(Math.cos(t)) + ', ' + M.formatExact(Math.sin(t)) + ')', X + (X < cx ? -8 : 8), Y + (Y < cy ? -8 : 8));
      }
      const rad = M.degToRad(state.deg);
      const nice = M.asPiFraction(rad, 12);
      const ref = M.referenceAngle(state.deg);
      const q = M.quadrant(state.deg);
      const vals = show ? [
        ['θ (degrees)', M.fmt(state.deg, 2) + '°'],
        ['θ (deg · min)', M.formatDMS(state.deg)],
        ['θ (radians)', (nice ? M.formatPi(rad, 12) + ' ≈ ' : '') + M.fmt(rad, 4)],
        ['Quadrant', q === 0 ? 'on an axis' : 'Q' + q],
        ['Reference angle', M.fmt(ref, 2) + '° = ' + M.formatPi(M.degToRad(ref), 12)],
        ['cos θ', M.formatExact(Math.cos(rad)) + (M.formatExact(Math.cos(rad)).includes('√') ? ' ≈ ' + M.fmt(Math.cos(rad), 4) : '')],
        ['sin θ', M.formatExact(Math.sin(rad)) + (M.formatExact(Math.sin(rad)).includes('√') ? ' ≈ ' + M.fmt(Math.sin(rad), 4) : '')],
        ['Arc length (r = 1)', M.fmt(Math.abs(rad), 4) + ' units']
      ] : [
        ['θ (degrees)', M.fmt(state.deg, 2) + '°'],
        ['Everything else', 'hidden — work it out, then reveal']
      ];
      readout.innerHTML = vals.map(v => '<div class="info-row"><span>' + v[0] + '</span><strong>' + v[1] + '</strong></div>').join('');
      revealBtn.style.display = state.show ? 'none' : '';
    }

    let dragging = false;
    function setFromEvent(e) {
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      let d = M.radToDeg(Math.atan2(cy - my, mx - cx));
      if (d < 0) d += 360;
      state.deg = snapDeg(d); state.peek = false; draw();
    }
    cv.addEventListener('mousedown', e => { dragging = true; setFromEvent(e); });
    window.addEventListener('mousemove', e => { if (dragging) setFromEvent(e); });
    window.addEventListener('mouseup', () => { dragging = false; });
    cv.addEventListener('touchstart', e => { dragging = true; setFromEvent(e.touches[0]); e.preventDefault(); }, { passive: false });
    cv.addEventListener('touchmove', e => { if (dragging) { setFromEvent(e.touches[0]); e.preventDefault(); } }, { passive: false });
    cv.addEventListener('touchend', () => { dragging = false; });
    draw();
    return { state, draw };
  }

  // ---------- Inverse function explorer ----------
  function inverse(container, cfg) {
    cfg = Object.assign({ fn: 'sin', mode: 'rad', relation: false }, cfg);
    const state = { fn: cfg.fn, mode: cfg.mode, relation: cfg.relation, reflect: true };
    const root = el('div', { class: 'explorer' });
    container.appendChild(root);
    const top = el('div', { class: 'explorer-top' });
    const eq = el('div', { class: 'equation' });
    const sw = el('div', { class: 'explorer-switches' });
    top.appendChild(eq); top.appendChild(sw);
    root.appendChild(top);
    Graph.segmented(sw, [{ label: 'sin', value: 'sin' }, { label: 'cos', value: 'cos' }], state.fn, v => { state.fn = v; refresh(); });
    Graph.segmented(sw, [{ label: 'radians (reflection view)', value: 'rad' }, { label: 'degrees', value: 'deg' }], state.mode, v => { state.mode = v; setup(); });
    const box = el('div'); root.appendChild(box);
    const toggles = el('div', { class: 'toggles' }); root.appendChild(toggles);
    Graph.toggle(toggles, 'Show the <em>whole</em> inverse relation (all branches)', state.relation, v => { state.relation = v; refresh(); });
    const reflectT = Graph.toggle(toggles, 'Show y = x and the original function', true, v => { state.reflect = v; refresh(); });
    const info = el('div', { class: 'explorer-info' }); root.appendChild(info);

    let graph = null;
    function setup() {
      if (graph) graph.destroy();
      if (state.mode === 'rad') {
        graph = new Graph(box, { xMin: -2 * PI, xMax: 2 * PI, yMin: -2 * PI, yMax: 2 * PI, xUnit: 'rad', yUnit: 'rad', xStep: PI / 2, yStep: PI / 2, height: 420, interactive: false, home: [-2 * PI, 2 * PI, -2 * PI, 2 * PI] });
      } else {
        graph = new Graph(box, { xMin: -1.6, xMax: 1.6, yMin: -400, yMax: 400, xUnit: 'num', yUnit: 'deg', xStep: 0.5, yStep: 90, height: 420, interactive: false, margin: { l: 56, r: 14, t: 14, b: 30 } });
      }
      reflectT.parentElement.style.display = state.mode === 'rad' ? '' : 'none';
      refresh();
    }
    function refresh() {
      const isSin = state.fn === 'sin';
      const f = isSin ? Math.sin : Math.cos;
      const finv = isSin ? Math.asin : Math.acos;
      const fns = [], points = [], hlines = [];
      const yScale = state.mode === 'deg' ? 180 / PI : 1;
      const lo = isSin ? -PI / 2 : 0, hi = isSin ? PI / 2 : PI;
      if (state.mode === 'rad' && state.reflect) {
        fns.push({ f: f, ghost: true, label: 'y = ' + state.fn + ' x' });
        fns.push({ f: x => x, ghost: true, dashed: true, label: 'y = x', hover: false });
        // restricted branch of the original, highlighted
        fns.push({ f: f, domain: [lo, hi], color: graph.palette ? graph.palette.accent3 : '#059669', width: 4, label: state.fn + ' x restricted to [' + M.formatPi(lo) + ', ' + M.formatPi(hi) + ']' });
      }
      if (state.relation) {
        fns.push({ f: t => [f(t), t * yScale], param: { t0: -2 * PI, t1: 2 * PI, n: 1200 }, color: graph.palette ? graph.palette.ghost : '#aaa', width: 2, dashed: true, label: 'relation: all y with ' + state.fn + ' y = x' });
      }
      fns.push({ f: x => finv(x) * yScale, domain: [-1, 1], width: 3.5, label: 'y = ' + state.fn + '⁻¹ x  (the function)' });
      const u = v => state.mode === 'deg' ? M.fmt(v * yScale) + '°' : M.formatPi(v, 12);
      const endpts = isSin ? [[-1, -PI / 2], [0, 0], [1, PI / 2]] : [[-1, PI], [0, PI / 2], [1, 0]];
      endpts.forEach(([x, y]) => points.push({ x, y: y * yScale, label: '(' + M.fmt(x) + ', ' + u(y) + ')', align: x > 0 ? 'right' : 'left', dx: x > 0 ? -8 : 8 }));
      if (state.mode === 'deg') { hlines.push({ y: lo * yScale, label: '' }); hlines.push({ y: hi * yScale }); }
      graph.update({ fns, points, hlines });
      eq.innerHTML = R.tex('y = ' + (isSin ? '\\sin' : '\\cos') + '^{-1} x \\quad\\Longleftrightarrow\\quad x = ' + (isSin ? '\\sin' : '\\cos') + ' y,\\; ' + (isSin ? '-\\tfrac{\\pi}{2} \\le y \\le \\tfrac{\\pi}{2}' : '0 \\le y \\le \\pi'), true);
      const rows = [
        ['Domain of ' + state.fn + '⁻¹', '−1 ≤ x ≤ 1'],
        ['Range of ' + state.fn + '⁻¹', state.mode === 'deg' ? (isSin ? '−90° ≤ y ≤ 90°' : '0° ≤ y ≤ 180°') : (isSin ? '−π/2 ≤ y ≤ π/2' : '0 ≤ y ≤ π')]
      ];
      const notes = [
        '<strong>Why that range?</strong> ' + (isSin ? 'It is the biggest piece of y = sin x around the origin that passes the horizontal-line test and still covers every output −1…1.' : 'Starting at 0 and going right, it is the first piece of y = cos x that covers every output −1…1 exactly once.'),
        '<strong>Relation vs. function.</strong> All values of ' + state.fn + '⁻¹ x (the full relation) gives infinitely many y-values for each x; the function ' + state.fn + '⁻¹ x keeps just one (the principal value).'
      ];
      info.innerHTML = rows.map(r => '<div class="info-row"><span>' + r[0] + '</span><strong>' + r[1] + '</strong></div>').join('') + notes.map(n => '<div class="info-note">' + n + '</div>').join('');
    }
    setup();
    return { state };
  }

  // ---------- Real-world sinusoidal model explorer ----------
  function model(container, cfg) {
    const scenarios = cfg.scenarios;
    const root = el('div', { class: 'explorer' });
    container.appendChild(root);
    const top = el('div', { class: 'explorer-top' });
    const eq = el('div', { class: 'equation' });
    const sw = el('div', { class: 'explorer-switches' });
    top.appendChild(eq); top.appendChild(sw); root.appendChild(top);
    const desc = el('div', { class: 'scenario-desc' }); root.appendChild(desc);
    const box = el('div'); root.appendChild(box);
    const controls = el('div', { class: 'explorer-controls' }); root.appendChild(controls);
    const probeRow = el('div', { class: 'probe' }); controls.appendChild(probeRow);
    const toggles = el('div', { class: 'toggles' }); controls.appendChild(toggles);
    const info = el('div', { class: 'explorer-info' }); root.appendChild(info);
    const state = { i: 0, showEq: false, probe: null };
    Graph.segmented(sw, scenarios.map((s, i) => ({ label: s.name, value: i })), 0, v => { state.i = v; state.probe = null; setup(); });
    Graph.toggle(toggles, 'Show the equation & parameters', false, v => { state.showEq = v; refresh(); });
    const probeIn = el('input', { class: 'input input-sm', placeholder: 'x value' });
    const probeBtn = el('button', { class: 'btn btn-ghost btn-sm', text: 'Evaluate' });
    probeRow.appendChild(el('span', { class: 'muted', text: 'Probe: ' })); probeRow.appendChild(probeIn); probeRow.appendChild(probeBtn);
    probeBtn.addEventListener('click', () => { const v = M.parseFraction(probeIn.value); if (!isNaN(v)) { state.probe = v; refresh(); } });
    probeIn.addEventListener('keydown', e => { if (e.key === 'Enter') probeBtn.click(); });

    let graph = null;
    function setup() {
      const s = scenarios[state.i];
      if (graph) graph.destroy();
      graph = new Graph(box, { xMin: s.xMin, xMax: s.xMax, yMin: s.yMin, yMax: s.yMax, xUnit: 'num', xStep: s.xStep, yStep: s.yStep, xLabel: s.xLabel, yLabel: s.yLabel, height: 340, home: [s.xMin, s.xMax, s.yMin, s.yMax] });
      desc.innerHTML = R.md(s.description);
      refresh();
    }
    function refresh() {
      const s = scenarios[state.i];
      const f = makeFn(s.fn, s.A, s.B, s.C, s.D, 'num');
      const P = 2 * PI / s.B;
      const fns = [{ f }];
      const hlines = [{ y: s.C, label: 'axis' }];
      const points = [];
      const brackets = [{ type: 'h', x1: s.D, x2: s.D + P, y: s.C - Math.abs(s.A) - (s.yMax - s.yMin) * 0.14, label: 'period = ' + M.fmt(P, 3) + ' ' + (s.xUnitName || '') }];
      // high/low
      const hi = s.fn === 'cos' ? (s.A > 0 ? s.D : s.D + P / 2) : (s.A > 0 ? s.D + P / 4 : s.D + 3 * P / 4);
      points.push({ x: hi, y: s.C + Math.abs(s.A), label: 'max ' + M.fmt(s.C + Math.abs(s.A), 2) + ' at ' + M.fmt(hi, 2) });
      points.push({ x: hi + P / 2, y: s.C - Math.abs(s.A), label: 'min ' + M.fmt(s.C - Math.abs(s.A), 2) + ' at ' + M.fmt(hi + P / 2, 2), dy: 16 });
      if (state.probe !== null) {
        const y = f(state.probe);
        points.push({ x: state.probe, y, color: graph.palette ? graph.palette.accent3 : '#059669', label: '(' + M.fmt(state.probe, 2) + ', ' + M.fmt(y, 3) + ')' });
      }
      graph.update({ fns, hlines, points, brackets });
      if (state.showEq) {
        eq.innerHTML = R.tex(texEquation(s.fn, s.A, s.B, s.C, s.D, 'num').replace(/^y/, s.yVar || 'y').replace(/x/g, s.xVar || 'x'), true);
        info.innerHTML = [
          ['A (amplitude)', M.fmt(s.A, 3) + ' — half the distance from max to min'],
          ['B', M.fmt(s.B, 4) + ' = 2π ÷ ' + M.fmt(P, 3)],
          ['C (axis)', M.fmt(s.C, 3) + ' — average of max and min'],
          ['D (phase displacement)', M.fmt(s.D, 3) + ' — where a ' + s.fn + ' cycle starts']
        ].map(r => '<div class="info-row"><span>' + r[0] + '</span><strong>' + r[1] + '</strong></div>').join('');
      } else {
        eq.innerHTML = '<span class="muted">Equation hidden. Read max, min, period, and a starting point off the graph; write the equation; then reveal to check.</span>';
        info.innerHTML = '';
      }
    }
    setup();
    return { state };
  }

  // Dispatcher used by app.js
  const Explore = {
    trig, unitCircle, inverse, model,
    custom(container, cfg) { return cfg.setup(container, { Graph, M, R, Explore }); },
    render(container, cfg) {
      container.innerHTML = '';
      if (!cfg) { container.appendChild(el('p', { class: 'muted', text: 'No interactive explorer for this topic.' })); return; }
      if (cfg.intro) container.appendChild(el('div', { class: 'explore-intro', html: R.md(cfg.intro) }));
      const fn = Explore[cfg.type];
      if (!fn) { container.appendChild(el('p', { class: 'bad', text: 'Unknown explorer type: ' + cfg.type })); return; }
      try { fn(container, cfg); } catch (e) { console.error(e); container.appendChild(el('p', { class: 'bad', text: 'Explorer failed to load: ' + e.message })); }
      if (cfg.tasks) {
        const t = el('div', { class: 'explore-tasks' });
        t.appendChild(el('h4', { text: 'Try this' }));
        t.appendChild(el('div', { html: R.md(cfg.tasks) }));
        container.appendChild(t);
      }
    },
    TRIG, makeFn, periodOf, asymptotesOf, texEquation, sameGraph, criticalPoints
  };
  window.Explore = Explore;
})();
