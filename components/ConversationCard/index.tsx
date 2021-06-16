import React from "react";
import clsx from "clsx";

import {Avatar} from "../Avatar";

import whiteBlockStyles from "../WhiteBlock/WhiteBlock.module.scss";
import {UserData} from "../../pages";
import styles from "./conversationCard.module.scss";

interface ConversationCardProps {
    title: string,
    speakers: UserData[],
    avatars: string[],
    listenersCount: number,
    speakersCount: number
}

export const ConversationCard: React.FC<ConversationCardProps> = ({title, speakers = [], avatars = [], listenersCount, speakersCount}) => {
    return (
        <div className={clsx(whiteBlockStyles.block, styles.card, "mb-30")}>
            <h4 className={styles.title}>{title}</h4>

            <div className={clsx("d-flex mt-10", styles.content)}>
                <div className={styles.avatars}>
                    {
                        speakers && speakers.map((user, index) => (
                            <Avatar
                                key={user.avatarUrl}
                                width="45px"
                                height="45px"
                                src={user.avatarUrl}
                                className={speakers.length > 1 && index === speakers.length ? "lastAvatar" : ""}
                            />
                        ))
                    }
                </div>

                <div className={clsx(styles.info, "ml-10")}>
                    <ul className={styles.users}>
                        {
                            speakers && speakers.map(user => (
                                <li key={user.id}>
                                    {user.fullname} <img alt="Cloud" src={user.avatarUrl} width={14} height={14} />
                                </li>
                            ))
                        }
                    </ul>
                    <ul className={styles.details}>
                        <li>
                            {listenersCount} <img src="../../../public/favicon.ico" alt="Users" width={12} height={12} />
                        </li>
                        <li>
                            {speakersCount}
                            <img
                                src="../../../public/favicon.ico"
                                alt="Users Count"
                                className="ml-5"
                                width={5}
                                height={5}
                            />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}