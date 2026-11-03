# Adding a unit

The site is plain HTML/CSS/JS with no build step — open `index.html` directly. Each test lives in its own folder under `units/`.

## The short version (what you do)

1. Paste me the topic checklist for the new test (the same format you used for Unit 2), and drop the chapter PDF into the new unit folder if you have one (e.g. `units/unit-3/source.pdf`). The PDF is **source material only** — the site never loads it.
2. I write the unit's data files and add one entry to `units/registry.js`.
3. Refresh `index.html`. The new unit card appears with its own progress tracking.

Progress (confidence marks, quiz history) is stored in the browser's `localStorage` per unit, so adding a unit never disturbs another.

## The long version (how a unit is built)

### Folder layout

```
units/
  registry.js              ← list of units; one entry per test
  unit-2/
    unit.js                ← registers window.UNIT_DATA['unit-2'] = { title, intro, sections: [] } + shared helpers
    sections-1-4.js        ← each file pushes sections into UNIT_DATA['unit-2'].sections
    section-5a.js
    ...
```

A unit can be one file or many; `registry.js` lists them in load order:

```js
{ id: 'unit-3', title: 'Unit 3 — …', subtitle: 'Chapter 3 review', files: ['units/unit-3/unit.js', 'units/unit-3/sections.js'] }
```

Scripts are loaded by injecting `<script>` tags (not `fetch`/modules), which is why everything works over `file://`.

### Data shape

```
unit
 ├─ title, intro (markdown)
 └─ sections[]   { id: '3-1', title, skip?: true, topics[] }
      └─ topics[]  { id, title, notes, explore, practice[], quiz[], quizCount? }
```

- **notes** — markdown subset (headings, bold/italic, lists incl. nested, tables, `>` callouts, `$…$`/`$$…$$` KaTeX, `[[term]]` highlight).
- **explore** — `{ type: 'trig' | 'unitCircle' | 'inverse' | 'model' | 'custom', intro?, tasks?, …options }`.
- **practice** — `{ q, hint?, answer, solution?, graph?(container), answerGraph?(container) }`. Revealed in stages; nothing shows by default. `answerGraph` is only drawn once the answer is revealed (use it for "sketch this" problems).
- **figures** — register `window.FIGURES['id'] = () => '<svg…>'` (Unit 4's `unit.js` has a small SVG builder, `U4.SV`) and put `{{fig:id}}` on its own line in any markdown. Colors come from CSS classes so diagrams follow light/dark mode.
- **quiz** — array of generator functions `(rng, {M, R, Explore}) → question`. See `docs/unit-template/data.js` for every question type and the rng API.
- **sketch questions** — `{ type: 'sketch', prompt, sketch: { view, snapX, snapY, targets: [{ label, kind: 'point'|'hline', x, y }], answerFns } }`. The student places each target on a blank grid; each one is graded (partial credit). Name the generator function `sketch…` so the practice-test "include sketch questions" toggle can find it. Targets must sit on the snap grid (the smoke test checks).
- **practice tests** — `test.html` builds mixed tests from every registered unit's quiz generators automatically; nothing extra is needed per unit.

`docs/unit-template/data.js` is a complete, commented skeleton — copy it to start a unit by hand.

### Writing tips that keep it "non-obvious"

- Practice answers go in `answer`/`solution`, never in `q`.
- Quiz generators should randomize the *numbers* every call so only the *method* can be memorized.
- Multiple-choice distractors should be real mistakes (period used as B, sign of D flipped, forgot the π, …).
- Use `modulo` on a field when several answers are legitimately equivalent (e.g. phase displacement ± a period).

### Conventions used in Unit 2

- General sinusoid form: `y = C + A·cos(B(x − D))` (Foerster): A amplitude, B = 360°/period (or 2π/period), C sinusoidal axis, D phase displacement.
- **Inverse trig notation:** both `arcsin x` and `sin⁻¹ x` are fine (they mean the same principal-value function). Unit 2 is written with `cos⁻¹`/`sin⁻¹`; Unit 4 uses `arcsin`, `arccos`, `arctan`, `arccot`, `arcsec`, `arccsc` to match the class. In LaTeX use `\arcsin`, `\arccos`, `\arctan`, and `\operatorname{arccot}` / `\operatorname{arcsec}` / `\operatorname{arccsc}`. When the distinction matters, say **principal value** (one answer) vs. **all values** (general solution) in words.
- **Inverse cot/sec/csc ranges (precalc convention):** arccot (0, π); arcsec [0, π] with y ≠ π/2; arccsc [−π/2, π/2] with y ≠ 0.

## Checking a unit

`node docs/smoke-test.js` loads every unit headlessly and runs each quiz generator 60 times, flagging anything that throws, has non-finite answers, duplicate choices, or a self-grade failure. Run it after adding or editing content.
