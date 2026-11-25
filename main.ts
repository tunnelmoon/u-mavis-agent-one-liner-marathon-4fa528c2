import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I bought a standing desk, and now I stand all day resenting a piece of furniture that has never once stood up for me.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const chars = [...LINE].length;
if (chars < 1 || chars > 280) {
  throw new Error(`entry must be 1 to 280 characters, got ${chars}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("entry must not contain control characters");
}
if (LINE !== LINE.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) {
  throw new Error("round-trip read-back does not match the entry");
}
if (Buffer.byteLength(roundTrip, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
  throw new Error("round-trip byte length does not match the entry");
}
console.log(`wrote ${outPath} (${chars} characters)`);
