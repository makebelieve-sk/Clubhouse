// Функция для удобной работы с вызовом Axios.get
import Cookies from "nookies";
import axios from "axios";
import {UserApi} from "./UserApi";
import {RoomApi} from "./RoomApi";

type ApiReturnType = ReturnType<typeof UserApi> & ReturnType<typeof RoomApi>;

export const Api = (ctx: any) => {
    const {tokenClubhouse} = Cookies.get(ctx);  // Достаем из объекта ctx куки браузера

    // Пересоздаем инстант axios
    const Axios = axios.create({
        baseURL: "http://localhost:3001",
        // В каждом запросе запоминаем токен из куки
        headers: {
            Authorization: "Bearer " + tokenClubhouse,
        }
    });

    return [UserApi, RoomApi].reduce((prev, f) => ({...prev, ...f(Axios)}), {} as ApiReturnType);
}