// Содержит в себе методы для работы с пользователем
import {UserData} from "../pages";
import {AxiosInstance} from "axios";

export const UserApi = (Axios: AxiosInstance) => {
    return {
        getMe: async (): Promise<UserData> => {
            const {data} = await Axios.get("/auth/me");
            return data;
        }
    }
}