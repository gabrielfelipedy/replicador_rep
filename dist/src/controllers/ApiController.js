// FAZ LOGIN E RETORNA UMA STRING COM O CÓDIGO DA SESSÃO INICIADA
import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.insecureHTTPParser = true;
export async function login(clock) {
    try {
        const response = await axios.post(`https://${clock.ip}/login.fcgi`, {
            login: clock.user,
            password: clock.password,
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
    }
}
