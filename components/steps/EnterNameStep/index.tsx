// Экран ввода имени пользователя
import React from "react";
import clsx from "clsx";

import {WhiteBlock} from "../../WhiteBlock";
import {Button} from "../../Button";
import {StepInfo} from "../../StepInfo";
import {MainContext} from "../../../pages";

import styles from "./EnterNameStep.module.scss";

export const EnterNameStep = () => {
    const {onNextStep, userData, setFieldValue} = React.useContext(MainContext); // Получаем данные из контекста

    const [value, setValue] = React.useState<string>("");

    const nextDisabled = !value;

    // Функция обработки перехода на следующий экран
    const onClickNextStep = () => {
        setFieldValue("fullname", value);
        onNextStep();
    }

    // Устанавливаем значение fullname
    React.useEffect(() => {
        if (userData && userData.fullname) setValue(userData.fullname);
    }, []);

    return (
        <div className={styles.block}>
            <StepInfo
                icon="../../../public/favicon.ico"
                title="What`s your full name?"
                description="People use real names on Clubhouse ^) Thnx!"
            />
            <WhiteBlock className={clsx("m-auto", styles.whiteBlock)}>
                <div className="mb-30">
                    <input
                        className="field"
                        placeholder="Enter full name"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />

                    <Button onClick={onClickNextStep} disabled={nextDisabled}>
                        Next <img className="d-ib ml-10" src="../../../public/favicon.ico" alt="Кнопка" />
                    </Button>
                </div>
            </WhiteBlock>
        </div>
    )
}