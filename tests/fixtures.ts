import { readFileSync } from "node:fs";

/** A valid pack with a proof, an idea and an exchange block (the example in examples/). */
export const GOOD_PACK = readFileSync(new URL("../examples/oxygen-pack.md", import.meta.url), "utf8");
