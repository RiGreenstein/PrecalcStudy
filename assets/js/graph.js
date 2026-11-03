/* Canvas graphing engine: functions, asymptotes, degree/radian axes, key points, hover readout. */
(function () {
  const PI = Math.PI;

  function cssVar(elm, name, fallback) {
    const v = getComputedStyle(elm).getPropertyValue(name).trim();
    return v || fallback;
  }

  class Graph {
    constructor(container, opts) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      this.opts = Object.assign({
        xMin: -2 * PI, xMax: 2 * PI, yMin: -3, yMax: 3,
        xUnit: 'rad', xStep: null, yStep: 1,
        xLabel: '', yLabel: '',
        height: 320,
        fns: [], points: [], hlines: [], vlines: [], brackets: [], labels: [],
        hover: true, interactive: true,
        margin: { l: 46, r: 14, t: 14, b: 30 }
      }, opts || {});
      if (!this.opts.xStep) this.opts.xStep = this.opts.xUnit === 'deg' ? 90 : this.opts.xUnit === 'rad' ? PI / 2 : 1;

      this.wrap = document.createElement('div');
      this.wrap.className = 'graph';
      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute('role', 'img');
      this.canvas.setAttribute('aria-label', this.opts.ariaLabel || 'Graph');
      this.wrap.appendChild(this.canvas);
      this.tip = document.createElement('div');
      this.tip.className = 'graph-tip';
      this.tip.style.display = 'none';
      this.wrap.appendChild(this.tip);
      this.container.appendChild(this.wrap);
      this.ctx = this.canvas.getContext('2d');

      this._bind();
      this.resize();
      if (window.ResizeObserver) {
        this._ro = new ResizeObserver(() => this.resize());
        this._ro.observe(this.wrap);
      }
    }

    update(partial) { Object.assign(this.opts, partial); this.draw(); return this; }
    setView(xMin, xMax, yMin, yMax) {
      Object.assign(this.opts, { xMin, xMax, yMin, yMax });
      this.draw();
    }

    resize() {
      const w = this.wrap.clientWidth || 600;
      const h = this.opts.height;
      const dpr = window.devicePixelRatio || 1;
      this.W = w; this.H = h;
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.canvas.style.width = w + 'px';
      this.canvas.style.height = h + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.draw();
    }

    // coordinate transforms
    px(x) { const m = this.opts.margin; return m.l + (x - this.opts.xMin) / (this.opts.xMax - this.opts.xMin) * (this.W - m.l - m.r); }
    py(y) { const m = this.opts.margin; return this.H - m.b - (y - this.opts.yMin) / (this.opts.yMax - this.opts.yMin) * (this.H - m.t - m.b); }
    xAt(px) { const m = this.opts.margin; return this.opts.xMin + (px - m.l) / (this.W - m.l - m.r) * (this.opts.xMax - this.opts.xMin); }
    yAt(py) { const m = this.opts.margin; return this.opts.yMin + (this.H - m.b - py) / (this.H - m.t - m.b) * (this.opts.yMax - this.opts.yMin); }

    fmtX(x) { return this._fmtUnit(x, this.opts.xUnit); }
    fmtY(y) { return this._fmtUnit(y, this.opts.yUnit); }
    _fmtUnit(v, u) {
      if (u === 'deg') return M.fmt(v, 2) + '°';
      if (u === 'rad') return M.formatPi(v, 24);
      return M.fmt(v, 3);
    }

    draw() {
      const ctx = this.ctx, o = this.opts, m = o.margin;
      const W = this.W, H = this.H;
      const C = {
        bg: cssVar(this.wrap, '--graph-bg', '#ffffff'),
        grid: cssVar(this.wrap, '--graph-grid', '#e8e8ee'),
        axis: cssVar(this.wrap, '--graph-axis', '#4a4a5a'),
        text: cssVar(this.wrap, '--graph-text', '#555'),
        accent: cssVar(this.wrap, '--accent', '#2563eb'),
        accent2: cssVar(this.wrap, '--accent-2', '#d97706'),
        accent3: cssVar(this.wrap, '--accent-3', '#059669'),
        ghost: cssVar(this.wrap, '--graph-ghost', '#b8b8c8')
      };
      this.palette = C;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = C.bg;
      ctx.fillRect(0, 0, W, H);

      // plot area clip
      const plotW = W - m.l - m.r, plotH = H - m.t - m.b;
      if (plotW <= 0 || plotH <= 0) return;

      ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      ctx.textBaseline = 'top';

      // grid + x ticks
      ctx.lineWidth = 1;
      const xs = o.xStep, ys = o.yStep;
      const x0 = Math.ceil(o.xMin / xs - 1e-9) * xs;
      ctx.strokeStyle = C.grid;
      ctx.fillStyle = C.text;
      ctx.textAlign = 'center';
      for (let x = x0; x <= o.xMax + 1e-9; x += xs) {
        const X = this.px(x);
        ctx.beginPath(); ctx.moveTo(X, m.t); ctx.lineTo(X, H - m.b); ctx.stroke();
        if (Math.abs(x) > 1e-9 || o.yMin > 0 || o.yMax < 0) {
          ctx.fillText(this.fmtX(x), X, H - m.b + 6);
        }
      }
      const y0 = Math.ceil(o.yMin / ys - 1e-9) * ys;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (let y = y0; y <= o.yMax + 1e-9; y += ys) {
        const Y = this.py(y);
        ctx.beginPath(); ctx.moveTo(m.l, Y); ctx.lineTo(W - m.r, Y); ctx.stroke();
        if (Math.abs(y) > 1e-9) ctx.fillText(this.fmtY(y), m.l - 6, Y);
      }

      // axes
      ctx.strokeStyle = C.axis; ctx.lineWidth = 1.5;
      if (o.yMin <= 0 && o.yMax >= 0) { const Y = this.py(0); ctx.beginPath(); ctx.moveTo(m.l, Y); ctx.lineTo(W - m.r, Y); ctx.stroke(); }
      if (o.xMin <= 0 && o.xMax >= 0) { const X = this.px(0); ctx.beginPath(); ctx.moveTo(X, m.t); ctx.lineTo(X, H - m.b); ctx.stroke(); }
      // origin label
      if (o.xMin < 0 && o.xMax > 0 && o.yMin < 0 && o.yMax > 0) {
        ctx.fillStyle = C.text; ctx.textAlign = 'right'; ctx.textBaseline = 'top';
        ctx.fillText('0', this.px(0) - 4, this.py(0) + 4);
      }
      // axis labels
      ctx.fillStyle = C.text;
      if (o.xLabel) { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; ctx.fillText(o.xLabel, W - m.r, H - 2); }
      if (o.yLabel) { ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(o.yLabel, m.l + 6, m.t); }

      ctx.save();
      ctx.beginPath(); ctx.rect(m.l, m.t, plotW, plotH); ctx.clip();

      // horizontal / vertical reference lines
      (o.hlines || []).forEach(h => this._line(this.px(o.xMin), this.py(h.y), this.px(o.xMax), this.py(h.y), h.color || C.accent2, h.dashed !== false, h.width || 1.25));
      (o.vlines || []).forEach(v => this._line(this.px(v.x), m.t, this.px(v.x), H - m.b, v.color || C.accent2, v.dashed !== false, v.width || 1.25));

      // functions
      (o.fns || []).forEach(fn => {
        if (fn.hidden) return;
        const color = fn.ghost ? C.ghost : (fn.color || C.accent);
        // asymptotes
        let asy = fn.asymptotes;
        if (typeof asy === 'function') asy = asy(o.xMin, o.xMax);
        if (asy && fn.showAsymptotes !== false) asy.forEach(x => this._line(this.px(x), m.t, this.px(x), H - m.b, color, true, 1, 0.55));
        this._plot(fn, color);
      });

      // brackets (amplitude / period annotations)
      (o.brackets || []).forEach(b => this._bracket(b, C));

      // points
      (o.points || []).forEach(p => {
        const X = this.px(p.x), Y = this.py(p.y);
        ctx.beginPath(); ctx.arc(X, Y, p.r || 4.5, 0, 2 * PI);
        ctx.fillStyle = p.hollow ? C.bg : (p.color || C.accent2);
        ctx.fill();
        ctx.lineWidth = 2; ctx.strokeStyle = p.color || C.accent2; ctx.stroke();
        if (p.label) {
          ctx.fillStyle = C.text; ctx.font = '12px system-ui, sans-serif';
          ctx.textAlign = p.align || 'left'; ctx.textBaseline = 'bottom';
          ctx.fillText(p.label, X + (p.dx === undefined ? 7 : p.dx), Y + (p.dy === undefined ? -6 : p.dy));
        }
      });

      // free text labels
      (o.labels || []).forEach(l => {
        ctx.fillStyle = l.color || C.text; ctx.font = (l.size || 12) + 'px system-ui, sans-serif';
        ctx.textAlign = l.align || 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(l.text, this.px(l.x) + (l.dx || 0), this.py(l.y) + (l.dy || 0));
      });

      ctx.restore();

      // legend
      const leg = (o.fns || []).filter(f => f.label && !f.hidden);
      if (leg.length) {
        ctx.font = '12px system-ui, sans-serif'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        let lx = m.l + 10, ly = m.t + 10;
        leg.forEach(f => {
          const color = f.ghost ? C.ghost : (f.color || C.accent);
          ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.setLineDash(f.dashed ? [6, 4] : []);
          ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 22, ly); ctx.stroke(); ctx.setLineDash([]);
          ctx.fillStyle = C.text; ctx.fillText(f.label, lx + 28, ly);
          ly += 18;
        });
      }
    }

    _line(x1, y1, x2, y2, color, dashed, width, alpha) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = alpha === undefined ? 1 : alpha;
      ctx.strokeStyle = color; ctx.lineWidth = width || 1.25;
      ctx.setLineDash(dashed ? [6, 5] : []);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.restore();
    }

    _plot(fn, color) {
      const ctx = this.ctx, o = this.opts;
      if (fn.param) return this._plotParam(fn, color);
      const f = fn.f;
      const N = Math.max(300, Math.floor(this.W * 1.5));
      const yRange = o.yMax - o.yMin;
      const clipY = yRange * 4;
      const dx = (o.xMax - o.xMin) / N;
      const domain = fn.domain || [-Infinity, Infinity];
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = fn.ghost ? 2 : (fn.width || 2.5);
      ctx.setLineDash(fn.dashed ? [7, 5] : []);
      ctx.lineJoin = 'round';
      ctx.beginPath();
      let prevY = null, pen = false;
      const xs = [];
      for (let i = 0; i <= N; i++) xs.push(o.xMin + i * dx);
      // include exact domain endpoints so steep curves (e.g. arcsin at ±1) reach their endpoints
      [domain[0], domain[1]].concat(fn.extraX || []).forEach(v => { if (isFinite(v) && v >= o.xMin && v <= o.xMax) xs.push(v); });
      xs.sort((a, b) => a - b);
      for (const x of xs) {
        if (x < domain[0] - 1e-9 || x > domain[1] + 1e-9) { pen = false; prevY = null; continue; }
        let y = f(x);
        if (!isFinite(y) || isNaN(y)) { pen = false; prevY = null; continue; }
        // discontinuity detection: huge jump with sign change
        if (prevY !== null && Math.abs(y - prevY) > yRange * 2 && (y > 0) !== (prevY > 0)) { pen = false; }
        const yc = Math.max(o.yMin - clipY, Math.min(o.yMax + clipY, y));
        const X = this.px(x), Y = this.py(yc);
        if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
        prevY = y;
      }
      ctx.stroke();
      ctx.restore();
    }

    // Parametric curve: fn.param = {t0, t1}, fn.f(t) → [x, y]
    _plotParam(fn, color) {
      const ctx = this.ctx;
      const { t0, t1 } = fn.param;
      const N = fn.param.n || 800;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = fn.ghost ? 2 : (fn.width || 2.5);
      ctx.setLineDash(fn.dashed ? [7, 5] : []);
      ctx.beginPath();
      let pen = false;
      for (let i = 0; i <= N; i++) {
        const t = t0 + (t1 - t0) * i / N;
        const p = fn.f(t);
        if (!p || !isFinite(p[0]) || !isFinite(p[1])) { pen = false; continue; }
        const X = this.px(p[0]), Y = this.py(p[1]);
        if (!pen) { ctx.moveTo(X, Y); pen = true; } else ctx.lineTo(X, Y);
      }
      ctx.stroke();
      ctx.restore();
    }

    _bracket(b, C) {
      const ctx = this.ctx;
      const color = b.color || C.accent3;
      ctx.save();
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.5;
      ctx.font = '12px system-ui, sans-serif';
      if (b.type === 'h') {
        const X1 = this.px(b.x1), X2 = this.px(b.x2), Y = this.py(b.y);
        ctx.beginPath(); ctx.moveTo(X1, Y); ctx.lineTo(X2, Y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X1, Y - 5); ctx.lineTo(X1, Y + 5); ctx.moveTo(X2, Y - 5); ctx.lineTo(X2, Y + 5); ctx.stroke();
        if (b.label) { ctx.textAlign = 'center'; ctx.textBaseline = b.below ? 'top' : 'bottom'; ctx.fillText(b.label, (X1 + X2) / 2, Y + (b.below ? 6 : -6)); }
      } else {
        const X = this.px(b.x), Y1 = this.py(b.y1), Y2 = this.py(b.y2);
        ctx.beginPath(); ctx.moveTo(X, Y1); ctx.lineTo(X, Y2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(X - 5, Y1); ctx.lineTo(X + 5, Y1); ctx.moveTo(X - 5, Y2); ctx.lineTo(X + 5, Y2); ctx.stroke();
        if (b.label) { ctx.textAlign = b.left ? 'right' : 'left'; ctx.textBaseline = 'middle'; ctx.fillText(b.label, X + (b.left ? -8 : 8), (Y1 + Y2) / 2); }
      }
      ctx.restore();
    }

    _bind() {
      const cv = this.canvas;
      let drag = null;
      cv.addEventListener('mousemove', e => {
        const r = cv.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        if (drag && this.opts.interactive) {
          const dxv = this.xAt(drag.x) - this.xAt(mx);
          const dyv = this.yAt(drag.y) - this.yAt(my);
          this.opts.xMin += dxv; this.opts.xMax += dxv; this.opts.yMin += dyv; this.opts.yMax += dyv;
          drag = { x: mx, y: my };
          this.draw();
          if (this.opts.onView) this.opts.onView(this.opts);
          return;
        }
        if (!this.opts.hover) return;
        this._hover(mx, my);
      });
      cv.addEventListener('mouseleave', () => { this.tip.style.display = 'none'; drag = null; });
      cv.addEventListener('mousedown', e => { if (this.opts.interactive) { const r = cv.getBoundingClientRect(); drag = { x: e.clientX - r.left, y: e.clientY - r.top }; cv.style.cursor = 'grabbing'; } });
      window.addEventListener('mouseup', () => { drag = null; cv.style.cursor = ''; });
      cv.addEventListener('wheel', e => {
        if (!this.opts.interactive) return;
        e.preventDefault();
        const r = cv.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const cx = this.xAt(mx);
        const k = e.deltaY > 0 ? 1.15 : 1 / 1.15;
        const o = this.opts;
        o.xMin = cx + (o.xMin - cx) * k; o.xMax = cx + (o.xMax - cx) * k;
        this.draw();
        if (this.opts.onView) this.opts.onView(this.opts);
      }, { passive: false });
      cv.addEventListener('dblclick', () => { if (this.opts.home) { this.setView.apply(this, this.opts.home); } });
    }

    _hover(mx, my) {
      const o = this.opts, m = o.margin;
      if (mx < m.l || mx > this.W - m.r || my < m.t || my > this.H - m.b) { this.tip.style.display = 'none'; return; }
      const x = this.xAt(mx);
      const fns = (o.fns || []).filter(f => !f.hidden && !f.ghost && f.hover !== false && !f.param);
      let best = null;
      fns.forEach(f => {
        if (f.domain && (x < f.domain[0] || x > f.domain[1])) return;
        const y = f.f(x);
        if (!isFinite(y)) return;
        const d = Math.abs(this.py(y) - my);
        if (!best || d < best.d) best = { f, y, d };
      });
      if (!best || best.d > 40) { this.tip.style.display = 'none'; return; }
      const yText = o.yUnit === 'rad' ? M.formatPi(best.y, 24) : M.fmt(best.y, 3);
      this.tip.textContent = (best.f.label ? best.f.label + '  ' : '') + '(' + this.fmtX(x) + ', ' + yText + ')';
      this.tip.style.display = 'block';
      this.tip.style.left = Math.min(mx + 12, this.W - 160) + 'px';
      this.tip.style.top = Math.max(my - 30, 4) + 'px';
    }

    destroy() { if (this._ro) this._ro.disconnect(); this.wrap.remove(); }
  }

  // ---- UI controls used by explorers ----
  function slider(container, cfg) {
    const row = R.el('label', { class: 'slider' });
    const name = R.el('span', { class: 'slider-name', html: cfg.label });
    const val = R.el('span', { class: 'slider-val' });
    const input = R.el('input', { type: 'range', min: cfg.min, max: cfg.max, step: cfg.step, value: cfg.value });
    const format = cfg.format || (v => M.fmt(v, 2));
    val.textContent = format(+cfg.value);
    input.addEventListener('input', () => { val.textContent = format(+input.value); cfg.onInput(+input.value); });
    row.appendChild(name); row.appendChild(input); row.appendChild(val);
    container.appendChild(row);
    return {
      row, input,
      get: () => +input.value,
      set: v => { input.value = v; val.textContent = format(+v); },
      setRange: (min, max, step) => { input.min = min; input.max = max; if (step) input.step = step; }
    };
  }

  function toggle(container, label, checked, onChange) {
    const l = R.el('label', { class: 'toggle' });
    const cb = R.el('input', { type: 'checkbox' });
    cb.checked = !!checked;
    cb.addEventListener('change', () => onChange(cb.checked));
    l.appendChild(cb); l.appendChild(R.el('span', { html: label }));
    container.appendChild(l);
    return cb;
  }

  function segmented(container, options, value, onChange) {
    const wrap = R.el('div', { class: 'segmented', role: 'group' });
    const btns = options.map(opt => {
      const b = R.el('button', { class: 'seg' + (opt.value === value ? ' active' : ''), html: opt.label, type: 'button' });
      b.addEventListener('click', () => { btns.forEach(x => x.classList.remove('active')); b.classList.add('active'); onChange(opt.value); });
      wrap.appendChild(b); return b;
    });
    container.appendChild(wrap);
    return { set: v => btns.forEach((b, i) => b.classList.toggle('active', options[i].value === v)) };
  }

  Graph.slider = slider; Graph.toggle = toggle; Graph.segmented = segmented;
  window.Graph = Graph;
})();
