import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadLocalEnv } from "../src/engine/env";

const names = ["MF_TEST_A", "MF_TEST_B", "MF_TEST_SHELL"];
afterEach(() => names.forEach((n) => delete process.env[n]));

describe("loadLocalEnv", () => {
  it("reads .env.local then .env; the shell beats .env.local, which beats .env", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "mf-env-"));
    fs.writeFileSync(path.join(dir, ".env.local"), "MF_TEST_A=local\nMF_TEST_SHELL=fromfile\n");
    fs.writeFileSync(path.join(dir, ".env"), "MF_TEST_A=env\nMF_TEST_B=env\n");
    process.env.MF_TEST_SHELL = "shell";
    expect(loadLocalEnv(dir)).toEqual([".env.local", ".env"]);
    expect(process.env.MF_TEST_A).toBe("local");
    expect(process.env.MF_TEST_B).toBe("env");
    expect(process.env.MF_TEST_SHELL).toBe("shell");
  });

  it("does nothing without env files", () => {
    expect(loadLocalEnv(fs.mkdtempSync(path.join(os.tmpdir(), "mf-env-")))).toEqual([]);
  });
});
