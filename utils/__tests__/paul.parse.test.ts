import { describe, expect, it } from "vitest";

import parse from "./../paul.parse";
import input from "./paul-input.txt?raw";
import output from "./paul-output";

describe("Paul Menu Parsing - http://www.paulandthemonkeys.at/wochenkarte/wochenkarte_download/", () => {
  it("Should parse input accordingly", () => {
    expect(parse(input).days.length).toEqual(output.length);

    expect(parse(input).weekDateRange).toEqual(
      "von Montag, 28. November 2022 bis Freitag, 2. Dezember 2022"
    );
  });
});
