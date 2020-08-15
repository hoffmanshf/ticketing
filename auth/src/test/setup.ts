import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongo: any;
// before all the tests run
beforeAll(async () => {
  process.env.JWT_KEY = "asdfgh"
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
