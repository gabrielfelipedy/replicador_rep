import fs from 'fs';
export async function getAllTimeClocks() {
    try {
        const raw_clocks = fs.readFileSync("./relogios.json", "utf-8");
        const clocks = JSON.parse(raw_clocks);
        return clocks;
    }
    catch (error) {
        if (error.code === "ENOENT") {
            console.log("Arquivo relogios.json não encontrado");
        }
        else if (error instanceof SyntaxError) {
            console.error("Erro ao analisar relogios.json:", error);
        }
        else {
            console.error("Erro inesperado ao ler nsr.json:", error);
        }
        return null;
    }
}
