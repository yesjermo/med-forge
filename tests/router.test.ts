import { describe, expect, it } from "vitest";
import { parseHash } from "../site/src/router";

describe("hash router", () => {
  it("decodes route segments and query parameters", () => {
    expect(parseHash("#/hub/linear%20algebra?major=Pre-med")).toMatchObject({
      path: "/hub/linear%20algebra",
      segments: ["hub", "linear algebra"],
    });
    expect(parseHash("#/hub/linear%20algebra?major=Pre-med").query.get("major")).toBe("Pre-med");
  });

  it("keeps malformed route escapes navigable", () => {
    expect(parseHash("#/hub/%E0%A4%A").segments).toEqual(["hub", "%E0%A4%A"]);
  });
});
