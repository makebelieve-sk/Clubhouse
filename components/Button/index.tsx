// Компонент кнопки "Next"
import React from "react";
import clsx from "clsx";

import styles from "./Button.module.scss";

const colors = {
    green: styles.buttonGreen,
    gray: styles.buttonGrey,
    blue: styles.buttonBlue
};

interface ButtonProps {
    disabled?: boolean;
    color?: keyof typeof colors;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
    className?: string;
}

export const Button: React.FC<ButtonProps> = ({children, disabled, color, onClick, className}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            disabled={disabled}
            className={clsx(className, styles.button, colors[color])}
        >
            {children}
        </button>
    )
}