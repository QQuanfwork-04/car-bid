import mongoose from 'mongoose';

export async function connectDb(uri: string): Promise<void> {
  await mongoose.connect(uri);
  // Make sure unique / partial indexes exist before handling requests.
  await mongoose.syncIndexes();
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
