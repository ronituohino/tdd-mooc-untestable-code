import { afterEach, beforeEach, describe, test } from "vitest";
import { PasswordService, PostgresUserDao, PostgresDB } from "../src/testable4.mjs";

describe("Testable 4: enterprise application", () => {
  let db;
  let userDao;
  let passwordService;
  beforeEach(() => {
    db = new PostgresDB("untestable", "localhost", "untestable", "secret", 5432);
    userDao = new PostgresUserDao(db);
    passwordService = new PasswordService(userDao);
  });

  afterEach(() => {
    db.close();
  });

  test("test database is up", async () => {
    const { rows } = await db.query(`select 1+1`);
    console.log(rows);

    // expect 1+1 = 2
    // expect db name == test
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
