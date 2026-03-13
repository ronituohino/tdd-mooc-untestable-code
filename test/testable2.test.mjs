import { describe, test } from "vitest";
import { expect } from "chai";
import { diceHandValue, diceRoll } from "../src/testable2.mjs";

describe("Testable 2: a dice game", () => {
  test("can roll uniform dice values between 1 and 6", () => {
    const diceRolls = {};
    const diceThrows = 6000;
    const validRolls = [1, 2, 3, 4, 5, 6];

    for (let i = 0; i < diceThrows; i++) {
      const roll = diceRoll();
      if (!(roll in diceRolls)) {
        diceRolls[roll] = 1;
      } else {
        diceRolls[roll] += 1;
      }
    }

    let sum = 0;
    Object.values(diceRolls).forEach((v, i) => (sum += v * (i + 1)));
    const average = sum / diceThrows;

    expect(average).to.be.greaterThan(3.4);
    expect(average).to.be.lessThan(3.6);
    expect(Object.keys(diceRolls).every((k) => validRolls.includes(parseInt(k)))).to.be.true;
    expect(Object.values(diceRolls).every((v) => v > 900 && v < 1100)).to.be.true;
  });

  test("can roll dice values in a randomized order", () => {
    const runningCounts = [];
    let runningValue = undefined;
    let runningCount = 1;
    for (let i = 0; i < 10000; i++) {
      const roll = diceRoll();
      if (roll === runningValue) {
        runningCount += 1;
      } else {
        runningCounts.push(runningCount);
        runningValue = roll;
        runningCount = 1;
      }
    }

    let sum = 0;
    runningCounts.forEach((c) => (sum += c));
    const average = sum / runningCounts.length;

    expect(average).to.be.lessThan(1.24);
    expect(average).to.be.greaterThan(1.16);
  });

  test("the dice hand never returns 1", () => {
    const results = [];
    for (let n = 1; n <= 6; n++) {
      for (let m = 1; m <= 6; m++) {
        results.push(diceHandValue(n, m));
      }
    }

    expect(results.every((r) => r !== 1)).to.be.true;
  });

  test("the dice hand returns values between 101-106 for same dice pair", () => {
    for (let i = 1; i <= 6; i++) {
      expect(diceHandValue(i, i)).to.equal(100 + i);
    }
  });

  test("the dice hand returns the maximum of the dice when different", () => {});
});
