import mongoose from "mongoose";
import dotenv from "dotenv";
import { local } from "../local";
dotenv.config();

const { CONNECTION_STRING } = process.env;

export const dbConnect = async () => {
  try {
    await mongoose.connect(CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(local.dbConnected);
  } catch (error) {
    console.error(local.dbConnectionError, error.message);
  }
};
