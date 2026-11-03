/* Template for a new unit. Copy this folder to units/<your-unit>/, rename, fill in, and register it in units/registry.js.
   One file is fine for a small unit; for a big one, split sections across several files that each push into
   window.UNIT_DATA['<id>'].sections (see units/unit-2 for an example).
   NOTATION: arcsin/arccos/… and sin⁻¹/cos⁻¹/… are both fine (same principal-value function). Say "principal value"
   vs. "all values" in words when the distinction matters.
   FIGURES: register window.FIGURES['my-id'] = () => '<svg …>…</svg>' and put {{fig:my-id}} on its own line in any markdown
   (notes, questions, hints, solutions). Practice problems may also use answerGraph(container) — drawn only once revealed. */
(function () {
  window.UNIT_DATA = window.UNIT_DATA || {};
  const U = window.UNIT_DATA['unit-template'] = {
    title: 'Unit N — Topic',
    intro: String.raw`One or two sentences on what ties the unit together. Markdown + $\LaTeX$ allowed.`,
    sections: []
  };
  const r = String.raw;   // lets you write LaTeX without doubling backslashes (write a backtick as \`)

  U.sections.push({
    id: 'N-1', title: 'Section title',
    // skip: true,          // ← uncomment to drop a section that isn't on the test
    topics: [
      {
        id: 'N-1-example', title: 'Example topic',

        // ---- Notes: markdown subset. Supports # headings, **bold**, *italic*, `code`, - bullets, 1. numbered
        // (indent 3 spaces to nest), | tables | (header row cells in **bold**), > callouts, $inline$ and $$display$$ math,
        // and [[key term]] highlighting.
        notes: r`## Big idea

Say the one thing the student must understand. Then the method.

| **input** | **output** |
| --- | --- |
| $x$ | $f(x)$ |

> **Common mistake:** describe the trap and how to avoid it.`,

        // ---- Explore: one of the built-in explorers, or a custom one.
        // type: 'trig'        → y = C + A·fn(B(x − D)) with sliders. Options: fn, mode ('deg'|'rad'), A,B,C,D,
        //                       sliders:['A','B','C','D'], fnChoices:['sin','cos'] (or tan/cot/sec/csc), challenge:true,
        //                       modeSwitch:true, show:{parent,axis,amplitude,period,critical,asymptotes}
        // type: 'unitCircle'  → draggable unit circle. Options: startDeg, snap (15 | 'nice' | 0), showValues
        // type: 'inverse'     → inverse sin/cos with restricted branch. Options: fn, mode, relation
        // type: 'model'       → real-world sinusoids. Options: scenarios:[{name,xLabel,yLabel,fn,A,B,C,D,xMin,xMax,yMin,yMax,xStep,yStep,description}]
        // type: 'custom'      → setup(container, {Graph, M, R, Explore}) draws anything you like
        explore: {
          type: 'trig', fn: 'cos', mode: 'deg', A: 1, B: 1, C: 0, D: 0, sliders: ['A', 'B'], challenge: false,
          intro: 'One line telling the student what to look at.',
          tasks: r`1. A concrete thing to try.
2. A prediction to make before checking.`
        },

        // ---- Practice: hand-written problems. Nothing is shown until the student clicks (hint → answer → solution).
        practice: [
          { q: r`Problem statement with $math$.`, hint: 'A nudge, not the answer.', answer: r`$42$`, solution: r`Full worked reasoning.` },
          // optional: graph(container) to draw a figure under the question, e.g. graph: U2.graphOf({fn:'cos',A:2,B:1,C:0,D:0,mode:'deg'})
        ],

        // ---- Quiz: generator functions (rng, helpers) → question. Called with a seeded rng so "retry" reproduces a question.
        // rng.int(lo,hi) rng.pick(arr) rng.shuffle(arr) rng.bool(p) rng.sign()
        // Question types:
        //   { type:'number', prompt, answer, tol, unit?, parse?: 'number'|'pi'|'exact'|'dms'|'any', modulo?, alsoAccept?:[...], answerText?, explanation }
        //   { type:'text',   prompt, check(input)→bool, answerText, explanation, placeholder? }
        //   { type:'mc',     prompt, choices:[{text, correct}], explanation }        (choices are shuffled for you)
        //   { type:'multi',  prompt, fields:[{label, answer, tol?, parse?, modulo?, answerText?}], explanation }
        //   { type:'set',    prompt, answers:[numbers], tol?, parse?, answerText?, explanation }   (order-free list)
        // Any question may add graph(container) to draw a figure, and explainGraph(container) shown after grading.
        quiz: [
          function (rng) {
            const a = rng.int(2, 9), b = rng.int(2, 9);
            return {
              type: 'number', prompt: 'What is $' + a + ' \\times ' + b + '$?', answer: a * b, tol: 0,
              explanation: '$' + a + ' \\times ' + b + ' = ' + (a * b) + '$.'
            };
          },
          function (rng) {
            const x = rng.pick([30, 60]);
            return {
              type: 'mc', prompt: 'Which is $\\sin ' + x + '^\\circ$?',
              choices: [{ text: '$' + M.formatExact(Math.sin(x * M.DEG), true) + '$', correct: true }, { text: '$' + M.formatExact(Math.cos(x * M.DEG), true) + '$', correct: false }, { text: '$1$', correct: false }],
              explanation: 'Use the special-triangle table.'
            };
          }
        ]
        // quizCount: 8   // optional: questions per quiz run (default 5–8 depending on generator count)
      }
    ]
  });
})();
