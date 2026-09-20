import mongoose from "mongoose";

const globalForMongoose = globalThis as unknown as {
  mongooseConnection?: typeof mongoose;
  mongoosePromise?: Promise<typeof mongoose>;
};

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!globalForMongoose.mongoosePromise) {
    globalForMongoose.mongoosePromise = mongoose.connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }

  globalForMongoose.mongooseConnection = await globalForMongoose.mongoosePromise;
  return globalForMongoose.mongooseConnection;
}
