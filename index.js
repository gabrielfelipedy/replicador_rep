import * as dotenv from "dotenv";
import iconv from "iconv-lite";

import { getLastNSR } from "./src/controllers/NSRController.js";
import { getAfdByInitialNSR } from "./src/controllers/NSRController.js";
import { getAllTimeClocks } from "./src/controllers/RelogioController.js";
import { login } from "./src/controllers/AuthController.js";

dotenv.config();

iconv.skipDecodeWarning = true;

//LÊ O ÚLTIMO NSR INSERIDO
const last_nsrs = await getLastNSR();
const clocks = await getAllTimeClocks();

console.log(clocks)

if (clocks) {
  clocks.map(async (clock) => {
    const session = await login(clock);

    const last_nsr = last_nsrs.find(
      (last_nsr) => last_nsr.clock_id === clock.id
    );

    //console.log(`clock id: ${clock.id}\nlast_nsr: `, last_nsr)

    await getAfdByInitialNSR(
      session,
      clock.ip,
      clock.id,
      Number(last_nsr.last_nsr) + 1
    );
  });
}