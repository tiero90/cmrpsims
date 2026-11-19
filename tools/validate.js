// Quality gate for the CMRP question bank. Run: node tools/validate.js
// Exits with code 1 if any hard rule fails. Prints warnings for soft rules.
const fs = require("fs"), path = require("path");
const Q = path.join(__dirname, "../src/questions/");
global.QB = {};
for (const i of [1, 2, 3, 4, 5]) eval(fs.readFileSync(Q + "p" + i + ".js", "utf8"));

const errors = [], warns = [];
const err = (id, m) => errors.push(id + ": " + m), warn = (id, m) => warns.push(id + ": " + m);

// Rule: questions must not ask who invented/named something or where it originated.
const INVENTOR = /\b(developed by|invented by|named after|who (led|developed|created|invented|named)|first company|originated in|was first developed|founder of)\b/i;
// Rule: no answer option may be just a person's name (tests "who", not "what for").
const PEOPLE = /\b(Maslow|Herzberg|McGregor|Vroom|Tuckman|Kotter|Lewin|Kouzes|Posner|Goleman|Kirkpatrick|Knowles|Hersey|Blanchard|Greenleaf|Schein|Senge|Covey|Edmondson|Ishikawa|Shewhart|Deming|Juran|Taguchi|Ohno|Shingo|Nakajima|Goldratt|Nowlan|Heap|Kaplan|Norton|Moubray|Gulati)\b/;
const ABS = /\b(only|always|never|all|none|any|every)\b/i;

let total = 0, calc = 0, longest = 0, outliers = 0, absC = 0, absD = 0;
const stems = new Map();
for (const p of [1, 2, 3, 4, 5]) {
  const bank = QB[p] || [];
  if (bank.length < 100) err("P" + p, "only " + bank.length + " questions (min 100)");
  bank.forEach((q, i) => {
    const id = p + "-" + (i + 1); total++;
    if (!Array.isArray(q) || q.length !== 7) return err(id, "must have 7 fields [stem, correct, d1, d2, d3, explanation, chapter]");
    if (q.slice(0, 6).some(s => typeof s !== "string" || !s.trim())) err(id, "empty text field");
    if (!Number.isInteger(q[6]) || q[6] < 1 || q[6] > 13) err(id, "chapter must be 1–13");
    const isCalc = q[0].startsWith("[Calc] "); if (isCalc) calc++;
    const stem = q[0].replace("[Calc] ", "").trim().toLowerCase();
    if (stems.has(stem)) err(id, "duplicate stem of " + stems.get(stem)); else stems.set(stem, id);
    const opts = q.slice(1, 5), low = opts.map(o => o.trim().toLowerCase());
    if (new Set(low).size < 4) err(id, "duplicate options");
    for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++)
      if (a !== b && low[a].length > 12 && low[b].includes(low[a])) warn(id, "option contains another option: \"" + opts[a] + "\"");
    if (INVENTOR.test(q[0])) err(id, "asks about an inventor/origin: " + q[0]);
    opts.forEach(o => { if (PEOPLE.test(o) && o.trim().split(/\s+/).length <= 3) err(id, "option is a person's name: " + o); });
    // Length bias
    const L = opts.map(o => o.length), mx = Math.max(...L.slice(1));
    if (L[0] > mx) longest++;
    if (L[0] > 1.5 * mx && L[0] - mx > 15) { outliers++; err(id, "correct answer is much longer than every distractor (" + L.join("/") + ")"); }
    if (ABS.test(q[1])) absC++; opts.slice(1).forEach(o => { if (ABS.test(o)) absD++; });
    // Explanation format
    const e = q[5];
    if (isCalc) {
      if (!/Rumus/.test(e) || !/Langkah/.test(e)) err(id, "calculation explanation needs 'Rumus' and 'Langkah' sections");
    } else {
      if (!/Mengapa pilihan lain kurang tepat/.test(e)) err(id, "explanation needs a 'Mengapa pilihan lain kurang tepat' section");
      if (e.length < 200) warn(id, "explanation is short (" + e.length + " chars)");
    }
  });
}
const pctLongest = 100 * longest / total, pctAbsD = 100 * absD / (3 * total), pctAbsC = 100 * absC / total;
if (pctLongest > 35) errors.push("BANK: correct answer is the longest option in " + pctLongest.toFixed(1) + "% of questions (max 35%, chance ≈ 25%)");
if (pctAbsD > pctAbsC + 3) warns.push("BANK: absolute words appear in " + pctAbsD.toFixed(1) + "% of distractors vs " + pctAbsC.toFixed(1) + "% of correct answers");

console.log("Questions: " + total + " (" + calc + " calculation) | correct-longest " + pctLongest.toFixed(1) + "% | outliers " + outliers);
warns.forEach(w => console.log("WARN  " + w));
errors.forEach(e => console.log("ERROR " + e));
console.log(errors.length ? "FAILED: " + errors.length + " error(s)" : "PASSED");
process.exit(errors.length ? 1 : 0);
