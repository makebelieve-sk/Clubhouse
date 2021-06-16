// Информация о шаге (на каждом экране)
import React from "react";
import clsx from "clsx";

import styles from "./StepInfo.module.scss";

interface StepInfoProps {
    icon: string;
    title: string;
    description?: string
}

export const StepInfo: React.FC<StepInfoProps> = ({icon, title, description}) => {
    return (
        <div className={clsx(styles.block, "text-center")}>
            <div>
                <img className={styles.img} src={icon} alt="Иконка" />
            </div>

            <b className={styles.title}>{title}</b>
            {
                description ? <p className={styles.description}>{description}</p> : null
            }
        </div>
    )
}