// FAZ LOGIN E RETORNA UMA STRING COM O CÓDIGO DA SESSÃO INICIADA
import axios from "axios";
import { Clock } from "../models/Clock.js";

axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;

export async function login(clock: Clock) {
  try {
    const response = await axios.post(`https://${clock.ip}/login.fcgi`, {
      login: clock.user,
      password: clock.password,
    });

    if(!response || !response.data || !response.data.session) return null

    return response.data.session;

  } catch (error) {
    console.error(error);
  }
}
