import { RecordLastNSR } from "../RecordLastNSR.js";
import connectDb from "./connectDatabase.js";

export async function writeRegistros(registros) {
  const connection = await connectDb();

  for (let registro of registros) {
    try {
      const insertion = `INSERT INTO ponto_terminal_entradas (ponto_terminal_id, tipo, chave, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *;`;

      const res = await connection.query(insertion, [1, "ponto", registro]);

      console.log("registro processado:", res.rows[0]);

      await RecordLastNSR(registro);
      console.log("writing last nsr");
    } catch (error) {
      console.error("Error inserting register", error);
    }
  }

  connection.end();
}