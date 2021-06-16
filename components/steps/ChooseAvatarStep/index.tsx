// Экран выбора аватарки пользователя
import React from "react";
import clsx from "clsx";

import {Axios} from "../../../core/axios";
import {StepInfo} from "../../StepInfo";
import {Button} from "../../Button";
import {WhiteBlock} from "../../WhiteBlock";
import {Avatar} from "../../Avatar";
import {MainContext} from "../../../pages";

import styles from "./ChooseAvatarStep.module.scss";

/**
 * Функция отправки аватарки на сервер
 * @param file - изменяемая аватарка
 */
const uploadFile = async (file: File): Promise<{url: string}> => {
    try {
        const formData = new FormData();    // Создаем объект FormData

        formData.append("photo", file); // Добавляем файл в объект formData

        // Получаем ответ от сервера
        const {data} = await Axios.post("/upload", formData, {headers: {"Content-Type": "multipart/form-data"}});

        return data;
    } catch (e) {
        console.log(e);
        throw new Error(e);
    }
}

export const ChooseAvatarStep: React.FC = () => {
    // Из контекста берем функцию перехода на след. экран, объект пользвоателя и функцию замены значения поля в объекте пользователя
    const {onNextStep, userData, setFieldValue} = React.useContext(MainContext);
    const [avatarUrl, setAvatarUrl] = React.useState<string>(userData.avatarUrl);    // Путь к аватарке
    const inputFileRef = React.useRef<HTMLInputElement>(null);

    // Если нет аватарки, то создаем аватарку из первых букв имени и фамилии
    const avatarLetters = userData.fullname.split(" ").map(str => str[0]).join("");

    // Функция изменения аватарки
    const handleChangeImage = async (event: Event) => {
        try {
            const target = event.target as HTMLInputElement;
            const file = target.files[0];

            if (file) {
                const imageURL = URL.createObjectURL(file); // Создаем blob объект

                setAvatarUrl(imageURL); // Устанавливаем аватарку оригинал

                const data = await uploadFile(file);

                target.value = "";  // Очищаем значение инпута

                if (data && data.url) {
                    setAvatarUrl(data.url); // Устанавливаем аватарку с сервера (jpeg, обрезанную)
                    setFieldValue("avatarUrl", data.url);   // Обновляем поле avatarUrl в объекте пользователя
                } else {
                    setAvatarUrl(null); // Устанавливаем аватарку с сервера (в данном случае null)
                    setFieldValue("avatarUrl", null);   // Обновляем поле avatarUrl в объекте пользователя (null)
                }
            }
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
    };

    // Если файл изменился, вызываем функцию handleChangeImage
    React.useEffect(() => {
        if (inputFileRef.current) inputFileRef.current.addEventListener("change", handleChangeImage);
    }, []);

    return (
        <div>
            {/*Информация об экране*/}
            <StepInfo
                icon="../../../public/favicon.ico"
                title={`Okay, ${userData.fullname}!`}
                description="How is this photo?"
            />

            {/*Основная информация экрана*/}
            <WhiteBlock className={clsx("m-auto mt-40", styles.whiteBlock)}>
                {/*Аватарка*/}
                <div className={styles.avatar}>
                    <Avatar width="120px" height="120px" src={avatarUrl} letters={avatarLetters} />
                </div>

                {/*Выбор другой аватарки*/}
                <div className="mb-30">
                    <label htmlFor="image" className="link cup">Choose a different photo</label>
                </div>

                {/*Скрытый инпут*/}
                <input id="image" ref={inputFileRef} type="file" hidden />

                {/*Переход на следующий экран*/}
                <Button onClick={onNextStep}>
                    Next <img className="d-ib ml-10" src="../../../public/favicon.ico" alt="Кнопка" />
                </Button>
            </WhiteBlock>
        </div>
    )
}