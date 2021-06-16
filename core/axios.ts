// Файл образца Axios
import axios from "axios";
import {parseCookies} from "nookies";

const cookies = parseCookies();

const Axios = axios.create({
    baseURL: "http://localhost:3001",
    // В каждом запросе запоминаем токен из куки
    headers: {
        Authorization: "Bearer " + cookies?.tokenClubhouse,
    }
});

export {Axios};