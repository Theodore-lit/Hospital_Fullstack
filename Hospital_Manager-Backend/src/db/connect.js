import { connect, disconnect } from "mongoose";

// const MONGOOSE_URL = process.env.MONGOOSE_URL;
// const DB_NAME = process.env.DB_NAME;

export async function connectDb() {
  connect(process.env.MONGOOSE_URL);
  console.log("Database connected", {dbName: process.env.DB_NAME});
}

export async function disconnectDb() {
  await disconnect(MONGOOSE_URL);
  console.log("Database disconnected");
}
