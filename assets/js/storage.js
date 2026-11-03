/* localStorage wrapper for progress and preferences. */
(function () {
  const KEY = 'precalcstudy.v1';

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
  }
  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  const CONFIDENCE = ['none', 'shaky', 'confident'];
  const CONFIDENCE_LABEL = { none: 'Not yet', shaky: 'Shaky', confident: 'Confident' };

  function getConfidence(unitId, topicId) {
    const d = load();
    return (d.confidence && d.confidence[unitId] && d.confidence[unitId][topicId]) || 'none';
  }
  function setConfidence(unitId, topicId, level) {
    const d = load();
    d.confidence = d.confidence || {};
    d.confidence[unitId] = d.confidence[unitId] || {};
    d.confidence[unitId][topicId] = level;
    save(d);
  }

  function getQuizHistory(unitId, topicId) {
    const d = load();
    return (d.quiz && d.quiz[unitId] && d.quiz[unitId][topicId]) || [];
  }
  function addQuizResult(unitId, topicId, result) {
    const d = load();
    d.quiz = d.quiz || {};
    d.quiz[unitId] = d.quiz[unitId] || {};
    const list = d.quiz[unitId][topicId] || [];
    list.push(Object.assign({ date: Date.now() }, result));
    d.quiz[unitId][topicId] = list.slice(-20);
    save(d);
  }
  function bestScore(unitId, topicId) {
    const h = getQuizHistory(unitId, topicId);
    if (!h.length) return null;
    return Math.max.apply(null, h.map(r => r.score / r.total));
  }
  function lastScore(unitId, topicId) {
    const h = getQuizHistory(unitId, topicId);
    return h.length ? h[h.length - 1] : null;
  }

  // Summary for a unit: counts of each confidence level + overall percentage.
  function unitSummary(unitId, topicIds) {
    const counts = { none: 0, shaky: 0, confident: 0 };
    topicIds.forEach(t => { counts[getConfidence(unitId, t)]++; });
    const total = topicIds.length || 1;
    const pct = Math.round(((counts.confident + 0.5 * counts.shaky) / total) * 100);
    return { counts, pct, total: topicIds.length };
  }

  function getTheme() { return load().theme || 'light'; }
  function setTheme(t) { const d = load(); d.theme = t; save(d); }

  function resetUnit(unitId) {
    const d = load();
    if (d.confidence) delete d.confidence[unitId];
    if (d.quiz) delete d.quiz[unitId];
    save(d);
  }

  // ---- practice tests ----
  function addTestResult(r) { const d = load(); d.tests = (d.tests || []).concat([Object.assign({ date: Date.now() }, r)]).slice(-30); save(d); }
  function getTests() { return load().tests || []; }
  function lastTest() { const t = getTests(); return t.length ? t[t.length - 1] : null; }
  // in-progress test survives a refresh
  function saveActiveTest(t) { const d = load(); if (t) d.activeTest = t; else delete d.activeTest; save(d); }
  function getActiveTest() { return load().activeTest || null; }

  window.Store = {
    CONFIDENCE, CONFIDENCE_LABEL,
    getConfidence, setConfidence, getQuizHistory, addQuizResult, bestScore, lastScore,
    unitSummary, getTheme, setTheme, resetUnit,
    addTestResult, getTests, lastTest, saveActiveTest, getActiveTest
  };
})();
