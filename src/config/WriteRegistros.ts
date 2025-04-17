import { RecordLastNSR } from "../utils/RecordLastNSR.js";
import connectDb from "./connectDatabase.js";

export async function writeRegistros(registros: string[], clock_id: number) {
  
  const connection = await connectDb();

  if(!connection) return null

  for (let registro of registros) {
    try {
      const insertion = `INSERT INTO ponto_terminal_entradas (ponto_terminal_id, tipo, chave, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *;`;

      const res = await connection.query(insertion, [clock_id, "ponto", registro]);

      if(!res) return null

      console.log("registro processado:", res.rows[0]);

      await RecordLastNSR(registro, clock_id);
      console.log("writing last nsr");

    } catch (error) {
      console.error("Error inserting register", error);
    }
  }

  connection.end();
}