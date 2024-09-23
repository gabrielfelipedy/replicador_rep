import axios from "axios";
import * as dotenv from "dotenv";
import fs from "fs";
import iconv from "iconv-lite";

import { interpretarRegistro } from "./interpretaRegistro.js";

dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;

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
console.log(`ID da sessão: ${session}`);

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

    console.log(registros)

    if (response.data !== '') {
      fs.writeFileSync(`${fileName}`, response.data, null, 2);
      console.log(`Resposta salva em ${fileName}`);
    }

  } catch (error) {
    console.error(error);
  }
}

getAfd();

/* Função para exportar cadastros de usuarios em um rep.
1. a função primeiro busca a quantidade de usuarios cadastrados em um rep principal
2. Caso ocorra o cadastro de um novo usuario no rep principal, ocorre a replicacao para os outros rep
*/
async function exportUsers() {

  //configurando a url para realizar a requisição para verificar a contagem de usuarios no rep principal
  const url = new URL("https://192.168.1.10/count_users.fcgi");
  url.searchParams.append("session", session.session);
  url.searchParams.append("mode", 671);

  const urlExport = new URL("https://192.168.1.10/export_users_csv.fcgi");
  urlExport.searchParams.append("session", session.session);
  urlExport.searchParams.append("mode", 671);

  try {

    // req. para buscar a quantidade de usuarios no rep main
    const response = await axios.post(url.toString(), {})
    console.log(response.data)

    const responseData = await axios.post(urlExport.toString(), {})
    
    if (response.data !== '') {
      fs.writeFileSync('./users.csv', responseData.data, null, 2);
      console.log('Resposta salva em users.csv');
    }
    
  } catch (error) {
    console.error(error)
  }

}

exportUsers()