// Компонент ввода номера телефона
import React from "react";
import clsx from "clsx";
import NumberFormat from "react-number-format";

import {StepInfo} from "../../StepInfo";
import {WhiteBlock} from "../../WhiteBlock";
import {Button} from "../../Button";
import {MainContext} from "../../../pages";
import {Axios} from "../../../core/axios";

import styles from "./EnterPhoneStep.module.scss";
import Cookies from "js-cookie";

type InputValueState = {
    formattedValue: string,
    value: string
}

export const EnterPhoneStep = () => {
    const {onNextStep, setFieldValue} = React.useContext(MainContext); // Достаем данные из контекста
    const [values, setValues] = React.useState<InputValueState>({} as InputValueState); // Номер телефона
    const [loading, setLoading] = React.useState(false);    // Состояние загрузки кнопки

    const nextDisabled = !values.formattedValue || values.formattedValue.includes("_");

    // Обработка нажатия на кнопку "Next"
    const onSubmit = async () => {
        try {
            setLoading(true);
            await Axios.get(`/auth/sms?phone=${values.value}`);   // тправляем запрос на сервер (отправка смс-кода, проверка номера пользователя)
            setFieldValue("phone", values.value);  // Обновляем номер в объекте пользователя
            onNextStep();   // Переход на след. экран
        } catch (err) {
            console.warn("Возникла ошибка при отправке SMS: " + err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.block}>
            <StepInfo
                icon="../../../public/favicon.ico"
                title="Enter your phone #"
                description="We will send you a confirmation code"
            />
            <WhiteBlock className={(clsx("m-auto mt-30", styles.whiteBlock))}>
                <div className={clsx("mb-30", styles.input)}>
                    <img src="../../../public/favicon.ico" alt="Флаг" />
                    <NumberFormat
                        className="field"
                        format="+# (###) ###-##-##"
                        mask="_"
                        placeholder="+7 (999) 333-22-11"
                        value={values.value}
                        onValueChange={({formattedValue, value}) => setValues({formattedValue, value})}
                    />
                </div>

                <Button disabled={loading || nextDisabled} onClick={onSubmit}>
                    {
                        loading
                            ? "sending..."
                            : <>Next <img className="d-ib ml-10" src="../../../public/favicon.ico" alt="Next" /></>
                    }
                </Button>
                <p className={clsx(styles.policyText, "mt-30")}>
                    By entering your number, you`re agreeng to your Terms of Service and Privacy Policy. Thanks!
                </p>
            </WhiteBlock>
        </div>
    )
}