// Headless smoke test: loads the site scripts into a stub DOM, runs every quiz generator many times.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = path.resolve(__dirname, '..');

const noopEl = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {} }, appendChild() {}, addEventListener() {}, setAttribute() {}, querySelector() { return noopEl(); }, querySelectorAll() { return []; }, getContext() { return new Proxy({}, { get: () => () => {} }); }, remove() {}, dispatchEvent() {} });
const sandbox = {
  console, Math, Date, Infinity, NaN, parseFloat, parseInt, isNaN, isFinite, String, Number, Array, Object, Set, Map, Promise, RegExp, Error, JSON, Symbol, Proxy, Reflect,
  document: { createElement: noopEl, createTextNode: () => ({}), addEventListener() {}, head: noopEl(), body: { dataset: {} }, documentElement: noopEl(), querySelector: noopEl, getElementById: noopEl, dispatchEvent() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  location: { search: '', hash: '' }, URLSearchParams,
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  CustomEvent: function () {}, Event: function () {}, ResizeObserver: undefined, devicePixelRatio: 1,
  setTimeout, clearTimeout, confirm: () => false
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const files = ['assets/js/math.js', 'assets/js/storage.js', 'assets/js/render.js', 'assets/js/graph.js', 'assets/js/widgets.js', 'assets/js/sketch.js', 'assets/js/quiz.js', 'units/registry.js'];
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
for (const unit of sandbox.UNITS) for (const f of unit.files) vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8'), sandbox, { filename: f });
// the template is validated too, so it never drifts out of sync with the engine
vm.runInContext(fs.readFileSync(path.join(root, 'docs/unit-template/data.js'), 'utf8'), sandbox, { filename: 'docs/unit-template/data.js' });

let problems = 0, gens = 0, topics = 0, practice = 0;
for (const unitId of Object.keys(sandbox.UNIT_DATA)) {
  const u = sandbox.UNIT_DATA[unitId];
  const ids = new Set();
  for (const sec of u.sections) for (const t of sec.topics) {
    topics++;
    if (ids.has(t.id)) { console.log('DUPLICATE topic id', t.id); problems++; }
    ids.add(t.id);
    practice += (t.practice || []).length;
    (t.practice || []).forEach((p, i) => { if (!p.q || !p.answer) { console.log('practice missing q/answer', t.id, i); problems++; } });
    // every {{fig:id}} referenced in content must exist
    const allText = [t.notes, t.explore && t.explore.intro, t.explore && t.explore.tasks].concat((t.practice || []).flatMap(p => [p.q, p.hint, p.answer, p.solution])).join('\n');
    (allText.match(/\{\{fig:([\w-]+)\}\}/g) || []).forEach(tok => { const id = tok.slice(6, -2); if (!sandbox.FIGURES || typeof sandbox.FIGURES[id] !== 'function') { console.log('MISSING FIGURE', t.id, id); problems++; } else { try { const s = sandbox.FIGURES[id](); if (!/^<svg/.test(s)) throw new Error('not svg'); } catch (e) { console.log('FIGURE ERROR', id, e.message); problems++; } } });
    (t.quiz || []).forEach((gen, gi) => {
      gens++;
      for (let s = 1; s <= 60; s++) {
        const rng = sandbox.M.rng(s * 2654435761 >>> 0);
        let q;
        try { q = gen(rng, { M: sandbox.M, R: sandbox.R, Explore: sandbox.Explore }); }
        catch (e) { console.log('THROW', t.id, 'gen#' + gi, 'seed', s, e.message); problems++; break; }
        const bad = [];
        if (!q.prompt) bad.push('no prompt');
        if (!q.type) bad.push('no type');
        if (q.type === 'number' && !isFinite(q.answer)) bad.push('non-finite answer');
        if (q.type === 'mc') {
          const c = q.choices.filter(x => x.correct).length;
          if (c !== 1) bad.push(c + ' correct choices');
          const texts = q.choices.map(x => x.text);
          if (new Set(texts).size !== texts.length) bad.push('duplicate choice text');
        }
        if (q.type === 'multi') q.fields.forEach((f, i) => { if (!isFinite(f.answer)) bad.push('field ' + i + ' non-finite'); });
        if (q.type === 'set' && (!q.answers || !q.answers.length || q.answers.some(a => !isFinite(a)))) bad.push('bad set answers');
        if (q.type === 'text' && typeof q.check !== 'function') bad.push('text without check');
        if (q.type === 'sketch') {
          const sk = q.sketch, v = sk.view;
          sk.targets.forEach((tg, i) => {
            if (!isFinite(tg.y) || (tg.kind === 'point' && !isFinite(tg.x))) bad.push('sketch target ' + i + ' non-finite');
            if (tg.y < v.yMin || tg.y > v.yMax || (tg.kind === 'point' && (tg.x < v.xMin || tg.x > v.xMax))) bad.push('sketch target ' + i + ' outside view');
            const off = (val, st) => st && Math.abs(val / st - Math.round(val / st)) > 1e-6;
            if (off(tg.y, sk.snapY) || (tg.kind === 'point' && off(tg.x, sk.snapX))) bad.push('sketch target ' + i + ' not on snap grid');
          });
          const cells = (v.xMax - v.xMin) / sk.snapX;
          if (cells > 160) bad.push('sketch grid too fine to click (' + Math.round(cells) + ' columns)');
          const perfect = {}; sk.targets.forEach((tg, i) => perfect[i] = { x: tg.x || 0, y: tg.y });
          if (!sandbox.Sketch.grade(q, perfect).ok) bad.push('sketch self-grade failed');
        }
        const textBlob = (q.prompt + (q.explanation || '') + (q.answerText === 'undefined' ? '' : (q.answerText || ''))).replace(/`undefined`|undefined \(asymptote\)|'undefined'/g, '');
        if (!q.mentionsUndefined && /undefined|NaN/.test(textBlob)) bad.push('"undefined"/NaN in text');
        if (q.mentionsUndefined && /NaN|(^|[^a-z])undefined[°$]/.test(textBlob)) bad.push('NaN/undefined value in text');
        if (bad.length) { console.log('BAD', t.id, 'gen#' + gi, 'seed', s, bad.join('; ')); problems++; break; }
        // make sure the grading path doesn't explode for the right answer
        try {
          if (q.type === 'number') { const g = sandbox.Quiz.gradeNumber(q, String(q.answer)); if (!g.ok) { console.log('SELF-GRADE FAIL', t.id, 'gen#' + gi, 'seed', s, 'answer', q.answer); problems++; break; } }
          if (q.type === 'multi') { const okAll = q.fields.every(f => sandbox.Quiz.gradeNumber(Object.assign({}, f, { parse: f.parse }), String(f.answer)).ok); if (!okAll) { console.log('SELF-GRADE FAIL (multi)', t.id, 'gen#' + gi, 'seed', s); problems++; break; } }
          if (q.type === 'text' && q.answerText && !q.check(q.answerText)) { console.log('SELF-GRADE FAIL (text)', t.id, 'gen#' + gi, 'seed', s, 'answerText', q.answerText); problems++; break; }
        } catch (e) { console.log('GRADE THROW', t.id, 'gen#' + gi, e.message); problems++; break; }
      }
    });
  }
}
// challenge sets: fixed questions must reference real topics, render figures, and self-grade
for (const unitId of Object.keys(sandbox.UNIT_DATA)) {
  const u = sandbox.UNIT_DATA[unitId];
  (u.challenges || []).forEach(c => c.questions.forEach((cq, i) => {
    const tag = 'CHALLENGE ' + c.id + ' Q' + (i + 1);
    if (!u.sections.some(s => s.topics.some(t => t.id === cq.topicId))) { console.log(tag, 'unknown topicId', cq.topicId); problems++; }
    let q; try { q = cq.gen(sandbox.M.rng(1)); } catch (e) { console.log(tag, 'THROW', e.message); problems++; return; }
    (q.prompt.match(/\{\{fig:([\w-]+)\}\}/g) || []).forEach(tok => { const id = tok.slice(6, -2); try { if (!/^<svg/.test(sandbox.FIGURES[id]())) throw 0; } catch (e) { console.log(tag, 'bad figure', id); problems++; } });
    let ok = true;
    if (q.type === 'multi') ok = q.fields.every(f => sandbox.Quiz.gradeNumber(f, String(f.answer)).ok && (!f.answerText || sandbox.Quiz.gradeNumber(f, f.answerText.split(' ≈ ')[0].replace('−', '-')).ok));
    if (q.type === 'sketch') { const p = {}; q.sketch.targets.forEach((tg, k) => p[k] = { x: tg.x || 0, y: tg.y }); ok = sandbox.Sketch.grade(q, p).ok; }
    if (!ok) { console.log(tag, 'self-grade failed'); problems++; }
  }));
}
console.log('topics:', topics, 'practice problems:', practice, 'generators:', gens, 'problems found:', problems);
process.exit(problems ? 1 : 0);
