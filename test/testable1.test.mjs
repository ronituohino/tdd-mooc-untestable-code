import { describe, test } from "vitest";
import { expect } from "chai";
import { daysUntilChristmas } from "../src/testable1.mjs";

describe("Testable 1: days until Christmas", () => {
  test("returns correct values over a year for a random year between 0 and 3000", () => {
    // YYYY-MM-DDTHH
    const millisPerDay = 24 * 60 * 60 * 1000;
    const startDate = new Date(Math.floor(Math.random() * 3000), 11, 25, 12);
    for (let i = 0; i < 365; i++) {
      expect(daysUntilChristmas(new Date(startDate.getTime() - millisPerDay * i))).to.equal(i);
    }
  });
  test("returns 1 even if there is just a second left until Christmas (24th)", () => {
    expect(daysUntilChristmas(new Date(2026, 11, 24, 23, 59, 59))).to.equal(1);
  });
  test("returns 364 as soon as day changes (26th)", () => {
    expect(daysUntilChristmas(new Date(2026, 11, 26))).to.equal(364);
  });
});
