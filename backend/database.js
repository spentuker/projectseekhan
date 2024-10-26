import mongoose from "mongoose";
import { DBname } from "./constants.js";

const connectDB = async () => {
  try {
    const DB_URI = "mongodb+srv://nishit:seekhan@cluster0.u6w2n.mongodb.net/";
    const connectionMongoose = await mongoose.connect(`${DB_URI}/${DBname}`);
    console.log(
      `\n MongoDB connection host: ${connectionMongoose.connection.host}`
    );
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
};
export default connectDB;
