// Экран входа через гитхаб
import React from "react";
import clsx from "clsx";
import Cookies from "js-cookie";

import {Button} from "../../Button";
import {WhiteBlock} from "../../WhiteBlock";
import {StepInfo} from "../../StepInfo";
import {MainContext, UserData} from "../../../pages";

import styles from "./GithubStep.module.scss";

const storageItem = "userData";

export const GithubStep = () => {
    const {onNextStep, setUserData} = React.useContext(MainContext);    // Получение данных из контекста

    // Обработка клика на кнопку "Import from Github"
    const onClickAuth = () => {
        window.open(
            "http://localhost:3001/auth/github/",
            "Auth",
            "width=500,height=500,status=yes,toolbar=no,menubar=no,location=no"
        );
    }

    // Получаем данные, записанные в postMessage на бекенде
    React.useEffect(() => {
        // Слушая событие message, получаем данные, которые записываются в postMessage
        window.addEventListener("message", ({data}) => {
            const user: string = data;

            // Проверяем, чтобы запрос пришел от нашего сервера (а не от всяких разрешений, например)
            if (typeof user === "string" && user.includes("avatarUrl")) {
                Cookies.remove("tokenClubhouse");   // Удаляем токен из куки

                const json: UserData = JSON.parse(user);  // Парсим ответ от сервера
                setUserData(json);  // Записываем объект пользователя в состояние пользователя
                onNextStep();   // Переход на следующий экран

                Cookies.set("tokenClubhouse", json.token);   // Сохраняем токен в куки

                // Устанавливаем в localStorage объект пользователя
                window.localStorage.setItem(storageItem, JSON.stringify(json));
            }
        });
    }, []);

    return (
        <div className={styles.block}>
            <StepInfo
                icon="../../../public/favicon.ico"
                title="Do you want import info from Github?"
                description={null}
            />

            <WhiteBlock className={clsx("m-auto mt-40", styles.whiteBlock)}>
                <div className={styles.avatar}>
                    <b>SA</b>
                    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#E0E0E0" stroke="#D6D6D6"/>
                    </svg>
                </div>
                <h2 className="mb-40">Skryabin Alexey</h2>

                <Button onClick={onClickAuth} className={clsx(styles.button, "d-i-flex align-items-center")}>
                    <img className="d-ib mr-10" src="../../../public/favicon.ico" alt="Github"/>
                    Import from Github
                    <img className="d-ib ml-10" src="../../../public/favicon.ico" alt="Кнопка"/>
                </Button>
                <div className="link mt-20 cup d-ib" onClick={onNextStep}>Enter my info manually</div>
            </WhiteBlock>
        </div>
    )
}