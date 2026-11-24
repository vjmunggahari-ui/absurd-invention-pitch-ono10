import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// One-sentence absurd invention pitch: a mug that reheats cold coffee
// with the sheer heat of its own disapproval.
const ENTRY =
  "The Reheat Butler: a mug that notices your coffee going cold and reheats itself with the sheer heat of its disapproval until the steam returns.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || join(process.cwd(), "output");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read-back self-check: the gate is 1-220 UTF-8 chars, not only
// whitespace, no trailing newline, exactly one sentence.
const back = readFileSync(outPath, "utf8");
if (back !== ENTRY) throw new Error("entry.txt read-back mismatch");
if (back.length < 1 || back.length > 220) {
  throw new Error(`entry length ${back.length} outside the 1-220 gate`);
}
if (back.trim().length === 0) throw new Error("entry is only whitespace");
if (back.endsWith("\n")) throw new Error("entry has a trailing newline");
if (back.includes("\n") || back.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (Buffer.byteLength(back, "utf8") !== back.length) {
  throw new Error("entry must be plain ASCII for the byte-size tie-break");
}
const terminators = (back.match(/[.!?]/g) || []).length;
if (terminators !== 1) {
  throw new Error(`entry must be exactly one sentence (found ${terminators} terminators)`);
}
console.log(`wrote ${outPath} (${back.length} chars)`);
