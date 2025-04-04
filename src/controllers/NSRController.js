import axios from "axios";
import iconv from "iconv-lite";

import fs from "fs";

import { processLine } from "../ProcessLine.js";
import { writeRegistros } from "../config/WriteRegistros.js";

export async function getAfdByInitialNSR(session, clock_url, clock_id, initial_nsr) {
  //console.log("initial NSR recebido ", initial_nsr)

  let buffer = "";
  let registros = [];

  console.log(`\nInitial NSR: ${initial_nsr}`)

  //PREPARA A URL PARA OBTER O AFD
  const url = new URL(`https://${clock_url}/get_afd.fcgi`);
  url.searchParams.append("session", session.session);
  url.searchParams.append("mode", 671);

  try {
    //OBTÉM O AFD A PARTIR DO NSR INICIAL
    const response = await axios.post(url.toString(), {
      initial_nsr: parseInt(initial_nsr),
    });

    //SALVA EM BUFFER PARA PROCESSAR
    let decodedRes = iconv.decode(buffer.concat(response.data), "win1252");
  
    //SE OBTEVE RESPOSTA
    if (decodedRes) {
      console.log("\n\nNovos registros encontrados. Processando...");

      //SEPARA AS LINHAS
      const separated = decodedRes.split("\n");

      const linhas = separated.slice(0, -2)

      console.log("\nDados recebidos: ")
      console.log(linhas)

      // //A ULTIMA LINHA SEMPRE É O NOME DO ARQUIVO, SALVA OS DADOS BRUTOS
      // const fileName = linhas[linhas.length - 1];
      // fs.writeFileSync(`${fileName}`, response.data, null, 2);
      // console.log(`AFD salvo em ${fileName}`);

      //PROCESSA CADA LINHA INDIVIDUALMENTE
      for (let i = 0; i < linhas.length; i++)
      {
        const linha = linhas[i];

        //SE LINHA FOR VÁLIDA, A INTERPRETA
        if (linha) {
          const registro = await processLine(linha);

          //SE PROCESSAMENTO FOI VÁLIDO
          if (registro)
          {
            registros.push(registro)
          }
        }
      }

      if (registros.length > 0) {
        
          console.log("\nRegistros incluídos com sucesso\n");
          
          await writeRegistros(registros, clock_id) 
       
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

export async function getLastNSR() {
  try {
    const nsrFileContent = fs.readFileSync("./nsr.json", "utf-8");
    const dadosLidos = JSON.parse(nsrFileContent);
    
    return dadosLidos

  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Arquivo nsr.json não encontrado. Iniciando com NSR 1.");
    } else if (error instanceof SyntaxError) {
      console.error("Erro ao analisar nsr.json:", error);
    } else {
      console.error("Erro inesperado ao ler nsr.json:", error);
    }

    return 0
  }
}