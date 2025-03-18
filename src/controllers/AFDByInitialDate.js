import axios from "axios";
import iconv from "iconv-lite";
import fs from "fs";
import { interpretarRegistro } from "../interpretaRegistro.js";
import RegistroPonto from "../models/RegistroPonto.js";

export async function getAfdByInitialDate(session) {
  let buffer = "";
  let registros = [];

  try {
    // Lendo o arquivo nsr.json e tratando erro de arquivo inexistente
    const nsrFileContent = fs.readFileSync("./nsr.json", "utf-8");
    const dadosLidos = JSON.parse(nsrFileContent);
    const ultimoNsrLido = parseInt(dadosLidos.nsr);

    if (!process.argv[2]) {
      initial_nsr = ultimoNsrLido + 1;
      console.log(`Initial NSR: ${initial_nsr}`);
    }
    // initial_nsr = ultimoNsrLido + 1;
    // console.log(`Initial NSR: ${initial_nsr}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Arquivo nsr.json não encontrado. Iniciando com NSR 1.");
    } else if (error instanceof SyntaxError) {
      console.error("Erro ao analisar nsr.json:", error);
    } else {
      console.error("Erro inesperado ao ler nsr.json:", error);
    }
  }

  //OBTER TODOS OS AFDS
  const url = new URL(`${process.env.RELOGIO_URL}/get_afd.fcgi`);
  url.searchParams.append("session", session.session);
  url.searchParams.append("mode", 671);

  try {
    const response = await axios.post(url.toString(), {
      initial_date: {
        day: 1,
        month: 2,
        year: 2024,
      },
    });

    let decodedRes = iconv.decode(buffer.concat(response.data), "win1252");

    if (decodedRes) {
      console.log("Novos registros encontrados. Processando...");
      const linhas = decodedRes.split("\n");

      const fileName = linhas[linhas.length - 1];
      fs.writeFileSync(`${fileName}`, response.data, null, 2);
      console.log(`AFD salvo em ${fileName}`);

      // const conn = await connectDb();

      for (let i = 0; i < linhas.length - 1; i++) {
        const linha = linhas[i];

        if (linha) {
          const registro = interpretarRegistro(linha);

          if (registro) {
            const query = await RegistroPonto.findOne({ nsr: registro.nsr });
            if (!query) {
              registros.push(registro);
              console.log(
                `Registro de ponto inserido com sucesso. NSR: ${registro.nsr}`
              );
            }
          }
        }
      }

      if (registros.length > 0) {
        try {
          const insertManyResult = await RegistroPonto.insertMany(registros);
          console.log("Registros incluídos com sucesso");
          // console.log(insertManyResult);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("Nâo foram localizados novos registros de pontos");
      }

      // conn.disconnect();
    } else {
      console.log("Arquivo AFD em branco");
    }

    // if (response.data !== "") {
    //   fs.writeFileSync(`${fileName}`, response.data, null, 2);
    //   console.log(`Resposta salva em ${fileName}`);
    // }
  } catch (error) {
    console.error(error);
  }
}
