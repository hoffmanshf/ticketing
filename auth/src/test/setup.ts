import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

// augment the type definition of NodeJS Global field
declare global {
  namespace NodeJS {
    interface Global {
      // returns a promise that will be resolve with array of string
      signin(): Promise<string[]>
    }
  }
}

let mongo: any;
// before all the tests run
beforeAll(async () => {
  process.env.JWT_KEY = "asdfgh";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// before each test runs
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  // delete all collections in mongodb before each test
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// after all tests are complete
afterAll(async () => {
  await mongo.stop;
  await mongoose.connection.close();
});

// create a global function to avoid import from setup file in every test suite
global.signin = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
