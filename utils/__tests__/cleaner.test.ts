import { describe, expect, it } from "vitest";

import cleaner from "./../cleaner";

describe("cleaner", () => {
  it("should cleam strings", () => {
    expect(cleaner("Schweinmit ")).toEqual("Schwein mit ");
    expect(cleaner("Reis& Erbsen")).toEqual("Reis & Erbsen");
  });
});
