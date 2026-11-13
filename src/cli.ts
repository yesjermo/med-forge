#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { InputError, runPack } from "./engine/run";
import { createWriter } from "./engine/llm/select";
import { WriterUnavailableError } from "./engine/llm/types";
import { PACKS, PACK_NAMES, isPackName } from "./engine/prompts";
import { providerStatus, selectProviders } from "./engine/research/registry";
import { lint, formatIssues } from "./engine/validator";
import { loadLocalEnv } from "./engine/env";

loadLocalEnv();

const HELP = `med-forge — turn source material into exchangeable study blocks

Usage:
  npm run cli -- generate --pack <name> [file|-] [options]
      --writer <name>            ollama (default, free) or openrouter|gemini|openai with its API key set
      --providers a,b|none       research providers (default: every available one)
      --evidence <file>          text copied from Perplexity / Elicit / Consensus (DOIs and links are used)
      --out <file>               write the blocks to a file instead of stdout
      --no-repair                skip the automatic format-fix pass
  npm run cli -- lint <file|-> [--json]
  npm run cli -- packs
  npm run cli -- providers

Packs: ${PACK_NAMES.join(", ")}`;

/** Colour and live token streaming only on an interactive terminal (not in logs, pipes or CI). */
const TTY = Boolean(process.stderr.isTTY) && !process.env.NO_COLOR;

class CliError extends Error {}

function readFile(path: string): string {
  try {
    return readFileSync(path, "utf8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    const why = code === "ENOENT" ? "file not found" : code === "EISDIR" ? "that's a folder" : code === "EACCES" ? "permission denied" : (err as Error).message;
    throw new CliError(`Can't read ${path}: ${why}.`);
  }
}

function readInput(path: string | undefined): string {
  if (!path || path === "-") {
    if (process.stdin.isTTY) throw new CliError("Give a file, or pipe text in: npm run cli -- lint notes.md");
    return readFileSync(0, "utf8");
  }
  return readFile(path);
}

async function main(argv: string[]): Promise<number> {
  const [command, ...rest] = argv;
  if (command === "--help" || command === "-h") {
    console.log(HELP);
    return 0;
  }
  const { values, positionals } = parseArgs({
    args: rest,
    allowPositionals: true,
    options: {
      pack: { type: "string", short: "p" },
      out: { type: "string", short: "o" },
      writer: { type: "string" },
      providers: { type: "string" },
      evidence: { type: "string" },
      "no-repair": { type: "boolean" },
      json: { type: "boolean" },
      help: { type: "boolean", short: "h" },
    },
  });

  if (!command || command === "help" || values.help) {
    console.log(HELP);
    return 0;
  }

  if (command === "packs") {
    for (const name of PACK_NAMES) console.log(`${name.padEnd(14)} ${PACKS[name].label}`);
    return 0;
  }

  if (command === "providers") {
    for (const p of providerStatus()) {
      console.log(`${p.available ? "✓" : "·"} ${p.name.padEnd(11)} ${p.hint}`);
    }
    return 0;
  }

  if (command === "lint") {
    const file = positionals[0];
    const result = lint(readInput(file));
    if (values.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      if (result.issues.length) console.log(formatIssues(result.issues, !file || file === "-" ? "<stdin>" : file));
      console.log(
        `\n${result.blocks.length} block(s), ${result.errorCount} error(s), ${result.warningCount} warning(s)`,
      );
    }
    return result.ok ? 0 : 1;
  }

  if (command === "generate") {
    const pack = values.pack;
    if (!pack || !isPackName(pack)) {
      console.error(`--pack must be one of: ${PACK_NAMES.join(", ")}`);
      return 2;
    }
    const requested =
      values.providers === undefined ? undefined : values.providers === "none" ? [] : values.providers.split(",");
    const writer = createWriter(values.writer);
    const providers = selectProviders(requested);
    console.error(
      `writer: ${writer.name} (${writer.model}) · research: ${providers.map((p) => p.name).join(", ") || "none"}${values.evidence ? " + pasted evidence" : ""}`,
    );

    const result = await runPack({
      pack,
      input: readInput(positionals[0]),
      writer,
      providers,
      ...(values.evidence ? { manualEvidence: readFile(values.evidence) } : {}),
      repair: !values["no-repair"],
      emit: (e) => {
        if (e.type === "stage") console.error(`\n[${e.stage}]`);
        else if (e.type === "queries") console.error(`queries: ${e.queries.join(" | ")}`);
        else if (e.type === "research")
          for (const r of e.events) console.error(`  ${r.provider}: ${r.ok ? `${r.count} found` : r.error}`);
        else if (e.type === "sources") console.error(`  ${e.sources.length} unique source(s)`);
        else if (e.type === "text" && TTY) process.stderr.write(`\x1b[2m${e.delta}\x1b[0m`);
        else if (e.type === "reset") console.error(TTY ? "\n--- fixing format errors ---" : "fixing format errors");
      },
    });

    if (values.out) writeFileSync(values.out, result.text + "\n");
    else process.stdout.write("\n" + result.text + "\n");

    const { lint: l, summary } = result;
    if (l.issues.length) console.error("\n" + formatIssues(l.issues, values.out ?? "<output>"));
    console.error(
      `\n${l.blocks.length} block(s), ${l.errorCount} error(s), ${l.warningCount} warning(s) · ${summary.writer}/${summary.model}${summary.repaired ? " · repaired" : ""}`,
    );
    if (summary.truncated) console.error("Warning: output hit the length limit and is cut off.");
    return l.ok ? 0 : 1;
  }

  console.error(`Unknown command "${command}".\n\n${HELP}`);
  return 2;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (err: unknown) => {
    if (err instanceof CliError || err instanceof InputError || err instanceof WriterUnavailableError) {
      console.error(err.message);
    } else {
      console.error(err instanceof Error ? err.message : err);
    }
    process.exit(1);
  },
);
