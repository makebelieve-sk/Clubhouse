// Главный файл типизации на сервере
// Указываем глобальный тип User (на фронте точно такой же UserData)
import {UserData} from "../pages";

declare global {
    namespace Express {
        interface User extends UserData {

        }
    }
}