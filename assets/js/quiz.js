/* Quiz engine: randomized generated questions, graded with explanations, scores saved.
   The per-question pieces (build, render input, grade, feedback) are exported so test.js can reuse them. */
(function () {
  const el = R.el;

  function parseBy(kind, str) {
    switch (kind) {
      case 'pi': return M.parsePi(str);
      case 'angle': { // radians by default; a degree sign means degrees (converted to radians)
        const s = String(str).trim();
        if (/[°º]/.test(s)) return M.degToRad(M.parseDMS(s));
        return M.parsePi(s);
      }
      case 'exact': return M.parseExact(str);
      case 'dms': return M.parseDMS(str);
      case 'any': { // accepts degrees with °, π forms, fractions, roots
        const s = String(str).trim();
        if (/pi|π/i.test(s)) return M.parsePi(s);
        if (/sqrt|√|root/i.test(s)) return M.parseExact(s);
        if (/[°'"′″]/.test(s)) return M.parseDMS(s);
        return M.parseFraction(s);
      }
      // plain-number fields still accept π / √ answers (e.g. "400pi"), instead of parseFloat silently reading "400"
      default: return /pi|π|sqrt|√|root/i.test(String(str)) ? parseBy('any', str) : M.parseFraction(str);
    }
  }

  function gradeNumber(q, raw) {
    const v = parseBy(q.parse || 'number', raw);
    if (isNaN(v)) return { ok: false, unreadable: true };
    const tol = q.tol === undefined ? 0.01 : q.tol;
    let ok = Math.abs(v - q.answer) <= tol;
    if (!ok && q.alsoAccept) ok = q.alsoAccept.some(a => Math.abs(v - a) <= tol);
    if (!ok && q.modulo) { const m = q.modulo; ok = Math.abs(((v - q.answer) % m + m) % m) <= tol || Math.abs((((v - q.answer) % m + m) % m) - m) <= tol; }
    return { ok, value: v };
  }

  // ---------- reusable per-question pieces ----------
  function buildQuestion(gen, spec) {
    const rng = M.rng(spec.seed);
    let q;
    try { q = gen(rng, { M, R, Explore: window.Explore }); } catch (e) { console.error(e); q = { type: 'text', prompt: 'Generator error: ' + e.message, check: () => true, answerText: '' }; }
    q.spec = spec;
    if (q.type === 'mc') q.choices = rng.shuffle(q.choices);
    return q;
  }

  // Renders the prompt + input controls into `card`. Returns handles for reading/locking the answer.
  function renderQuestion(card, q) {
    card.appendChild(el('div', { class: 'quiz-prompt', html: R.md(q.prompt) }));
    if (q.graph) {
      const g = el('div', { class: 'quiz-graph' });
      card.appendChild(g);
      setTimeout(() => { try { q.graph(g); } catch (e) { console.error(e); } }, 0);
    }
    const inputArea = el('div', { class: 'quiz-input' });
    card.appendChild(inputArea);
    const h = { inputArea, firstInput: null, chosen: null, sketch: null };
    if (q.type === 'mc') {
      q.choices.forEach((c, i) => {
        const b = el('button', { class: 'choice', html: R.md(c.text) });
        b.addEventListener('click', () => { if (b.disabled) return; h.chosen = i; inputArea.querySelectorAll('.choice').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); if (h.onChange) h.onChange(); });
        inputArea.appendChild(b);
      });
      h.getAnswer = () => h.chosen;
      h.setAnswer = v => { h.chosen = v; inputArea.querySelectorAll('.choice').forEach((x, i) => x.classList.toggle('selected', i === v)); };
    } else if (q.type === 'multi') {
      const fields = q.fields.map(f => {
        const row = el('label', { class: 'field' });
        row.appendChild(el('span', { html: R.md(f.label) }));
        const inp = el('input', { class: 'input', placeholder: f.placeholder || '' });
        inp.addEventListener('input', () => { if (h.onChange) h.onChange(); });
        row.appendChild(inp);
        inputArea.appendChild(row);
        if (!h.firstInput) h.firstInput = inp;
        return inp;
      });
      h.getAnswer = () => fields.map(f => f.value);
      h.setAnswer = v => { if (v) fields.forEach((f, i) => f.value = v[i] || ''); };
    } else if (q.type === 'sketch') {
      h.sketch = Sketch.render(inputArea, q, () => { if (h.onChange) h.onChange(); });
      h.getAnswer = () => h.sketch.getAnswer();
      h.setAnswer = v => h.sketch.setAnswer(v);
    } else {
      const inp = el('input', { class: 'input input-lg', placeholder: q.placeholder || 'your answer' });
      inp.addEventListener('input', () => { if (h.onChange) h.onChange(); });
      inputArea.appendChild(inp);
      if (q.unit) inputArea.appendChild(el('span', { class: 'unit', text: q.unit }));
      h.firstInput = inp;
      h.getAnswer = () => inp.value;
      h.setAnswer = v => { inp.value = v || ''; };
    }
    if (q.note) inputArea.appendChild(el('div', { class: 'muted small', html: R.md(q.note) }));
    h.lock = () => { inputArea.querySelectorAll('input,button,select').forEach(x => x.disabled = true); if (h.sketch) h.sketch.lock(); };
    return h;
  }

  function isBlank(q, raw) {
    if (q.type === 'mc') return raw === null || raw === undefined;
    if (q.type === 'multi') return !raw || raw.every(v => !String(v).trim());
    if (q.type === 'sketch') return Sketch.isBlank(q, raw);
    return !String(raw === undefined || raw === null ? '' : raw).trim();
  }

  // Grades a raw answer. status: 'empty' | 'unreadable' | 'graded'. Blank answers can be graded as wrong with {blankIsWrong:true}.
  function gradeAnswer(q, raw, opts) {
    opts = opts || {};
    if (isBlank(q, raw)) {
      if (!opts.blankIsWrong) return { status: 'empty', msg: q.type === 'mc' ? 'Pick an answer first.' : q.type === 'sketch' ? 'Place your points first.' : 'Type an answer first.' };
      return { status: 'graded', ok: false, blank: true, detail: answerDetail(q) };
    }
    if (q.type === 'mc') {
      const ok = !!q.choices[raw].correct;
      return { status: 'graded', ok, detail: ok ? '' : 'Correct choice: ' + R.md(q.choices.find(c => c.correct).text) };
    }
    if (q.type === 'text') { const ok = !!q.check(raw); return { status: 'graded', ok, detail: 'Answer: ' + R.md(q.answerText || '') }; }
    if (q.type === 'set') {
      const list = q.parse
        ? String(raw).split(/[,;]|\band\b/).map(s => s.trim()).filter(Boolean).map(s => parseBy(q.parse, s)).filter(x => !isNaN(x))
        : M.parseNumberList(raw);
      if (!list.length && !opts.blankIsWrong) return { status: 'unreadable', msg: 'Type the values separated by commas.' };
      const ok = M.sameNumberSet(list, q.answers, q.tol === undefined ? 0.05 : q.tol);
      return { status: 'graded', ok, detail: 'Answer: ' + R.md(q.answerText || q.answers.map(a => M.fmt(a, 2)).join(', ')) };
    }
    if (q.type === 'multi') {
      const per = q.fields.map((f, i) => gradeNumber({ parse: f.parse, tol: f.tol, answer: f.answer, alsoAccept: f.alsoAccept, modulo: f.modulo }, raw[i]));
      const ok = per.every(p => p.ok);
      const detail = q.fields.map((f, i) => '<div>' + R.md(f.label) + ': ' + (per[i].ok ? '<span class="good">✓</span>' : '<span class="bad">✗</span>') + ' &nbsp;<span class="muted">answer ' + R.md(f.answerText || M.fmt(f.answer, 3)) + '</span></div>').join('');
      return { status: 'graded', ok, detail, partial: per.filter(p => p.ok).length / per.length };
    }
    if (q.type === 'sketch') {
      const g = Sketch.grade(q, raw);
      return { status: 'graded', ok: g.ok, detail: g.detail, partial: g.partial, sketch: g };
    }
    const g = gradeNumber(q, raw);
    if (g.unreadable && !opts.blankIsWrong) return { status: 'unreadable', msg: 'I couldn\'t read that. Try a decimal, a fraction like 3/4, something like 5pi/6, or sqrt(3)/2.' };
    return { status: 'graded', ok: !!g.ok, detail: 'Answer: ' + R.md(q.answerText || M.fmt(q.answer, 3)) + (q.unit ? ' ' + q.unit : '') };
  }

  function answerDetail(q) {
    if (q.type === 'mc') return 'Correct choice: ' + R.md(q.choices.find(c => c.correct).text);
    if (q.type === 'multi') return q.fields.map(f => '<div>' + R.md(f.label) + ': ' + R.md(f.answerText || M.fmt(f.answer, 3)) + '</div>').join('');
    if (q.type === 'set') return 'Answer: ' + R.md(q.answerText || q.answers.map(a => M.fmt(a, 2)).join(', '));
    if (q.type === 'sketch') return Sketch.answerText(q);
    if (q.type === 'text') return 'Answer: ' + R.md(q.answerText || '');
    return 'Answer: ' + R.md(q.answerText || M.fmt(q.answer, 3)) + (q.unit ? ' ' + q.unit : '');
  }

  // Marks the input area (MC colors / sketch overlay) and fills the feedback box.
  function showResult(q, h, result, feedback, opts) {
    opts = opts || {};
    h.lock();
    if (q.type === 'mc') h.inputArea.querySelectorAll('.choice').forEach((b, i) => { if (q.choices[i].correct) b.classList.add('correct'); else if (i === h.chosen && !result.ok) b.classList.add('wrong'); });
    if (q.type === 'sketch' && h.sketch) h.sketch.showResult(result.sketch);
    const verdict = opts.skipped ? 'Here\'s how it works' : result.blank ? 'Left blank' : result.ok ? 'Correct' : (result.partial ? 'Partly right' : 'Not quite');
    feedback.innerHTML = '<div class="verdict ' + (result.ok ? 'good' : 'bad') + '">' + verdict + '</div>' +
      (result.ok ? '' : '<div class="detail">' + result.detail + '</div>') +
      (q.explanation ? '<div class="explanation">' + R.md(q.explanation) + '</div>' : '');
    if (q.explainGraph) {
      const g = el('div', { class: 'quiz-graph' });
      feedback.appendChild(g);
      setTimeout(() => { try { q.explainGraph(g); } catch (e) { console.error(e); } }, 0);
    }
  }

  // ---------- topic quiz ----------
  function render(container, cfg) {
    const { unitId, topicId } = cfg;
    const gens = cfg.generators || [];
    const count = cfg.count || Math.min(8, Math.max(5, gens.length * 2));
    container.innerHTML = '';
    if (!gens.length) { container.appendChild(el('p', { class: 'muted', text: 'No quiz for this topic yet.' })); return; }

    const root = el('div', { class: 'quiz' });
    container.appendChild(root);

    function startScreen() {
      root.innerHTML = '';
      const hist = Store.getQuizHistory(unitId, topicId);
      const best = Store.bestScore(unitId, topicId);
      const last = Store.lastScore(unitId, topicId);
      root.appendChild(el('div', { class: 'quiz-start' }, [
        el('h3', { text: 'Randomized quiz' }),
        el('p', { class: 'muted', text: count + ' generated questions. Numbers change every time, so you can\'t memorize answers — only methods. Nothing is shown until you commit an answer.' }),
        el('div', { class: 'quiz-stats' }, [
          el('div', { class: 'stat' }, [el('span', { text: 'Attempts' }), el('strong', { text: String(hist.length) })]),
          el('div', { class: 'stat' }, [el('span', { text: 'Best' }), el('strong', { text: best === null ? '—' : Math.round(best * 100) + '%' })]),
          el('div', { class: 'stat' }, [el('span', { text: 'Last' }), el('strong', { text: last ? last.score + ' / ' + last.total : '—' })])
        ]),
        (function () { const b = el('button', { class: 'btn btn-primary', text: 'Start quiz' }); b.addEventListener('click', () => run()); return b; })()
      ]));
    }

    function run(specs) {
      if (!specs) {
        const base = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
        const order = M.rng(base).shuffle(gens.map((_, i) => i));
        specs = [];
        // cycle through generators so every type appears before any repeats
        for (let i = 0; i < count; i++) specs.push({ seed: (base + i * 7919) >>> 0, g: order[i % gens.length] });
      }
      const qs = specs.map(s => buildQuestion(gens[s.g % gens.length], s));
      let idx = 0, score = 0;
      const results = [];
      next();

      function next() {
        if (idx >= qs.length) return finish();
        const q = qs[idx];
        root.innerHTML = '';
        const head = el('div', { class: 'quiz-head' }, [
          el('span', { text: 'Question ' + (idx + 1) + ' of ' + qs.length }),
          el('span', { class: 'muted', text: 'Score ' + score })
        ]);
        root.appendChild(head);
        root.appendChild(el('div', { class: 'progress' }, el('div', { class: 'progress-fill', style: 'width:' + (idx / qs.length * 100) + '%' })));

        const card = el('div', { class: 'quiz-card' });
        root.appendChild(card);
        const h = renderQuestion(card, q);
        const feedback = el('div', { class: 'quiz-feedback' });
        card.appendChild(feedback);
        const btnRow = el('div', { class: 'btn-row' });
        card.appendChild(btnRow);
        const check = el('button', { class: 'btn btn-primary', text: 'Check' });
        const skip = el('button', { class: 'btn btn-ghost', text: 'I don\'t know — show me' });
        btnRow.appendChild(check); btnRow.appendChild(skip);

        function done(result, skipped) {
          if (result.ok) score++;
          results.push({ spec: q.spec, ok: result.ok, skipped });
          showResult(q, h, result, feedback, { skipped });
          btnRow.innerHTML = '';
          const nb = el('button', { class: 'btn btn-primary', text: idx + 1 < qs.length ? 'Next question' : 'See results' });
          nb.addEventListener('click', () => { idx++; next(); });
          btnRow.appendChild(nb);
          nb.focus();
          head.lastChild.textContent = 'Score ' + score;
        }
        function grade() {
          const r = gradeAnswer(q, h.getAnswer());
          if (r.status !== 'graded') { feedback.innerHTML = '<span class="muted">' + r.msg + '</span>'; return; }
          done(r, false);
        }
        check.addEventListener('click', grade);
        skip.addEventListener('click', () => done({ ok: false, detail: answerDetail(q), sketch: q.type === 'sketch' ? Sketch.grade(q, h.getAnswer()) : null }, true));
        card.addEventListener('keydown', e => { if (e.key === 'Enter' && btnRow.contains(check)) { e.preventDefault(); grade(); } });
        if (h.firstInput) setTimeout(() => h.firstInput.focus(), 0);
      }

      function finish() {
        Store.addQuizResult(unitId, topicId, { score, total: qs.length });
        root.innerHTML = '';
        const pct = Math.round(score / qs.length * 100);
        const missed = results.filter(r => !r.ok).map(r => r.spec);
        const wrap = el('div', { class: 'quiz-end' });
        wrap.appendChild(el('h3', { text: 'Score: ' + score + ' / ' + qs.length + '  (' + pct + '%)' }));
        wrap.appendChild(el('p', { class: 'muted', text: pct === 100 ? 'Clean sweep. Try marking this topic Confident — or run it again to be sure it wasn\'t luck.' : pct >= 75 ? 'Solid. Redo the missed ones until the method is automatic.' : 'Go back to Notes and Explore for this topic, then retry the missed questions.' }));
        const row = el('div', { class: 'btn-row' });
        if (missed.length) {
          const b = el('button', { class: 'btn btn-primary', text: 'Retry the ' + missed.length + ' missed' });
          b.addEventListener('click', () => run(missed));
          row.appendChild(b);
        }
        const b2 = el('button', { class: 'btn ' + (missed.length ? 'btn-ghost' : 'btn-primary'), text: 'New quiz' });
        b2.addEventListener('click', () => run());
        row.appendChild(b2);
        wrap.appendChild(row);
        root.appendChild(wrap);
        if (cfg.onFinish) cfg.onFinish({ score, total: qs.length });
      }
    }

    startScreen();
  }

  window.Quiz = { render, parseBy, gradeNumber, buildQuestion, renderQuestion, gradeAnswer, answerDetail, showResult, isBlank };
})();
