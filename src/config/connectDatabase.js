import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

async function connectDb() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);

    console.log("Conexão com banco feita com sucesso")

    return connection
  } catch (error) {
    console.log(error);
  }
}

export default connectDb;