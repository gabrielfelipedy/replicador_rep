import fs from "fs";

export async function getLastNSR() {
  try {
    const nsrFileContent = fs.readFileSync("./nsr.json", "utf-8");
    const dadosLidos = JSON.parse(nsrFileContent);
    const ultimoNsrLido = parseInt(dadosLidos.nsr);

    return parseInt(ultimoNsrLido);

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