import { describe, expect, it } from "vitest";

import parse from "./../limonis.parse";
import input from "./limonis-input.txt?raw";
import output from "./limonis-output";

describe("Limonis Menu Parsing - http://www.paulandthemonkeys.at/wochenkarte/wochenkarte_download/", () => {
  it("Should parse input accordingly", () => {
    expect(parse(input).days).toEqual(output);

    expect(parse(input).weekDateRange).toEqual(
      "BIO TAGESGERICHTE KW 28 / 10.07. BIS 14.07."
    );
  });
});
