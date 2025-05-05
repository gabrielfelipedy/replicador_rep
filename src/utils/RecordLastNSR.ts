import moment from "moment-timezone";
import fs from "fs";
import { NSR } from "../models/NSR.js";

moment().tz("America/Sao_Paulo");

//INTERPRETA SOMENTE OS REGISTROS DE PONTO
export async function RecordLastNSR(linha: string, clock_id: number) {
  //TRATA AS QUEBRAS DE LINHA
  linha = linha.replace(/\r\n/g, "\n").trim();

  try {
    const nsr = linha.substring(0, 9).trim();

    const nsrFileContent = fs.readFileSync("./nsr.json", "utf-8");
    const dadosLidos = JSON.parse(nsrFileContent);

    const clock_to_update = dadosLidos.find(
      (nsr: NSR) => nsr.clock_id === clock_id
    );

    if (clock_to_update) {
      clock_to_update.last_nsr = nsr;

      //GRAVA OS DADOS INTERPRETADOS
      fs.writeFileSync("nsr.json", JSON.stringify(dadosLidos, null, 2));
      console.log("Dados foram gravados");
    } else {
      console.log("No clock found");
    }
  } catch (error) {
    console.error("Erro ao interpretar registro:", error, linha);
    return null;
  }
}