import moment from 'moment-timezone'
import fs from 'fs'

moment().tz("America/Sao_Paulo");

//INTERPRETA SOMENTE OS REGISTROS DE PONTO
export async function RecordLastNSR(linha) {

  //TRATA AS QUEBRAS DE LINHA
  linha = linha.replace(/\r\n/g, "\n").trim();
  
  try {
    
    const nsr = linha.substring(0, 9).trim();

    const dados = {
      nsr: Number(nsr),
    };

    //GRAVA OS DADOS INTERPRETADOS
    fs.writeFileSync('nsr.json', JSON.stringify(dados));
    console.log("Dados foram gravados")

  } catch (error) {
    console.error("Erro ao interpretar registro:", error, linha);
    return null;
  }
}