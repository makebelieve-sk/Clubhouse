// Функция проверят авторизирован ли пользователь
import {Api} from "../api";
import {UserData} from "../pages";
import {setUserData} from "../redux/slices/userSlice";
import {Store} from "@reduxjs/toolkit";
import {RootState} from "../redux/types";

export const checkAuth = async (
    ctx: any & {
        store: Store<RootState, any>
    }
    ): Promise<UserData | null> => {
    try {
        const user = await Api(ctx).getMe(); // Проверяем, авторизован ли пользователь (отправляем запрос на /auth/me)
        ctx.store.dispatch(setUserData(user));
        return user;
    } catch (e) {
        return null;
    }
}