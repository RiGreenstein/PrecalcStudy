/* Practice test / cumulative review: mixed questions across units & sections, optional timer, graded at the end. */
(function () {
  const el = R.el;
  let units = [];          // loaded unit objects, in registry order
  let main;

  const isSketchGen = g => /^sketch/.test(g.name || '');
  const fmtTime = ms => { const s = Math.max(0, Math.round(ms / 1000)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const findTopic = (unitId, topicId) => { const u = units.find(x => x.id === unitId); return u && u.topics.find(t => t.id === topicId); };

  async function init() {
    main = document.getElementById('main');
    main.innerHTML = '<p class="muted">Loading…</p>';
    for (const entry of window.UNITS) {
      try { units.push(await App.loadUnit(entry)); } catch (e) { console.error(e); }
    }
    const active = Store.getActiveTest();
    const valid = active && active.specs && active.specs.every(s => findTopic(s.unitId, s.topicId) && (!s.challenge || challengeQ(s)));
    const ch = new URLSearchParams(location.search).get('challenge');
    if (valid) resumePrompt(active);
    else if (ch) { const [uid, cid] = ch.split('/'); startChallenge(uid, cid); }
    else setup();
  }

  // ---- fixed challenge sets: unit.challenges = [{ id, title, minutes, description, questions: [{ topicId, gen }] }] ----
  function challengeQ(s) {
    const u = units.find(x => x.id === s.unitId);
    const c = u && (u.challenges || []).find(x => x.id === s.challenge);
    return c && c.questions[s.qi];
  }
  function startChallenge(unitId, chId) {
    const u = units.find(x => x.id === unitId), c = u && (u.challenges || []).find(x => x.id === chId);
    if (!c) { setup(); return; }
    const now = Date.now();
    const t = {
      specs: c.questions.map((q, i) => ({ unitId, topicId: q.topicId, challenge: c.id, qi: i, seed: 1 })),
      answers: {}, flags: {}, idx: 0, startedAt: now, endsAt: c.minutes ? now + c.minutes * 60000 : null,
      settings: { challenge: unitId + '/' + c.id }, label: c.title
    };
    Store.saveActiveTest(t);
    run(t);
  }
  function challengeList() {
    const all = [];
    units.forEach(u => (u.challenges || []).forEach(c => all.push({ u, c })));
    if (!all.length) return null;
    const box = el('div', { class: 'test-challenges' });
    box.appendChild(el('h3', { text: 'Challenge sets' }));
    all.forEach(({ u, c }) => {
      const row = el('div', { class: 'test-challenge' });
      row.appendChild(el('div', {}, [el('strong', { text: c.title }), el('div', { class: 'muted small', text: c.questions.length + ' questions · ' + c.minutes + ' min · ' + c.description })]));
      const b = el('button', { class: 'btn btn-primary btn-sm', text: 'Start' });
      b.addEventListener('click', () => startChallenge(u.id, c.id));
      row.appendChild(b);
      box.appendChild(row);
    });
    return box;
  }

  function resumePrompt(active) {
    main.innerHTML = '';
    const box = el('div', { class: 'quiz-start' });
    box.appendChild(el('h2', { text: 'You have a test in progress' }));
    const answered = Object.keys(active.answers || {}).filter(k => active.answers[k] !== null).length;
    box.appendChild(el('p', { class: 'muted', text: answered + ' of ' + active.specs.length + ' answered' + (active.endsAt ? ' · ' + fmtTime(active.endsAt - Date.now()) + ' left on the timer' : '') + '.' }));
    const row = el('div', { class: 'btn-row' });
    const go = el('button', { class: 'btn btn-primary', text: 'Resume' });
    const drop = el('button', { class: 'btn btn-ghost', text: 'Discard and start over' });
    go.addEventListener('click', () => run(active));
    drop.addEventListener('click', () => { Store.saveActiveTest(null); setup(); });
    row.appendChild(go); row.appendChild(drop); box.appendChild(row);
    main.appendChild(box);
  }

  // ================= setup =================
  function setup(prev) {
    const params = new URLSearchParams(location.search);
    const pre = (params.get('units') || '').split(',').filter(Boolean);
    const sel = prev ? prev.sections : null;
    const st = {
      sections: {},                       // 'unitId|secId' -> bool
      count: prev ? prev.count : 20,
      minutes: prev ? prev.minutes : 45,
      weak: prev ? prev.weak : true,
      sketch: prev ? prev.sketch : true
    };
    units.forEach(u => u.sections.forEach(s => {
      const k = u.id + '|' + s.id;
      st.sections[k] = sel ? !!sel[k] : (pre.length ? pre.includes(u.id) : true);
    }));

    main.innerHTML = '';
    main.appendChild(el('h1', { text: 'Practice test' }));
    main.appendChild(el('p', { class: 'muted', text: 'Questions are mixed across the sections you choose. No hints or answers until you submit — just like the real test. Pick several units for a cumulative review.' }));
    const chBox = challengeList();
    if (chBox) main.appendChild(chBox);

    const pick = el('div', { class: 'test-pick' });
    main.appendChild(pick);
    const info = el('p', { class: 'muted small' });
    const start = el('button', { class: 'btn btn-primary', text: 'Start test' });
    units.forEach(u => {
      const box = el('div', { class: 'test-unit' });
      const head = el('label', { class: 'toggle test-unit-head' });
      const all = el('input', { type: 'checkbox' });
      head.appendChild(all); head.appendChild(el('strong', { text: u.title }));
      box.appendChild(head);
      const list = el('div', { class: 'test-secs' });
      const boxes = u.sections.map(s => {
        const k = u.id + '|' + s.id;
        const l = el('label', { class: 'toggle' });
        const cb = el('input', { type: 'checkbox' });
        cb.checked = st.sections[k];
        cb.addEventListener('change', () => { st.sections[k] = cb.checked; sync(); });
        l.appendChild(cb); l.appendChild(el('span', { text: s.id + '  ' + s.title }));
        list.appendChild(l);
        return cb;
      });
      const sync = () => { const n = boxes.filter(b => b.checked).length; all.checked = n === boxes.length; all.indeterminate = n > 0 && n < boxes.length; summary(); };
      all.addEventListener('change', () => { boxes.forEach((b, i) => { b.checked = all.checked; st.sections[u.id + '|' + u.sections[i].id] = all.checked; }); sync(); });
      box.appendChild(list);
      pick.appendChild(box);
      sync();
    });

    const opts = el('div', { class: 'test-opts' });
    main.appendChild(opts);
    const optRow = (label, node) => { const r = el('div', { class: 'test-opt' }); r.appendChild(el('span', { class: 'test-opt-label', text: label })); r.appendChild(node); opts.appendChild(r); };
    const countBox = el('div'); Graph.segmented(countBox, [10, 15, 20, 25, 30].map(n => ({ label: String(n), value: n })), st.count, v => { st.count = v; summary(); });
    optRow('Questions', countBox);
    const timeBox = el('div'); Graph.segmented(timeBox, [{ label: 'Off', value: 0 }, { label: '20 min', value: 20 }, { label: '30 min', value: 30 }, { label: '45 min', value: 45 }, { label: '60 min', value: 60 }], st.minutes, v => { st.minutes = v; });
    optRow('Timer', timeBox);
    const tg = el('div', { class: 'toggles' });
    Graph.toggle(tg, 'Focus on my weak topics (Not yet / Shaky / low quiz scores show up more)', st.weak, v => { st.weak = v; });
    Graph.toggle(tg, 'Include sketch-the-graph questions', st.sketch, v => { st.sketch = v; });
    optRow('Options', tg);

    main.appendChild(info);
    main.appendChild(start);
    start.addEventListener('click', () => {
      const t = build(st);
      if (!t) return;
      Store.saveActiveTest(t);
      run(t);
    });

    const hist = Store.getTests();
    if (hist.length) {
      const h = el('div', { class: 'test-history' });
      h.appendChild(el('h3', { text: 'Recent tests' }));
      hist.slice(-5).reverse().forEach(r => h.appendChild(el('div', { class: 'info-row' }, [el('span', { text: new Date(r.date).toLocaleString() + ' · ' + (r.label || '') }), el('strong', { text: M.fmt(r.score, 1) + ' / ' + r.total + '  (' + Math.round(r.score / r.total * 100) + '%)' })])));
      main.appendChild(h);
    }

    function summary() {
      const topics = poolFor(st).length;
      info.textContent = topics ? topics + ' topics selected.' : 'Select at least one section.';
      start.disabled = !topics;
    }
    summary();
  }

  function poolFor(st) {
    const pool = [];
    units.forEach(u => u.sections.forEach(s => {
      if (!st.sections[u.id + '|' + s.id]) return;
      s.topics.forEach(t => {
        const gens = (t.quiz || []).map((g, i) => ({ g, i })).filter(x => st.sketch || !isSketchGen(x.g));
        if (gens.length) pool.push({ unit: u, sec: s, topic: t, gens });
      });
    }));
    return pool;
  }

  // ================= building a test =================
  function build(st) {
    const pool = poolFor(st);
    if (!pool.length) return null;
    const rng = M.rng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
    const weight = p => {
      if (!st.weak) return 1;
      const c = Store.getConfidence(p.unit.id, p.topic.id), best = Store.bestScore(p.unit.id, p.topic.id);
      return 1 + (c === 'none' ? 1 : c === 'shaky' ? 1.5 : 0) + (best === null ? 0.5 : best < 0.6 ? 1 : best < 0.8 ? 0.5 : 0);
    };
    pool.forEach(p => { p.w = weight(p); p.used = 0; p.genOrder = rng.shuffle(p.gens.map(x => x.i)); });
    const pickWeighted = arr => { const tot = arr.reduce((a, p) => a + p.w, 0); let r = rng.next() * tot; for (const p of arr) { r -= p.w; if (r <= 0) return p; } return arr[arr.length - 1]; };
    const picks = [];
    const take = p => { picks.push(p); p.w *= 0.45; };    // spread questions around

    // every selected section gets at least one question when there's room
    const secs = [];
    pool.forEach(p => { const k = p.unit.id + '|' + p.sec.id; if (!secs.includes(k)) secs.push(k); });
    if (st.count >= secs.length) secs.forEach(k => take(pickWeighted(pool.filter(p => p.unit.id + '|' + p.sec.id === k))));
    while (picks.length < st.count) take(pickWeighted(pool));

    const specs = picks.map(p => {
      const g = p.genOrder[p.used++ % p.genOrder.length];
      return { unitId: p.unit.id, topicId: p.topic.id, g, seed: (rng.next() * 4294967296) >>> 0 };
    });
    // order like a real test: by unit, then section, then topic
    const rank = s => { const ui = units.findIndex(u => u.id === s.unitId); const u = units[ui]; return ui * 1e4 + u.topics.findIndex(t => t.id === s.topicId); };
    specs.sort((a, b) => rank(a) - rank(b));
    const label = units.filter(u => u.sections.some(s => st.sections[u.id + '|' + s.id])).map(u => u.title.split(' — ')[0]).join(' + ');
    return { specs, answers: {}, flags: {}, idx: 0, startedAt: Date.now(), endsAt: st.minutes ? Date.now() + st.minutes * 60000 : null, settings: st, label };
  }

  function questionsFor(t) {
    return t.specs.map(s => Quiz.buildQuestion(s.challenge ? challengeQ(s).gen : findTopic(s.unitId, s.topicId).quiz[s.g], s));
  }

  // ================= taking the test =================
  function run(t) {
    const qs = questionsFor(t);
    let timer = null, h = null;
    main.innerHTML = '';
    const bar = el('div', { class: 'test-bar' }); main.appendChild(bar);
    const pos = el('span', { class: 'test-pos' }); bar.appendChild(pos);
    const clock = el('span', { class: 'test-clock' }); bar.appendChild(clock);
    const submit = el('button', { class: 'btn btn-primary btn-sm', text: 'Submit test' }); bar.appendChild(submit);
    const nav = el('div', { class: 'test-nav' }); main.appendChild(nav);
    const card = el('div', { class: 'quiz-card' }); main.appendChild(card);
    const row = el('div', { class: 'btn-row test-btns' }); main.appendChild(row);
    const prev = el('button', { class: 'btn btn-ghost', text: '← Previous' });
    const flag = el('button', { class: 'btn btn-ghost', text: '⚑ Flag for review' });
    const next = el('button', { class: 'btn btn-primary', text: 'Next →' });
    row.appendChild(prev); row.appendChild(flag); row.appendChild(next);

    const persist = () => Store.saveActiveTest(t);
    function saveCurrent() { if (h) { const a = h.getAnswer(); t.answers[t.idx] = Quiz.isBlank(qs[t.idx], a) ? null : a; persist(); } }
    function go(i) { saveCurrent(); t.idx = Math.max(0, Math.min(qs.length - 1, i)); show(); }
    prev.addEventListener('click', () => go(t.idx - 1));
    next.addEventListener('click', () => { if (t.idx === qs.length - 1) trySubmit(); else go(t.idx + 1); });
    flag.addEventListener('click', () => { t.flags[t.idx] = !t.flags[t.idx]; persist(); renderNav(); flag.classList.toggle('active', !!t.flags[t.idx]); });
    submit.addEventListener('click', trySubmit);

    function renderNav() {
      nav.innerHTML = '';
      qs.forEach((q, i) => {
        const answered = t.answers[i] !== undefined && t.answers[i] !== null;
        const b = el('button', { class: 'test-dot' + (i === t.idx ? ' current' : '') + (answered ? ' answered' : '') + (t.flags[i] ? ' flagged' : ''), text: String(i + 1), title: (answered ? 'answered' : 'unanswered') + (t.flags[i] ? ', flagged' : '') });
        b.addEventListener('click', () => go(i));
        nav.appendChild(b);
      });
    }
    function show() {
      const q = qs[t.idx];
      card.innerHTML = '';
      pos.textContent = 'Question ' + (t.idx + 1) + ' of ' + qs.length;
      h = Quiz.renderQuestion(card, q);
      if (t.answers[t.idx] !== undefined && t.answers[t.idx] !== null) h.setAnswer(t.answers[t.idx]);
      h.onChange = () => { saveCurrent(); renderNav(); };
      prev.disabled = t.idx === 0;
      next.textContent = t.idx === qs.length - 1 ? 'Finish →' : 'Next →';
      flag.classList.toggle('active', !!t.flags[t.idx]);
      renderNav();
      window.scrollTo(0, 0);
      if (h.firstInput) setTimeout(() => h.firstInput.focus(), 0);
    }
    function tick() {
      if (t.endsAt) {
        const left = t.endsAt - Date.now();
        clock.textContent = '⏱ ' + fmtTime(left) + ' left';
        clock.classList.toggle('warn', left < 5 * 60000);
        if (left <= 0) { finish(true); }
      } else clock.textContent = '⏱ ' + fmtTime(Date.now() - t.startedAt);
    }
    function trySubmit() {
      saveCurrent();
      const blank = qs.filter((q, i) => t.answers[i] === undefined || t.answers[i] === null).length;
      const flagged = Object.keys(t.flags).filter(k => t.flags[k]).length;
      const msg = (blank ? blank + ' question' + (blank > 1 ? 's are' : ' is') + ' unanswered. ' : '') + (flagged ? flagged + ' flagged for review. ' : '') + 'Submit the test?';
      if (blank || flagged ? confirm(msg) : true) finish(false);
    }
    function finish(timeUp) {
      clearInterval(timer);
      saveCurrent();
      Store.saveActiveTest(null);
      results(t, qs, timeUp);
    }
    card.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.tagName === 'INPUT') { e.preventDefault(); next.click(); } });
    show();
    tick();
    timer = setInterval(() => { if (!clock.isConnected) { clearInterval(timer); return; } tick(); }, 1000);
  }

  // ================= results =================
  function results(t, qs, timeUp) {
    const graded = qs.map((q, i) => {
      const r = Quiz.gradeAnswer(q, t.answers[i], { blankIsWrong: true });
      r.points = r.ok ? 1 : (r.partial || 0);
      return r;
    });
    const score = graded.reduce((a, r) => a + r.points, 0);
    const total = qs.length;
    const used = Date.now() - t.startedAt;
    Store.addTestResult({ score, total, label: t.label, minutes: Math.round(used / 60000) });

    // per-topic tallies (also feed the topic quiz history so weak-topic weighting learns from tests)
    const byTopic = {};
    t.specs.forEach((s, i) => {
      const k = s.unitId + '|' + s.topicId;
      byTopic[k] = byTopic[k] || { unitId: s.unitId, topic: findTopic(s.unitId, s.topicId), pts: 0, n: 0, idx: [] };
      byTopic[k].pts += graded[i].points; byTopic[k].n++; byTopic[k].idx.push(i);
    });
    Object.values(byTopic).forEach(b => Store.addQuizResult(b.unitId, b.topic.id, { score: b.pts, total: b.n, source: 'test' }));

    main.innerHTML = '';
    const pct = Math.round(score / total * 100);
    const head = el('div', { class: 'quiz-end' });
    head.appendChild(el('h2', { text: (timeUp ? 'Time’s up — ' : '') + 'Score: ' + M.fmt(score, 1) + ' / ' + total + '  (' + pct + '%)' }));
    head.appendChild(el('p', { class: 'muted', text: 'Time used ' + fmtTime(used) + '. Multi-part and sketch questions earn partial credit. ' + (pct >= 90 ? 'Excellent — you’re ready.' : pct >= 75 ? 'Solid. Review the missed ones below, then retake them.' : 'Go back to the weakest topics below (Notes → Explore → Quiz), then retake the missed questions.') }));
    const btns = el('div', { class: 'btn-row' });
    const missedSpecs = t.specs.filter((s, i) => !graded[i].ok);
    if (missedSpecs.length) {
      const b = el('button', { class: 'btn btn-primary', text: 'Retake the ' + missedSpecs.length + ' missed' });
      b.addEventListener('click', () => { const nt = { specs: missedSpecs, answers: {}, flags: {}, idx: 0, startedAt: Date.now(), endsAt: null, settings: t.settings, label: (t.label || '') + ' (retake)' }; Store.saveActiveTest(nt); run(nt); });
      btns.appendChild(b);
    }
    const again = el('button', { class: 'btn ' + (missedSpecs.length ? 'btn-ghost' : 'btn-primary'), text: t.settings.challenge ? 'Retake this challenge' : 'New test, same settings' });
    again.addEventListener('click', () => {
      if (t.settings.challenge) { const [uid, cid] = t.settings.challenge.split('/'); startChallenge(uid, cid); return; }
      const nt = build(t.settings); Store.saveActiveTest(nt); run(nt);
    });
    const change = el('button', { class: 'btn btn-ghost', text: 'Change settings' });
    change.addEventListener('click', () => setup(t.settings.challenge ? null : t.settings));
    btns.appendChild(again); btns.appendChild(change);
    head.appendChild(btns);
    main.appendChild(head);

    // ---- topic breakdown ----
    const tb = el('div', { class: 'test-breakdown' });
    tb.appendChild(el('h3', { text: 'By topic' }));
    const rows = Object.values(byTopic).sort((a, b) => a.pts / a.n - b.pts / b.n);
    rows.forEach(b => {
      const ratio = b.pts / b.n;
      const r = el('div', { class: 'tb-row' });
      r.appendChild(el('a', { href: 'unit.html?unit=' + encodeURIComponent(b.unitId) + '#topic=' + encodeURIComponent(b.topic.id), text: b.topic.sectionId + ' · ' + b.topic.title }));
      r.appendChild(el('span', { class: 'muted small', text: M.fmt(b.pts, 1) + ' / ' + b.n }));
      const bar = el('div', { class: 'progress' }, el('div', { class: 'progress-fill', style: 'width:' + Math.round(ratio * 100) + '%;background:' + (ratio >= 0.85 ? 'var(--accent-3)' : ratio >= 0.5 ? 'var(--accent-2)' : 'var(--danger)') }));
      r.appendChild(bar);
      tb.appendChild(r);
    });
    const upd = el('button', { class: 'btn btn-ghost btn-sm', text: 'Update my confidence marks from these results' });
    upd.addEventListener('click', () => {
      rows.forEach(b => { const ratio = b.pts / b.n; Store.setConfidence(b.unitId, b.topic.id, ratio >= 0.85 ? 'confident' : ratio >= 0.5 ? 'shaky' : 'none'); });
      upd.textContent = 'Updated ✓ (≥ 85% → Confident, ≥ 50% → Shaky, else Not yet)'; upd.disabled = true;
    });
    tb.appendChild(upd);
    main.appendChild(tb);

    // ---- full review ----
    const rv = el('div', { class: 'test-review' });
    const rvHead = el('div', { class: 'test-review-head' });
    rvHead.appendChild(el('h3', { text: 'Review' }));
    const filt = el('div');
    rvHead.appendChild(filt);
    rv.appendChild(rvHead);
    const list = el('div'); rv.appendChild(list);
    main.appendChild(rv);
    let onlyMissed = true;
    Graph.segmented(filt, [{ label: 'Missed only', value: true }, { label: 'All questions', value: false }], true, v => { onlyMissed = v; renderReview(); });
    function renderReview() {
      list.innerHTML = '';
      qs.forEach((q, i) => {
        if (onlyMissed && graded[i].ok) return;
        const s = t.specs[i], tp = findTopic(s.unitId, s.topicId);
        const c = el('div', { class: 'quiz-card test-review-card' });
        c.appendChild(el('div', { class: 'test-review-meta' }, [el('strong', { text: 'Question ' + (i + 1) }), el('span', { class: 'muted small', text: tp.sectionId + ' · ' + tp.title }), el('span', { class: graded[i].ok ? 'good' : 'bad', text: graded[i].ok ? '✓' : M.fmt(graded[i].points, 2) + ' pt' })]));
        const hh = Quiz.renderQuestion(c, q);
        if (t.answers[i] !== undefined && t.answers[i] !== null) hh.setAnswer(t.answers[i]);
        const fb = el('div', { class: 'quiz-feedback' }); c.appendChild(fb);
        Quiz.showResult(q, hh, graded[i], fb);
        list.appendChild(c);
      });
      if (!list.children.length) list.appendChild(el('p', { class: 'good', text: 'Nothing missed. 🎉' }));
    }
    renderReview();
    window.scrollTo(0, 0);
  }

  window.TestMode = { init, build, poolFor };
})();
