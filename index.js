import * as dotenv from "dotenv";
import iconv from "iconv-lite";

import { getLastNSR } from "./src/controllers/NSRController.js";
import { getAfdByInitialNSR } from "./src/controllers/NSRController.js";
import { getAllTimeClocks } from "./src/controllers/RelogioController.js";
import { login } from "./src/controllers/AuthController.js";

dotenv.config();

iconv.skipDecodeWarning = true;

//LÊ O ÚLTIMO NSR INSERIDO
let last_nsr = await getLastNSR()
console.log(Number(last_nsr[0].last_nsr) + 1)
console.log(Number(last_nsr[1].last_nsr) + 1)

const clocks = await getAllTimeClocks();

if (clocks) {
  //OBTER AFD PELO NSR INICIAL
  const session = await login(clocks[0]); //STRING
  console.log(session);
  getAfdByInitialNSR(session, clocks[0].ip, clocks[0].id, Number(last_nsr[0].last_nsr) + 1);
}
