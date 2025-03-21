import axios from "axios";
import * as dotenv from "dotenv";
import iconv from "iconv-lite";


import { getAfdByInitialDate } from "./src/controllers/AFDByInitialDate.js";
import { getAfdByInitialNSR } from "./src/controllers/AFDByInitialNSR.js";
import { getAllAfd } from "./src/controllers/AFDController.js";
import { getLastNSR } from "./src/controllers/ReadLastNSR.js";

dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;

iconv.skipDecodeWarning = true;

//LÊ O ÚLTIMO NSR INSERIDO
let initial_nsr = await getLastNSR() + 1;
console.log(`Initial NSR: ${initial_nsr}`)

// FAZ LOGIN E RETORNA UMA STRING COM O CÓDIGO DA SESSÃO INICIADA 
async function login() {
  try {
    const response = await axios.post(`${process.env.RELOGIO_URL}/login.fcgi`, {
      login: process.env.LOGIN_USER,
      password: process.env.PASSWORD_USER,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

//OBTER AFD PELO NSR INICIAL
const session = await login();  //STRING
getAfdByInitialNSR(session, initial_nsr)