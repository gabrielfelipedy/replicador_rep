import fs from 'fs'

import connectDb from "../config/connectDatabase.js";


export async function getAllTimeClocks() {
  try {
    const raw_clocks = fs.readFileSync("./relogios.json", "utf-8");
    const clocks = JSON.parse(raw_clocks);
    
    return clocks

  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Arquivo relogios.json não encontrado");
    } else if (error instanceof SyntaxError) {
      console.error("Erro ao analisar relogios.json:", error);
    } else {
      console.error("Erro inesperado ao ler nsr.json:", error);
    }

    return null
  }
}

// export async function getAllTimeClocks() {
//   //connect to postegres
//   //get data
//   //write to json

//   try {
//     const connection = await connectDb();
//     const insertion = "SELECT * FROM ponto_terminals;";

//     const res = await connection.query(insertion);

//     console.log("Clocks got on sucess");
    
//     const relogios = []

//     res.rows.forEach(row => {
//         const clock_data = {
//             id: row.id,
//             ip: row.endereco,
//             descricao: row.descricao,
//             user: row.usuario,
//             password: row.senha
//         }

//         relogios.push(clock_data)
//     })

//     console.log(relogios);

//     //GRAVA OS DADOS INTERPRETADOS
//     fs.writeFileSync("relogios.json", JSON.stringify(relogios, null, 2));
//     console.log("Dados foram gravados");

//     connection.end();

//     return relogios

//   } catch (error) {
//     console.log("error getting time clocks: ", error);
//     return null
//   }
// }
