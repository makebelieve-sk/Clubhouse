// Экран заполения кода активации
import React from "react";
import {useRouter} from "next/router";
import clsx from "clsx";

import {StepInfo} from "../../StepInfo";
import {WhiteBlock} from "../../WhiteBlock";
import {Button} from "../../Button";
import {Axios} from "../../../core/axios";
import {MainContext} from "../../../pages";

import styles from "./EnterCodeStep.module.scss";

export const EnterCodeStep = () => {
    const {setFieldValue} = React.useContext(MainContext); // Достаем функцию перехода на след экран из контекста

    // Используем хук useRouter для редиректа пользовтеля на след страницу (после успешного прохождения активации)
    const router = useRouter();

    const [codes, setCodes] = React.useState<string[]>(["", "", "", ""]);   // Массив значений
    const [isLoading, setLoading] = React.useState<boolean>(false);         // Состояние загрузки кнопки

    const nextDisabled = codes.some(v => !v);

    // Обработка изменения инпута файла
    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = Number(event.target.getAttribute("id")) - 1;
        const value = event.target.value;

        setCodes(prev => {
            const newArr = [...prev];
            newArr[id] = value;

            return newArr;
        });

        // Передаем фокус следующему узлу (в нашем случае следующему инпуту) или если элемент последний, то вызываем onSubmit
        event.target.nextSibling ? (event.target.nextSibling as HTMLElement).focus() : onSubmit([...codes, value].join(""));
    }

    // Обработка нажатия на кнопку "Next"
    const onSubmit = async (code: string) => {
        try {
            setLoading(true);
            await Axios.get(`/auth/sms/activate?code=${code}`);
            setFieldValue("isActive", 1);
            await router.push("/rooms");
        } catch(e) {
            console.warn(e.message);
            alert("Ошибка при активации: " + e.message);
            setLoading(false);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.block}>
            {
                !isLoading ? <>
                    <StepInfo icon="../../../public/favicon.ico" title="Enter your activate code" description={null}/>
                    <WhiteBlock className={(clsx("m-auto", styles.whiteBlock))}>
                        <div className={styles.codeInput}>
                            <input type="tel" placeholder="X" maxLength={1} id="1" onChange={handleChangeInput} value={codes[0]} />
                            <input type="tel" placeholder="X" maxLength={1} id="2" onChange={handleChangeInput} value={codes[1]} />
                            <input type="tel" placeholder="X" maxLength={1} id="3" onChange={handleChangeInput} value={codes[2]} />
                            <input type="tel" placeholder="X" maxLength={1} id="4" onChange={handleChangeInput} value={codes[3]} />
                        </div>
                    </WhiteBlock>
                </> : <div className="text-center">
                    <div className="loader" />
                    <h3 className="mt-5">Activation in progress ...</h3>
                </div>
            }
        </div>
    )
}