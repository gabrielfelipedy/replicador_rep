import pkg from 'pg';
const { Client } = pkg;
import * as dotenv from "dotenv";

dotenv.config();

async function connectDb() {
  try {

    const client = new Client({
      connectionString: process.env.POSTGRES_URL
    })

    await client.connect()
    console.log("Conexão com banco feita com sucesso")
    return client

  } catch (error) {
    console.log(error);
  }
}

export default connectDb;