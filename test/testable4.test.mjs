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
  test("test database contains seed data", async () => {
    const { rows } = await postgres.db.query(`select password_hash as hash from users where user_id=$1`, [1]);
    expect(rows[0].hash.length).to.be.greaterThan(0);
  });
  test("test data does not persist across tests 1", async () => {
    await postgres.db.query("insert into users (user_id, password_hash) values (3, 'qwe123')");
  });
  test("test data does not persist across tests 2", async () => {
    const { result } = await postgres.db.query("select password_hash from users where user_id = 3");
    expect(result).to.equal(undefined);
  });

  test("DAO can get a user by id", async () => {
    const result = await userDao.getById(1);
    expect(result).to.not.equal(null);
  });
  test("DAO will return null when id does not exist", async () => {
    const result = await userDao.getById(4);
    expect(result).to.equal(null);
  });
  test("DAO can use save to create a new user with id and password", async () => {
    await userDao.save({ userId: 4, passwordHash: "112233" });
    const result = await userDao.getById(4);
    expect(result.passwordHash).to.equal("112233");
  });
  test("DAO can use save to update an existing user's password with the same id", async () => {
    await userDao.save({ userId: 1, passwordHash: "newhashfor1" });
    const result = await userDao.getById(1);
    expect(result.passwordHash).to.equal("newhashfor1");
  });

  test("password service can change a user password when id exists and old password matches", async () => {
    await passwordService.changePassword(1, "123qwe123", "muchbetterpass1");
    const result = await userDao.getById(1);
    expect(result.passwordHash).to.not.equal(
      "$argon2id$v=19$m=19456,t=2,p=1$896omGJSjsS+c5wabGATLg$hYyW8RemrZZQtqOu4osMwLm/mFQQtiv4zKSDDpQROVU", // 123qwe123
    );
  });
  test("password service will throw an error if old password does not match", async () => {
    try {
      await passwordService.changePassword(1, "123qwe12", "muchbetterpass1");
    } catch (e) {
      expect(e.message).to.equal("wrong old password");
    }
  });
  test("password service will throw an error if user id does not exist", async () => {
    try {
      await passwordService.changePassword(3, "123qwe12", "muchbetterpass1");
    } catch (e) {
      // Could have better implementation
      expect(e.message).to.equal("Cannot read properties of null (reading 'passwordHash')");
    }
  });
});
