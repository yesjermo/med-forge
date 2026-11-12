import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { InputError, checkInput } from "../src/engine/run";

const exec = promisify(execFile);

/** Run the CLI the way `npm run cli -- …` does, returning exit code and output. */
async function cli(args: string[], stdin?: string) {
  const p = exec("npx", ["tsx", "src/cli.ts", ...args], { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } });
  if (stdin !== undefined) {
    p.child.stdin?.end(stdin);
  }
  try {
    const { stdout, stderr } = await p;
    return { code: 0, stdout, stderr };
  } catch (err) {
    const e = err as { code: number; stdout: string; stderr: string };
    return { code: e.code, stdout: e.stdout, stderr: e.stderr };
  }
}

describe("CLI", () => {
  it("prints help and exits 0 for --help, -h and help", async () => {
    for (const flag of ["--help", "-h", "help"]) {
      const r = await cli([flag]);
      expect(r.code, flag).toBe(0);
      expect(r.stdout).toContain("Usage:");
    }
  }, 30_000);

  it("explains a missing file instead of printing ENOENT", async () => {
    const r = await cli(["lint", "does-not-exist.md"]);
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/Can't read does-not-exist\.md: file not found/);
    expect(r.stderr).not.toMatch(/ENOENT/);
  }, 30_000);

  it("rejects input too short to be source material, before calling any model", async () => {
    const r = await cli(["generate", "--pack", "premed", "--providers", "none"], "hi");
    expect(r.code).toBe(1);
    expect(r.stderr).toMatch(/too short/);
    expect(r.stderr).not.toMatch(/\[writing\]/);
  }, 30_000);

  it("writes no terminal colour codes when output isn't a terminal", async () => {
    const r = await cli(["lint", "examples/oxygen-pack.md"]);
    expect(r.code).toBe(0);
    expect(r.stdout + r.stderr).not.toMatch(/\x1b\[/);
  }, 30_000);
});

describe("input checks", () => {
  it("rejects a few words but accepts a short real statement", () => {
    expect(() => checkInput("hi")).toThrow(InputError);
    expect(() => checkInput("just two words")).toThrow(/too short/);
    expect(checkInput("Insulin lowers blood glucose by moving GLUT4 to the membrane.")).toMatch(/^Insulin/);
  });
});
