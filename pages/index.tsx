import React from "react";
import {WelcomeStep} from "../components/steps/WelcomeStep";
import {EnterNameStep} from "../components/steps/EnterNameStep";
import {GithubStep} from "../components/steps/GithubStep";
import {ChooseAvatarStep} from "../components/steps/ChooseAvatarStep";
import {EnterPhoneStep} from "../components/steps/EnterPhoneStep";
import {EnterCodeStep} from "../components/steps/EnterCodeStep";
import {checkAuth} from "../helpers/checkAuth";
import {Axios} from "../core/axios";
import {Api} from "../api";
import {wrapper} from "../redux/store";

const steps = {
    0: WelcomeStep,
    1: GithubStep,
    2: EnterNameStep,
    3: ChooseAvatarStep,
    4: EnterPhoneStep,
    5: EnterCodeStep
}

export type UserData = {
    id: number,
    fullname: string,
    avatarUrl: string,
    isActive: number,
    username: string,
    phone: string,
    token?: string
}

type MainContextProps = {
    onNextStep: () => void,
    setUserData: React.Dispatch<React.SetStateAction<UserData>>,
    setFieldValue: (field: keyof UserData, value: string | number) => void,
    userData: UserData,
    step: number
};

const storageItem = "userData";

// Создание контекста
export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

// Функция записывания объекта пользователя в localStorage
const getUserData = (): UserData | null => {
    try {
        return JSON.parse(window.localStorage.getItem(storageItem));
    } catch (e) {
        return null;
    }
}

// Если пользователь авторизован, то идет перенаправление на 4 или 5 шаг, в зависимости от наличия номера телефона
const getFormStep = (): number => {
    const json = getUserData();

    if (json) {
        if (json.phone) {
            return 5;
        } else {
            return 4;
        }
    }

    return 0;
}

export default function Home() {
    const [step, setStep] = React.useState<number>(0);     // Состояние шагов в приложении
    const [userData, setUserData] = React.useState<UserData>();     // Состояние данных пользователя
    const Step = steps[step];

    /**
     * Функция изменения поля в объекте пользователя
     * @param field - изменяемое поле
     * @param value - значение изменяемого поля
     */
    const setFieldValue = (field: string, value: string | number) => {
        setUserData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // При первом монтировании устанавливаем шаг в стейте (который в браузере, а не next стейт на сервере)
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const json = getUserData();

            if (json) {
                setUserData(json);
                setStep(getFormStep());
            }
        }
    }, []);

    // При каждом обновлении объекта пользователя (userData) - обновляем localStorage
    React.useEffect(() => {
        if (userData) {
            window.localStorage.setItem(storageItem, JSON.stringify(userData));
            Axios.defaults.headers.Authorization = "Bearer " + userData.token;
        }
    }, [userData]);

    // Функция перехода на следующий экран (обработка нажатия на кнопку "Next")
    const onNextStep = () => setStep((prevStep) => prevStep + 1);

    return (
        <MainContext.Provider value={{onNextStep, step, userData, setUserData, setFieldValue}}>
            <Step onNextStep={() => setStep(step + 1)}/>
        </MainContext.Provider>
    )
}

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    try {
        const user = await checkAuth(ctx);  // Проверяем, авторизирован ли пользователь

        // Если авторизован, то переходим на страницу rooms
        if (user && user.isActive) {
            return {
                props: {},
                redirect: {
                    destination: "/rooms",
                    permanent: false
                }
            };
        }

        // Иначе передаем пустые свойства
        return {props: {}};
    } catch (e) {
        console.log(e);
        // Иначе передаем пустые свойства
        return {props: {}};
    }
})