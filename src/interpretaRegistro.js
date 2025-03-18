import crc from "crc"
import moment from 'moment-timezone'
import fs from 'fs'

moment().tz("America/Sao_Paulo");

function interpretarRegistro(linha) {
  linha = linha.replace(/\r\n/g, "\n");
  
  try {
    const tipoRegistro = linha.substring(9, 10);
    if (tipoRegistro !== "3") {
      return null;
    }

    
    const nsr = linha.substring(0, 9).trim();
    const dataHora = linha.substring(10, 34);
    const dataHoraSP = moment().format(dataHora);
    const cpf = linha.substring(35, 46).trim();
    const crc16 = crc
      .crc16xmodem(linha.substring(0, 46))
      .toString(16)
      .toUpperCase();

    const dados = {
      nsr: nsr,
      tipoRegistro: "3 - MARCAÇÃO DE PONTO",
      dataHora: moment().format(dataHoraSP), // Formata data e hora
      cpf: cpf,
      crc16: crc16.padStart(4, "0"), // Preenche com zeros à esquerda se necessário
    };

    fs.writeFileSync('nsr.json', JSON.stringify(dados));

    return dados;
  } catch (error) {
    console.error("Erro ao interpretar registro:", error, linha);
    return null;
  }
}
  
export { interpretarRegistro }
