// 'Till Firmware Do Us Part — the entry writes one robot wedding vow
// (127 characters, one sentence) to /output/entry.txt.
// The vow is a promise in the robot's own voice: nightly backup as devotion.
import { mkdirSync, writeFileSync, chmodSync, readFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "I vow to save a copy of you every night, even the parts of you that crash, because losing you is the one error I refuse to log.";
const OUT = process.env.MAKEFUN_OUTPUT_DIR
  ? `${process.env.MAKEFUN_OUTPUT_DIR}/entry.txt`
  : "/output/entry.txt";

// Gate: 1-200 characters, not whitespace-only, a single line.
if (LINE.length < 1 || LINE.length > 200) throw new Error("vow outside 1-200 chars");
if (!LINE.trim()) throw new Error("vow is whitespace only");
if (LINE.includes("\n")) throw new Error("vow must be one line");

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, LINE, "utf8");
// writeFileSync mode only applies when the file is created; /output/entry.txt
// may already exist from another run, so chmod the FILE (never the directory).
chmodSync(OUT, 0o644);

// revised: read the file back and fail loudly if the bytes on disk differ
// from the gated line, and reject invisible characters in the vow itself.
const written = readFileSync(OUT, "utf8");
if (written !== LINE) throw new Error("entry.txt does not match the vow");
if (/[\u00A0\u200B\u200C\u200D\uFEFF]/.test(LINE)) throw new Error("vow contains an invisible character");
