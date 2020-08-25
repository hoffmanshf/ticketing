import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// augment the type definition of NodeJS Global field
declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

// redirect import to a fake NATS client
jest.mock("../nats-wrapper");

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
  // reset data for mock nats wrapper
  jest.clearAllMocks();
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
global.signin = () => {
  // build a jwt payload
  // randomly generate a random user id
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // create the jwt
  // use ! to ignore warning
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // build session object { jwt: MY_JWT }
  const session = { jwt: token };

  // turn the session into JSON
  const sessionJSON = JSON.stringify(session);

  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that is the cookie with encoded data
  // Notice: supertest expects cookie in an array
  return [`express:sess=${base64}`];
};
