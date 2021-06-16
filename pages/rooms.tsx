// Страница комнат
import React from "react";
import {GetServerSideProps, NextPage} from "next";
import Link from "next/link";
import {useDispatch, useSelector} from "react-redux";
import Head from "next/head";

import {Header} from "../components/Header";
import {Button} from "../components/Button";
import {ConversationCard} from "../components/ConversationCard";
import {checkAuth} from "../helpers/checkAuth";
import {StartRoomModal} from "../components/StartRoomModal";
import {Api} from "../api";
import {selectorRoom} from "../redux/selectors";
import {wrapper} from "../redux/store";
import {setRoom, setRoomSpeakers} from "../redux/slices/roomSlice";
import {useSocket} from "../hooks/useSocket";

const RoomsPage = () => {
    // Состояние для отображения модального окна
    const [visible, setVisible] = React.useState<boolean>(false);
    const dispatch = useDispatch();
    const rooms = useSelector(selectorRoom);
    const socket = useSocket();

    React.useEffect(() => {
        socket.on('SERVER@ROOMS:HOME', ({roomId, speakers}) => {
            dispatch(setRoomSpeakers({roomId, speakers}));
        });
    }, []);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>Clubhouse</title>
            </Head>
            <Header/>
            <div className="container">
                <div className="mt-40 d-flex align-items-center justify-content-between">
                    <h1>All conversations</h1>
                    <Button onClick={() => setVisible(true)} color="green">+ Start room</Button>
                </div>

                {visible ? <StartRoomModal onClose={() => setVisible(false)}/> : null}

                <div className="grid mt-30">
                    {
                        rooms && rooms.map(obj => {
                            return <Link key={obj.id} href={`/rooms/${obj.id}`}>
                                <a className="d-flex">
                                    <ConversationCard
                                        title={obj.title}
                                        avatars={[]}
                                        speakers={obj.speakers}
                                        listenersCount={obj.listenersCount}
                                        speakersCount={obj.speakersCount}
                                    />
                                </a>
                            </Link>
                        })
                    }
                </div>
            </div>
        </>
    )
}

// Перед тем. как показать страницу пользователю, будет идти запрос, после данные передаются как
// пропс комопненту Room
// Данная функция отрабатывает только на бекенде, чтобы проверить, что пользователь авторизирован (имеет токен) нужно
// взять из контекста (параметр ctx) куки браузера
export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(async (ctx) => {
    try {
        const user = await checkAuth(ctx);  // Проверяем, авторизирован ли пользователь

        if (!user || !user.isActive) {
            return {
                props: {},
                redirect: {
                    permanent: false,
                    destination: "/"
                }
            }
        }

        const rooms = await Api(ctx).getRooms();

        ctx.store.dispatch(setRoom(rooms));

        return {props: {}};
    } catch (e) {
        console.log("При получении объектов: ", e);

        return {props: {}};
    }
})

export default RoomsPage;