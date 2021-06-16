// Начальный экран
import React from "react";
import {WhiteBlock} from "../../WhiteBlock";
import {Button} from "../../Button";
import {MainContext} from "../../../pages";

import styles from "./WelcomeStep.module.scss";

export const WelcomeStep = () => {
    const {onNextStep} = React.useContext(MainContext);

    return (
        <WhiteBlock className={styles.block}>
            <h3 className={styles.title}>
                <img className={styles.handWaveImg} src="../../../public/favicon.ico" alt="Celebrating" />
                Welcome to Clubhouse!
            </h3>

            <p>
                Hey, we're still opening up but anyone can join with an invite from an existing user!
            </p>

            <div>
                <Button onClick={onNextStep}>
                    Get your username
                    <img className="d-ib ml-10" src="../../../public/favicon.ico" alt="Стрелочка" />
                </Button>
            </div>
            <div className="link mt-15 cup d-ib">Have an invite text? Sign in</div>
        </WhiteBlock>
    )
}