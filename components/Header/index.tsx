// Хедер приложения
import React from "react";
import Link from "next/link";

import styles from "./Header.module.scss";
import clsx from "clsx";
import {Avatar} from "../Avatar";
import {selectorUserData} from "../../redux/selectors";
import {useSelector} from "react-redux";

export const Header: React.FC = () => {
    const userData = useSelector(selectorUserData);

    return (
        <div className={styles.header}>
            <div className="container d-flex align-items-center justify-content-between">
                <Link href="/rooms">
                    <div className={clsx(styles.headerLogo, "d-flex align-items-center cup")}>
                        <img src="../../../public/favicon.ico" alt="Logo" className="mr-5" />
                        <h4>Clubhouse</h4>
                    </div>
                </Link>

                <Link href="/profile/1">
                    <div className="d-flex align-items-center cup">
                        <b className="mr-5">{userData.fullname}</b>

                        <Avatar src={userData.avatarUrl} width="50px" height="50px" />
                    </div>
                </Link>
            </div>
        </div>
    )
}