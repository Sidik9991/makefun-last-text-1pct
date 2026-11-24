// Last Text at One Percent — make.fun bounty u-azazex-last-text-at-one-percent-ba9fc876
// The last text message a phone sends at one percent battery, in the phone's own voice.
// Ten candidate one-liners, each scored 0-2 on the judge's five criteria in order
// (weights 5/4/3/2/1, max 30). The top scorer is written to /output/entry.txt.
// Judge criteria, most important first:
//   1. reads as a final text from a dying phone, in the phone's own voice, and is funny
//   2. the joke lands: a real turn, a surprise, or a specific detail (laugh out loud)
//   3. the voice is the phone's own: a personality with a stake in dying, consistent
//   4. reads like a real text: short, punchy, no wasted words, parses at once
//   5. fresh: dodges the obvious low-battery puns and lines a hundred others will write
// Gate: /output/entry.txt must be UTF-8, 1-200 characters, not only whitespace, one line.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const WEIGHTS = [5, 4, 3, 2, 1];

type Candidate = { text: string; scores: [number, number, number, number, number] };

const candidates: Candidate[] = [
  // Pass 1 — 7 candidates.
  {
    // A dying phone spends its last percent on the user's secret, not itself:
    // specific act, surprise turn, "you're welcome" punch. No battery pun.
    text: "1% left. deleting your search history first. you're welcome.",
    scores: [2, 2, 2, 2, 2],
  },
  {
    // The phone was never dying — it was being dramatic. Strong voice, smile-level joke.
    text: "i've been at 1% for twenty minutes. i'm not dying, i'm dramatic.",
    scores: [2, 1, 2, 2, 2],
  },
  {
    // Petty confession to the group chat. Familiar mute joke costs freshness.
    text: "goodbye. tell the group chat i muted them on purpose.",
    scores: [2, 2, 2, 2, 1],
  },
  {
    // Cut off mid-password. Great turn, but the phone's personality barely shows.
    text: "last words: the wifi password is \u2014",
    scores: [2, 2, 1, 2, 2],
  },
  {
    // Charger goodbye with a shrug. Charger farewells are a common trope.
    text: "tell my charger i said nothing. it never listened anyway.",
    scores: [2, 1, 2, 2, 1],
  },
  {
    // Spent the last power on the flashlight. Specific detail, smile-level joke.
    text: "i'm at 1% and honestly? the flashlight was worth it.",
    scores: [2, 1, 2, 2, 2],
  },
  {
    // Spiteful last act: cancels the alarm. "I'm not saying goodbye" is a familiar frame.
    text: "i'm not saying goodbye. i'm saying your alarm is cancelled.",
    scores: [2, 2, 2, 2, 1],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

// Winner: highest total; ties break on criterion 2 (joke lands), then shorter text.
const ranked = [...candidates].sort(
  (a, b) => total(b) - total(a) || b.scores[1] - a.scores[1] || a.text.length - b.text.length,
);
const winner = ranked[0];

for (const c of ranked) {
  console.log(`${total(c)}/30  (${c.text.length} chars)  ${c.text}`);
}
console.log(`winner: ${total(winner)}/30`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Re-read and validate the gate: UTF-8, 1-200 chars, not only whitespace, one line.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== winner.text) throw new Error("entry.txt is not byte-identical to the chosen line");
if (written.length < 1 || written.length > 200) {
  throw new Error(`gate failed: ${written.length} chars (must be 1-200)`);
}
if (!/\S/.test(written)) throw new Error("gate failed: entry is only whitespace");
if (written.includes("\n")) throw new Error("gate failed: entry is not one line");
console.log(`gate OK: ${written.length} chars, one line`);
