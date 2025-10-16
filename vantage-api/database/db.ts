import mongoose, { ConnectOptions } from 'mongoose';

// Database configuration
const dbConfig = {
  url: process.env.MONGODB_URI,
  options: {} as ConnectOptions
};

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: MongooseCache = {
  conn: null,
  promise: null,
};

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!dbConfig.url) {
    throw new Error("MONGODB_URI is not defined. Set the MONGODB_URI environment variable.");
  }

  if (!cached.promise) {
    const opts = dbConfig.options;

    console.log("Connecting to MongoDB at " + dbConfig.url + "...");
    cached.promise = mongoose.connect(dbConfig.url, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
