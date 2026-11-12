import { describe, expect, it } from "vitest";
import { formatId, nextId, parseId } from "../src/engine/ids";

describe("ids", () => {
  it("formats and parses IDs", () => {
    const id = formatId("PREMED", "oxyhb", 1);
    expect(id).toBe("PRE-OXYHB-0001");
    expect(parseId(id)).toEqual({ prefix: "PRE", topic: "OXYHB", seq: 1 });
  });

  it("uses NUR for nursing", () => {
    expect(formatId("NURSING", "QFT", 12)).toBe("NUR-QFT-0012");
  });

  it("rejects bad IDs", () => {
    expect(parseId("ENG-TH-0001")).toBeNull();
    expect(parseId("XYZ-THERM-0001")).toBeNull();
    expect(parseId("PRE-OXYHB-1")).toBeNull();
    expect(() => formatId("VETERINARY", "a1", 1)).toThrow();
    expect(() => formatId("VETERINARY", "BSM", 0)).toThrow();
  });

  it("finds the next free sequence for a topic", () => {
    const used = ["PRE-OXYHB-0001", "PRE-OXYHB-0003", "PRE-RF-0009", "MED-OXYHB-0007"];
    expect(nextId(used, "PREMED", "OXYHB")).toBe("PRE-OXYHB-0004");
    expect(nextId([], "MEDICINE", "sepsis")).toBe("MED-SEPSIS-0001");
  });
});
