// Компонент комнаты
import React from "react";
import {useSelector} from "react-redux";
import SimplePeer from "simple-peer";
import clsx from "clsx";
import Link from "next/link";
import {useRouter} from "next/router";

import {Button} from "../Button";
import {selectorUserData} from "../../redux/selectors";
import {UserData} from "../../pages";
import {useSocket} from "../../hooks/useSocket";
import {Speaker} from "../Speaker";

import styles from "./Room.module.scss";

interface RoomProps {
    title: string,
}

export const Room: React.FC<RoomProps> = ({title}) => {
    const [users, setUsers] = React.useState<UserData[]>([]);
    const user = useSelector(selectorUserData);

    const router = useRouter();
    const socket = useSocket();

    React.useEffect(() => {
        // Если выполняется в браузере
        if (typeof window !== "undefined") {
            // Обращаемся к браузеру для получения разрешения использования микрофона
            navigator.mediaDevices.getUserMedia({audio: true})
                .then(stream => {
                    // Создаем константу входящего сообщения Peer (инициатора)
                    const peerIncome = new SimplePeer({
                        initiator: true,
                        trickle: false,
                        stream
                    });

                    peerIncome.on('signal', signal => {
                        // Оповещаем всех пользователей о том, что мы подключились к этой комнате
                        socket.emit('CLIENT@ROOMS:CALL', {
                            user, roomId: router.query.id, signal
                        });
                    });

                    // Когда от сервера пришел запрос о том, что кто-то хочет позвонить
                    socket.on('SERVER@ROOMS:CALL', {
                        user, roomId: router.query.id, signal
                    });

                    // Когда от сервера пришел запрос о том, что кто-то хочет позвонить
                    socket.on('SERVER@ROOMS:CALL', ({user, signal}) => {
                        // Создаем константу Peer (слушатель)
                        const peerOutcome = new SimplePeer({
                            initiator: false,
                            trickle: false,
                            stream
                        });

                        // Отправляем ответ на полученный сигнал
                        peerOutcome.signal(signal);

                        // Слушаем событие прихода потока данных
                        peerOutcome
                            .on('stream', stream => {
                                document.querySelector('audio').srcObject = stream;
                                document.querySelector('audio').play();
                                console.log(stream);
                            })
                            .on('signal', signal => {
                                // Отправляем ответ пользователю, от которого пришел сигнал
                                socket.emit('CLIENT@ROOMS:ANSWER', {
                                    targetUserId: user.id, roomId: router.query.id, signal
                                });
                            })
                    });

                    // Если два пользователя хотят соединиться, находим
                    socket.emit('SERVER@ROOMS:ANSWER', ({targetUserId, signal}) => {
                        if (user.id === targetUserId) {
                            peerIncome.signal(signal);
                        }
                    });
                })
                .catch(() => {
                    console.error("Нет доступа к микрофону");
                });

            // Оповещаем всех пользователей о том, что мы подключились к этой комнате
            socket.emit('CLIENT@ROOMS:JOIN', {
                user, roomId: router.query.id
            });

            // Говорим сокету, что пользователь подключился
            socket.on('SERVER@ROOMS:JOIN', users => {
                setUsers(users);
            });

            // Говорим сокету, что нужно обновить список пользователей, если кто-то вышел из комнаты
            socket.on('SERVER@ROOMS:LEAVE', (user: UserData) => {
                setUsers(prev => prev.filter(obj => obj.id !== user.id));
            });

            setUsers(prev => [...prev, user]);
        }
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className="d-flex align-items-center justify-content-between">
                <h2>{title}</h2>
                <audio controls />
                <div className={clsx("d-flex align-items-center", styles.actionButtons)}>
                    <Link href="/rooms">
                        <Button color="gray" className={styles.leaveButton}>
                            <img width="18px" height="18px" src="" alt="Hand black"/>
                            Leave quietly
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="users">
                {
                    users.map(obj => <Speaker key={obj.fullname} {...obj} />)
                }
            </div>
        </div>
    )
}