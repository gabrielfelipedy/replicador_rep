import axios from "axios";
import * as dotenv from "dotenv";
import fs from "fs";
import iconv from "iconv-lite";

import { interpretarRegistro } from "./src/interpretaRegistro.js";
import connectDb from "./src/config/connectDatabase.js";
import RegistroPonto from "./src/models/RegistroPonto.js";
import { getAfdByInitialDate } from "./src/controllers/AFDByInitialDate.js";
import { getAfdByInitialNSR } from "./src/controllers/AFDByInitialNSR.js";
import { getAllAfd } from "./src/controllers/AFDController.js";

dotenv.config();

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;

iconv.skipDecodeWarning = true;


let initial_nsr = process.argv[2]

if (process.argv[2]){
  console.log(`Initial NSR: ${initial_nsr}`)
}

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

const session = await login();  //STRING
getAllAfd(session)
// getAfdByInitialNSR(session, initial_nsr)
// getAfdByInitialDate(session);