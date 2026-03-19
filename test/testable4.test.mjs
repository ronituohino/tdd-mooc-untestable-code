import { afterEach, beforeEach, describe, test } from "vitest";
import { expect } from "chai";
import { PasswordService, PostgresUserDao, PostgresDB } from "../src/testable4.mjs";
import { readFile } from "node:fs/promises";

describe("Testable 4: enterprise application", () => {
  let postgres;
  let userDao;
  let passwordService;

  const seedDatabase = async (postgres) => {
    const addUsersSql = await readFile("./test/seed-users.sql", { encoding: "utf8" });
    await postgres.db.query(addUsersSql);
  };

  const undoSeedDatabase = async (postgres) => {
    const truncateUsersSql = await readFile("./test/seed-undo-users.sql", { encoding: "utf8" });
    await postgres.db.query(truncateUsersSql);
  };

  beforeEach(async () => {
    postgres = new PostgresDB("untestable", "localhost", "untestable", "secret", 5432);

    // fail safe to prevent anything being done if not test database
    if (postgres.db.options.database !== "untestable") {
      postgres = undefined;
    }

    userDao = new PostgresUserDao(postgres);
    passwordService = new PasswordService(userDao);
    await seedDatabase(postgres);
  });

  afterEach(async () => {
    await undoSeedDatabase(postgres);
    postgres.close();
  });

  test("test database is up", async () => {
    const { rows } = await postgres.db.query(`select 1+1 as result`);

    expect(rows[0].result).to.equal(2);
    expect(postgres.db.options.database).to.equal("untestable");
  });

  test.skip("test database contains seed data", () => {});

  test.skip("DAO can get a user by id", () => {});
  test.skip("DAO will return undefined when id does not exist", () => {});
  test.skip("DAO can use save to create a new user with id and password", () => {});
  test.skip("DAO can use save to update an existing user's password with the same id", () => {});

  test.skip("password service can change a user password when id exists and old password matches", () => {});
  test.skip("password service will throw an error if old password does not match", () => {});
  test.skip("password service will throw an error if user id does not exist", () => {});
});
