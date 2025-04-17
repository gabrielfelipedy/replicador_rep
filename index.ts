import * as dotenv from "dotenv";
import iconv from "iconv-lite";
import { getAfdByInitialNSR, getLastNSR } from "./src/controllers/NSRController.js";
import { getAllTimeClocks } from "./src/controllers/RelogioController.js";
import { Clock } from "./src/models/Clock.js";
import { login } from "./src/controllers/ApiController.js";
import { NSR } from "./src/models/NSR.js";

dotenv.config();

//LÊ O ÚLTIMO NSR INSERIDO
const last_nsrs = await getLastNSR();
const clocks = await getAllTimeClocks();

console.log(clocks)

if (clocks) {
  clocks.map(async (clock: Clock) =>
  {
    const session = await login(clock);

    const last_nsr = last_nsrs.find(
      (last_nsr: NSR) => last_nsr.clock_id === clock.id
    );

    //console.log(`clock id: ${clock.id}\nlast_nsr: `, last_nsr)

    await getAfdByInitialNSR(
      session,
      clock,
      Number(last_nsr.last_nsr) + 1
    );
  });
}