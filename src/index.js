import axios from "axios";
import * as dotenv from "dotenv";
import fs from "fs";
import iconv from "iconv-lite";

import { interpretarRegistro } from "./interpretaRegistro.js";
import connectDb from "./config/connectDatabase.js";
import RegistroPonto from "./models/RegistroPonto.js";

dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;

iconv.skipDecodeWarning = true;

async function login() {
  try {
    const response = await axios.post("https://192.168.1.10/login.fcgi", {
      login: "admin",
      password: "admin",
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const session = await login();
console.log(session);

async function getAfd() {
  let buffer = "";
  let registros = [];
  let initial_nsr = 0;

  try {
    // Lendo o arquivo nsr.json e tratando erro de arquivo inexistente
    const nsrFileContent = fs.readFileSync("./nsr.json", "utf-8");
    const dadosLidos = JSON.parse(nsrFileContent);
    const ultimoNsrLido = parseInt(dadosLidos.NSR);
    initial_nsr = ultimoNsrLido + 1;
    console.log(`Initial NSR: ${initial_nsr}`);
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Arquivo nsr.json não encontrado. Iniciando com NSR 1.");
    } else if (error instanceof SyntaxError) {
      console.error("Erro ao analisar nsr.json:", error);
    } else {
      console.error("Erro inesperado ao ler nsr.json:", error);
    }
  }

  const url = new URL("https://192.168.1.10/get_afd.fcgi");
  url.searchParams.append("session", session.session);
  url.searchParams.append("mode", 671);

  try {
    const response = await axios.post(url.toString(), {
      initial_nsr: initial_nsr,
    });

    // buffer += iconv.decode(response.data, 'win1252');
    let decodedRes = iconv.decode(buffer.concat(response.data), 'win1252')
    
    const linhas = decodedRes.split("\n");
    const fileName = linhas[linhas.length - 1];

    for (let i = 0; i < linhas.length - 1; i++) {
      const linha = linhas[i];

      if (linha) {
        const registro = interpretarRegistro(linha);

        if (registro) {
          registros.push(registro);
        }
      }
    }

    if (registros.length > 0) {

      const conn = connectDb();

      for (let i = 0; i < registros.length; i++) {
        console.log(registros[i])
        // await RegistroPonto.create({ ...registros[i]})
      }

      // console.log(registros)
    } else {
      console.log("Registros de ponto nâo localizados")
    }


    if (response.data !== '') {
      fs.writeFileSync(`${fileName}`, response.data, null, 2);
      console.log(`Resposta salva em ${fileName}`);
    }

  } catch (error) {
    console.error(error);
  }
}

getAfd();

