import { beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { parsePeopleCsv, processRecords } from "../src/testable3.mjs";

const CSV_CORRECT_RESULT = [
  ["Loid", "Forger", "", "Male"],
  ["Anya", "Forger", "6", "Female"],
  ["Yor", "Forger", "27", "Female"],
];

describe("Testable 3: CSV file parsing", () => {
  test("can parse a csv file (firstName, lastName, age, sex)", async () => {
    expect(await parsePeopleCsv("./test/people.csv")).to.deep.equal(CSV_CORRECT_RESULT);
  });
});

describe("Testable 3: CSV file processing", () => {
  let records;
  beforeEach(() => {
    records = processRecords(CSV_CORRECT_RESULT);
  });

  test("drops empty age parameter", () => {
    expect("age" in records.find((record) => record.firstName === "Loid")).to.be.false;
  });

  test("turns existing age param from string to int", () => {
    records.forEach((record) => {
      if ("age" in record) {
        expect(typeof record.age).to.equal("number");
      }
    });
  });

  test("shortens gender to f/m", () => {
    records.forEach((record) => {
      expect(record.gender === "f" || record.gender === "m").to.be.true;
    });
  });
});
