/* App shell: unit loading (file:// safe), routing, sidebar, topic tabs, dashboards, theme. */
(function () {
  const el = R.el;
  window.UNIT_DATA = window.UNIT_DATA || {};

  // ---- theme ----
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  function initTheme() {
    applyTheme(Store.getTheme());
    const b = document.getElementById('theme-toggle');
    if (b) b.addEventListener('click', () => {
      const t = Store.getTheme() === 'dark' ? 'light' : 'dark';
      Store.setTheme(t); applyTheme(t);
      document.dispatchEvent(new CustomEvent('themechange'));
    });
  }

  // ---- unit loading via script tags (works on file://) ----
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  async function loadUnit(entry) {
    if (window.UNIT_DATA[entry.id] && window.UNIT_DATA[entry.id]._loaded) return window.UNIT_DATA[entry.id];
    for (const f of entry.files) await loadScript(f);
    const u = window.UNIT_DATA[entry.id];
    if (!u) throw new Error('Unit ' + entry.id + ' did not register itself.');
    u._loaded = true;
    u.id = entry.id;
    u.title = u.title || entry.title;
    // skip sections the student marked off-test
    u.sections = (u.sections || []).filter(s => !s.skip);
    u.topics = [];
    u.sections.forEach(s => s.topics.forEach(t => { t.sectionId = s.id; t.sectionTitle = s.title; u.topics.push(t); }));
    return u;
  }

  function qs(name) { return new URLSearchParams(location.search).get(name); }
  function hashState() {
    const h = new URLSearchParams(location.hash.replace(/^#/, ''));
    return { topic: h.get('topic'), tab: h.get('tab') || 'notes' };
  }
  function setHash(topic, tab) {
    const p = new URLSearchParams();
    if (topic) p.set('topic', topic);
    if (tab) p.set('tab', tab);
    location.hash = p.toString();
  }

  // ---- confidence selector ----
  function confidenceControl(unitId, topicId, onChange) {
    const wrap = el('div', { class: 'confidence', role: 'group', 'aria-label': 'Confidence' });
    const cur = Store.getConfidence(unitId, topicId);
    Store.CONFIDENCE.forEach(level => {
      const b = el('button', { class: 'conf conf-' + level + (cur === level ? ' active' : ''), text: Store.CONFIDENCE_LABEL[level], type: 'button' });
      b.addEventListener('click', () => {
        Store.setConfidence(unitId, topicId, level);
        wrap.querySelectorAll('.conf').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        if (onChange) onChange(level);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  // ================= INDEX PAGE =================
  async function initIndex() {
    const list = document.getElementById('unit-list');
    for (const entry of window.UNITS) {
      const card = el('a', { class: 'unit-card', href: 'unit.html?unit=' + encodeURIComponent(entry.id) });
      card.appendChild(el('div', { class: 'unit-card-title', text: entry.title }));
      if (entry.subtitle) card.appendChild(el('div', { class: 'muted', text: entry.subtitle }));
      const prog = el('div', { class: 'unit-card-progress' });
      card.appendChild(prog);
      list.appendChild(card);
      try {
        const u = await loadUnit(entry);
        const s = Store.unitSummary(entry.id, u.topics.map(t => t.id));
        prog.appendChild(progressBar(s));
        prog.appendChild(el('div', { class: 'muted small', text: u.topics.length + ' topics · ' + s.counts.confident + ' confident · ' + s.counts.shaky + ' shaky · ' + s.counts.none + ' not yet' }));
      } catch (e) {
        prog.appendChild(el('div', { class: 'bad small', text: e.message }));
      }
    }
    const cum = el('a', { class: 'unit-card unit-card-test', href: 'test.html' });
    cum.appendChild(el('div', { class: 'unit-card-title', text: 'Practice test / cumulative review' }));
    cum.appendChild(el('div', { class: 'muted', text: 'Mix questions from any units and sections, timed like the real thing.' }));
    const last = Store.lastTest ? Store.lastTest() : null;
    if (last) cum.appendChild(el('div', { class: 'muted small unit-card-progress', text: 'Last test: ' + M.fmt(last.score, 1) + ' / ' + last.total + ' (' + Math.round(last.score / last.total * 100) + '%)' }));
    list.appendChild(cum);
  }

  function progressBar(summary) {
    const bar = el('div', { class: 'progress progress-stacked', title: summary.pct + '% confident-weighted' });
    const total = summary.total || 1;
    bar.appendChild(el('div', { class: 'seg-confident', style: 'width:' + (summary.counts.confident / total * 100) + '%' }));
    bar.appendChild(el('div', { class: 'seg-shaky', style: 'width:' + (summary.counts.shaky / total * 100) + '%' }));
    return bar;
  }

  // ================= UNIT PAGE =================
  async function initUnit() {
    const id = qs('unit');
    const entry = (window.UNITS || []).find(u => u.id === id);
    const main = document.getElementById('main');
    if (!entry) { main.innerHTML = '<p class="bad">Unknown unit. <a href="index.html">Back to all units.</a></p>'; return; }
    document.getElementById('unit-title').textContent = entry.title;
    document.title = entry.title + ' · PrecalcStudy';
    let unit;
    try { unit = await loadUnit(entry); } catch (e) { main.innerHTML = '<p class="bad">' + R.escapeHtml(e.message) + '</p>'; return; }

    const sidebar = document.getElementById('sidebar');
    renderSidebar();
    window.addEventListener('hashchange', route);
    document.addEventListener('themechange', route);
    route();

    function renderSidebar() {
      sidebar.innerHTML = '';
      const s = Store.unitSummary(unit.id, unit.topics.map(t => t.id));
      const head = el('a', { class: 'side-head', href: '#' });
      head.appendChild(el('div', { class: 'side-title', text: 'Overview' }));
      head.appendChild(progressBar(s));
      head.appendChild(el('div', { class: 'muted small', text: s.pct + '% ready' }));
      sidebar.appendChild(head);
      unit.sections.forEach(sec => {
        const g = el('div', { class: 'side-section' });
        g.appendChild(el('div', { class: 'side-section-title', text: sec.id + '  ' + sec.title }));
        sec.topics.forEach(t => {
          const a = el('a', { class: 'side-topic', href: '#topic=' + encodeURIComponent(t.id), 'data-topic': t.id });
          a.appendChild(el('span', { class: 'dot dot-' + Store.getConfidence(unit.id, t.id) }));
          a.appendChild(el('span', { text: t.title }));
          g.appendChild(a);
        });
        sidebar.appendChild(g);
      });
    }

    function route() {
      const st = hashState();
      sidebar.querySelectorAll('.side-topic').forEach(a => a.classList.toggle('active', a.dataset.topic === st.topic));
      const topic = unit.topics.find(t => t.id === st.topic);
      if (!topic) renderOverview(); else renderTopic(topic, st.tab);
      document.querySelector('.layout').classList.remove('nav-open');
    }

    function renderOverview() {
      main.innerHTML = '';
      const s = Store.unitSummary(unit.id, unit.topics.map(t => t.id));
      main.appendChild(el('h1', { text: unit.title }));
      if (unit.intro) main.appendChild(el('div', { class: 'intro', html: R.md(unit.intro) }));
      const dash = el('div', { class: 'dash' });
      dash.appendChild(el('div', { class: 'dash-card' }, [el('span', { text: 'Readiness' }), el('strong', { text: s.pct + '%' }), progressBar(s)]));
      dash.appendChild(el('div', { class: 'dash-card' }, [el('span', { text: 'Confident' }), el('strong', { text: s.counts.confident + ' / ' + s.total })]));
      dash.appendChild(el('div', { class: 'dash-card' }, [el('span', { text: 'Shaky' }), el('strong', { text: String(s.counts.shaky) })]));
      dash.appendChild(el('div', { class: 'dash-card' }, [el('span', { text: 'Not yet' }), el('strong', { text: String(s.counts.none) })]));
      main.appendChild(dash);

      const cta = el('div', { class: 'test-cta' });
      cta.appendChild(el('div', {}, [el('strong', { text: 'Practice test' }), el('div', { class: 'muted small', text: 'Mixed questions from the whole unit, no hints until the end, optional timer, weighted toward your weak topics.' })]));
      cta.appendChild(el('a', { class: 'btn btn-primary', href: 'test.html?units=' + encodeURIComponent(unit.id), text: 'Start a practice test →' }));
      main.appendChild(cta);
      (unit.challenges || []).forEach(c => {
        const cc = el('div', { class: 'test-cta' });
        cc.appendChild(el('div', {}, [el('strong', { text: c.title }), el('div', { class: 'muted small', text: c.questions.length + ' questions · ' + c.minutes + ' min · ' + c.description })]));
        cc.appendChild(el('a', { class: 'btn btn-primary', href: 'test.html?challenge=' + encodeURIComponent(unit.id + '/' + c.id), text: 'Start challenge →' }));
        main.appendChild(cc);
      });
      // suggestions: weakest first (none → shaky → low quiz score)
      const ranked = unit.topics.slice().sort((a, b) => {
        const ca = Store.CONFIDENCE.indexOf(Store.getConfidence(unit.id, a.id));
        const cb = Store.CONFIDENCE.indexOf(Store.getConfidence(unit.id, b.id));
        if (ca !== cb) return ca - cb;
        const qa = Store.bestScore(unit.id, a.id), qb = Store.bestScore(unit.id, b.id);
        return (qa === null ? -1 : qa) - (qb === null ? -1 : qb);
      });
      const weak = ranked.slice(0, 4);
      const sug = el('div', { class: 'suggest' });
      sug.appendChild(el('h3', { text: s.pct === 100 ? 'You\'ve marked everything confident — do a final sweep:' : 'Work on next' }));
      weak.forEach(t => {
        const a = el('a', { class: 'suggest-item', href: '#topic=' + encodeURIComponent(t.id) });
        a.appendChild(el('span', { class: 'dot dot-' + Store.getConfidence(unit.id, t.id) }));
        a.appendChild(el('span', { text: t.sectionId + ' · ' + t.title }));
        const best = Store.bestScore(unit.id, t.id);
        a.appendChild(el('span', { class: 'muted small', text: best === null ? 'no quiz yet' : 'best quiz ' + Math.round(best * 100) + '%' }));
        sug.appendChild(a);
      });
      main.appendChild(sug);

      const table = el('div', { class: 'topic-table' });
      unit.sections.forEach(sec => {
        table.appendChild(el('h3', { class: 'tt-section', text: sec.id + '  ' + sec.title }));
        sec.topics.forEach(t => {
          const row = el('div', { class: 'tt-row' });
          row.appendChild(el('a', { href: '#topic=' + encodeURIComponent(t.id), text: t.title }));
          const best = Store.bestScore(unit.id, t.id);
          row.appendChild(el('span', { class: 'muted small', text: best === null ? '' : 'quiz ' + Math.round(best * 100) + '%' }));
          row.appendChild(confidenceControl(unit.id, t.id, () => { renderSidebar(); }));
          table.appendChild(row);
        });
      });
      main.appendChild(table);

      const reset = el('button', { class: 'btn btn-ghost btn-sm reset', text: 'Reset progress for this unit' });
      reset.addEventListener('click', () => { if (confirm('Clear confidence marks and quiz history for ' + unit.title + '?')) { Store.resetUnit(unit.id); renderSidebar(); renderOverview(); } });
      main.appendChild(reset);
    }

    function renderTopic(topic, tab) {
      main.innerHTML = '';
      const idx = unit.topics.indexOf(topic);
      const head = el('div', { class: 'topic-head' });
      head.appendChild(el('div', { class: 'crumb', text: topic.sectionId + ' · ' + topic.sectionTitle }));
      const titleRow = el('div', { class: 'title-row' });
      titleRow.appendChild(el('h1', { text: topic.title }));
      titleRow.appendChild(confidenceControl(unit.id, topic.id, () => renderSidebar()));
      head.appendChild(titleRow);
      main.appendChild(head);

      const tabs = [
        { id: 'notes', label: 'Notes', has: !!topic.notes },
        { id: 'explore', label: 'Explore', has: !!topic.explore },
        { id: 'practice', label: 'Practice', has: !!(topic.practice && topic.practice.length) },
        { id: 'quiz', label: 'Quiz', has: !!(topic.quiz && topic.quiz.length) }
      ].filter(t => t.has);
      if (!tabs.find(t => t.id === tab)) tab = tabs[0] ? tabs[0].id : 'notes';
      const nav = el('nav', { class: 'tabs', role: 'tablist' });
      tabs.forEach(t => {
        const b = el('button', { class: 'tab' + (t.id === tab ? ' active' : ''), text: t.label, role: 'tab', 'aria-selected': String(t.id === tab) });
        b.addEventListener('click', () => setHash(topic.id, t.id));
        nav.appendChild(b);
      });
      main.appendChild(nav);

      const panel = el('section', { class: 'panel panel-' + tab, role: 'tabpanel' });
      main.appendChild(panel);
      if (tab === 'notes') {
        panel.innerHTML = R.md(topic.notes);
        const go = el('div', { class: 'next-step' });
        if (topic.explore) go.appendChild(linkBtn('Explore it interactively →', topic.id, 'explore'));
        else if (topic.practice) go.appendChild(linkBtn('Practice problems →', topic.id, 'practice'));
        panel.appendChild(go);
      } else if (tab === 'explore') {
        Explore.render(panel, topic.explore);
        const go = el('div', { class: 'next-step' });
        if (topic.practice) go.appendChild(linkBtn('Practice problems →', topic.id, 'practice'));
        panel.appendChild(go);
      } else if (tab === 'practice') {
        panel.appendChild(el('p', { class: 'muted', text: 'Work each problem on paper first. Reveal in stages: hint, then answer, then the full solution.' }));
        topic.practice.forEach((p, i) => panel.appendChild(R.problemCard(p, i)));
        const go = el('div', { class: 'next-step' });
        if (topic.quiz) go.appendChild(linkBtn('Take the randomized quiz →', topic.id, 'quiz'));
        panel.appendChild(go);
      } else if (tab === 'quiz') {
        Quiz.render(panel, { unitId: unit.id, topicId: topic.id, generators: topic.quiz, count: topic.quizCount, onFinish: () => renderSidebar() });
      }

      const tnav = el('div', { class: 'topic-nav' });
      if (idx > 0) tnav.appendChild(el('a', { class: 'btn btn-ghost', href: '#topic=' + encodeURIComponent(unit.topics[idx - 1].id), text: '← ' + unit.topics[idx - 1].title }));
      else tnav.appendChild(el('span'));
      if (idx < unit.topics.length - 1) tnav.appendChild(el('a', { class: 'btn btn-ghost', href: '#topic=' + encodeURIComponent(unit.topics[idx + 1].id), text: unit.topics[idx + 1].title + ' →' }));
      main.appendChild(tnav);
      main.scrollTop = 0; window.scrollTo(0, 0);
    }

    function linkBtn(text, topicId, tab) {
      const a = el('a', { class: 'btn btn-primary', href: '#topic=' + encodeURIComponent(topicId) + '&tab=' + tab, text });
      return a;
    }

    const navBtn = document.getElementById('nav-toggle');
    if (navBtn) navBtn.addEventListener('click', () => document.querySelector('.layout').classList.toggle('nav-open'));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    const page = document.body.dataset.page;
    if (page === 'index') initIndex();
    else if (page === 'unit') initUnit();
    else if (page === 'test' && window.TestMode) TestMode.init();
  });

  window.App = { loadUnit, confidenceControl, progressBar };
})();
