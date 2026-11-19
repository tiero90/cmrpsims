---
name: cmrp-question-bank
description: Maintain and extend the CMRP exam simulator in this repo (tiero90/cmrpsims) — add or revise multiple-choice questions, write explanations, fix the app, build index.html, validate quality, and publish to GitHub Pages. Use whenever the task touches src/questions/, src/app.html, the question bank, explanations, calculation questions, distractors, or deploying the simulator.
---

# CMRP question bank & simulator

Practice app for the **CMRP** (Certified Maintenance & Reliability Professional) exam, based on
*Maintenance and Reliability Best Practices* (Ramesh Gulati, 3rd ed.) and the 5 SMRP Body of Knowledge pillars.
Live site: https://tiero90.github.io/cmrpsims/ (GitHub Pages, branch `main`, root).

The owner writes in **Bahasa Indonesia**. Reply in Indonesian unless asked otherwise.

## Repo layout

| Path | What it is |
|---|---|
| `src/questions/p1.js` … `p5.js` | Question bank, one file per pillar (`QB[n]=[ ... ];`) |
| `src/app.html` | The whole app (HTML/CSS/JS). Contains the placeholder `/*QB*/` where data is injected |
| `tools/build.js` | Builds `index.html` (standalone site) and `dist/artifact.html` (Claude artifact body) |
| `tools/validate.js` | Quality gate — **must pass before every commit** |
| `tools/audit.js` | Quick length-bias report per pillar |
| `tools/mpatch.js` | Patch options/explanations by id from a JSON file |
| `index.html` | Build output served by GitHub Pages — never edit by hand |

Pillars: 1 Business & Management · 2 Manufacturing Process Reliability · 3 Equipment Reliability ·
4 Organization & Leadership · 5 Work Management. Book chapter ↔ pillar map and key Gulati figures:
see [references/gulati-facts.md](references/gulati-facts.md).

## Question format

Each question is one array with exactly 7 fields:

```js
["Stem text?", "Correct answer", "Distractor 1", "Distractor 2", "Distractor 3", "Explanation (Indonesian)", chapter]
```

- The **correct answer is always field 1**. The app shuffles options at runtime — never reorder fields.
- `chapter` = Gulati chapter number 1–13 (shown as "Gulati, Bab N" in the app).
- A stem starting with `[Calc] ` marks a calculation question (shown with a "Hitungan" label; the prefix is stripped in the UI).
- Question ids are positional: `pillar-index` (e.g. `3-17` = 17th entry of `p3.js`). Players' progress in localStorage
  is keyed by id, so **append new questions at the end** and replace in place; do not delete or reorder.
- Stems and options are in **English** (like the real exam); explanations are in **Bahasa Indonesia**.

## Quality rules (from the owner's feedback — do not regress)

1. **No guessable answers.** The correct option must not stand out by length, detail, or wording.
   - Write all four options in the same grammatical form and similar length; often make the correct one shorter.
   - Distractors must be plausible and from the same domain: neighbouring concepts (MTBF vs MTTR, vision vs mission,
     p-chart vs c-chart), common misconceptions, and near-miss numbers (wrong formula, forgotten step).
   - Avoid absolute words (only/always/never/all/every) in distractors unless the correct answer uses them too.
   - No "all of the above"/"none of the above" (options are shuffled).
   - No two distractors that mean the same thing.
2. **No inventor/history trivia.** Never ask who invented, named, or first developed a method, or where/when it
   originated. Ask what the method is for, when to use it, or how to apply it. A name may appear in the stem only as a
   label for the model being tested (e.g. "first step of Kotter's model"), never as an answer option.
3. **Detailed explanation for every question**, in Indonesian:
   - Non-calculation:
     ```
     <Concept explanation: definition, Gulati benchmark/context, why the correct answer is right.>

     Mengapa pilihan lain kurang tepat:
     • <short paraphrase of distractor>: <why it is wrong / what it actually describes>
     • ...
     • ...

     Ingat: <optional memory tip>
     ```
   - Calculation (`[Calc]`):
     ```
     Rumus:
       <formula with variable meanings>

     Diketahui:
       <each given value>

     Langkah:
     1) ...
     2) ...

     Jawaban: <result>.
     Jebakan: <which distractor comes from which common mistake>
     ```
   - Use `\n` for line breaks inside the JS string (the app renders with `white-space: pre-line`).
4. **Verify every number.** Recompute every calculation answer and every numeric distractor with a quick
   `node -e` script before saving. Distractors should come from realistic mistakes (e.g. forgetting to subtract breaks,
   using 3σ instead of 6σ, reversing a ratio).
5. **Ground facts in Gulati.** Prefer the book's figures (see references). If a fact is not in the book, use widely
   accepted M&R knowledge and do not attribute it to Gulati.
6. **Balance across pillars.** When adding a batch, add equally to each pillar unless told otherwise.
7. **Original wording.** Do not copy the book's self-assessment questions verbatim.

## Workflows

### Add questions
1. Read the existing questions on the topic (`grep -n "keyword" src/questions/p*.js`) to avoid duplicates.
2. Append new arrays at the **end** of the right `pN.js` (keep `QB[N]=[\n...\n];` structure, one question per line).
3. For calculation questions, compute answers with `node -e` first.
4. `node tools/validate.js` → fix every ERROR; review WARNs.

### Revise distractors or explanations
- Small edits: write a JSON patch `[[pillar, index, slot, "new text"], ...]` (slot 1–4 = options with 1 = correct,
  5 = explanation) and run `node tools/mpatch.js patch.json`. When a distractor changes, update the matching bullet
  in the explanation too.
- Then `node tools/validate.js`.

### Change the app
- Edit `src/app.html` only. Keep the `/*QB*/` placeholder. Settings and history live in `localStorage`
  (keys `cmrp_session_v1`, `cmrp_history_v1`, `cmrp_qstats_v1`, `cmrp_cfg_v1`) — wrap access in try/catch and merge
  saved config with defaults (a past bug crashed the home page when a partial config was saved).
- Smoke-test with Playwright (pre-installed: `require('playwright')`): open `index.html`, start an exam, answer all
  110 questions, submit, open review, run a topic search and a practice session; check for page errors and that
  `document.documentElement.scrollWidth` ≤ viewport width at 420px.

### Build & publish
```bash
node tools/validate.js && node tools/build.js
git add -A && git commit -m "<what changed>" && git push origin main
```
GitHub Pages redeploys in 1–2 minutes. If the owner also uses the Claude artifact version, republish
`dist/artifact.html` there (same content, without the standalone `<head>` wrapper).

## App features (for reference when answering questions)
- Exam mode: 110 questions / 150 minutes (configurable per-pillar distribution, default 22 each), timer keeps running
  when the tab is hidden and auto-submits at 0, flag & navigator grid, review filtered by wrong / flagged / all.
- Practice mode: per pillar, mixed, or calculation-only; instant answer + explanation; option to prioritise
  unseen/wrong questions.
- Topic search: matches stem, options, and explanation (all words must match); "practice these N questions".
- 70% is a personal practice target, **not** the official pass mark (SMRP uses scaled scoring).
