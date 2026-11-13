import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Load API keys and settings for the command-line tools from `.env.local`, then `.env`, in the
 * current folder (Node's built-in loader; variables already set in the shell always win).
 * Returns the files that were read.
 */
export function loadLocalEnv(dir: string = process.cwd()): string[] {
  const loaded: string[] = [];
  const load = (process as { loadEnvFile?: (file: string) => void }).loadEnvFile;
  if (typeof load !== "function") return loaded;
  const shell = new Set(Object.keys(process.env));
  for (const name of [".env.local", ".env"]) {
    const file = path.join(dir, name);
    if (!existsSync(file)) continue;
    const before = { ...process.env };
    load(file);
    // Node's loader overwrites; keep the shell's values and the earlier (more local) file's values.
    for (const [k, v] of Object.entries(before)) if (shell.has(k) || loaded.length) process.env[k] = v;
    loaded.push(name);
  }
  return loaded;
}
