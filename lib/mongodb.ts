import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
console.log("MONGODB_URL", MONGODB_URL);
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is missing in .env.local");
}

let isConnected = false;

export const connectToDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: "project_0",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any);
    isConnected = true;
    console.log("🚀 MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection error");
  }
};

export const checkDBName = async () => {
  await connectToDB();
  console.log("Connected to database:", mongoose.connection.name);
};
