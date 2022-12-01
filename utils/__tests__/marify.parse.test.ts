import { describe, expect, it } from "vitest";

import parse from "./../marify.parse";
import input from "./marien-input.txt?raw";
import output from "./marien-output";

describe("Marinify Menu Parsing - http://www.restaurant-marienhof.at/restaurant/pdf/wochenmenue.pdf", () => {
  it("Should parse input accordingly", () => {
    expect(parse(input).days).toEqual(output);
    expect(parse(input).weekDateRange).toEqual("28.11.–02.12.2022");
  });
});
