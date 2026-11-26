import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, beforeEach } from 'vitest';
import { connectDb, disconnectDb } from '../src/db.js';
// Register all models before syncIndexes runs.
import '../src/modules/users/user.model.js';
import '../src/modules/cars/car.model.js';
import '../src/modules/offers/offer.model.js';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connectDb(mongo.getUri());
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  await Promise.all(collections.map((c) => c.deleteMany({})));
});

afterAll(async () => {
  await disconnectDb();
  await mongo?.stop();
});
