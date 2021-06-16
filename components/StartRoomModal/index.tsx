// Компонент модального окна создания комнаты
import React from "react";
import clsx from "clsx";
import {useRouter} from "next/router";

import {fetchCreateRoom} from "../../redux/slices/roomSlice";
import {useAction} from "../../hooks/useAction";
import {Button} from "../Button";
import {Room, RoomType} from "../../api/RoomApi";

import styles from "./startRoomModal.module.scss";

interface StartRoomModalProps {
    onClose: () => void
}

export const StartRoomModal: React.FC<StartRoomModalProps> = ({onClose}) => {
    const [form, setForm] = React.useState<{title: string, type: RoomType}>({title: "", type: "open"});
    const createRoom = useAction(fetchCreateRoom);

    const router = useRouter();

    const onSubmit = async () => {
        try {
            if (!form.title) {
                return alert("Укажите заголовок комнаты");
            }

            const data: Room = await createRoom(form);
            await router.push('/rooms/' + data.id);
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <img width="24px" height="24px" src="/static/close.svg" alt="Close" className={styles.closeBtn}
                     onClick={onClose}/>

                <div className="mb-30">
                    <h3>Topic</h3>
                    <input
                        className={styles.inputTitle}
                        placeholder="Enter the topic to be discussed"
                        value={form.title}
                        onChange={e => setForm({...form, title: e.target.value})}
                    />
                </div>

                <div className="mb-30">
                    <h3>Room type</h3>
                    <div className="d-flex justify-content-between">
                        <div onClick={() => setForm({...form, type: "open"})}
                             className={clsx(styles.roomType, {[styles.roomTypeActive]: form.type === "open"})}>
                            <img width="70px" height="70px" src="/static/room-type-1.png" alt="Room type" />
                            <h5>Open</h5>
                        </div>

                        <div onClick={() => setForm({...form, type: "closed"})}
                             className={clsx(styles.roomType, {[styles.roomTypeActive]: form.type === "closed"})}>
                            <img width="70px" height="70px" src="/static/room-type-3.png" alt="Room type" />
                            <h5>Closed</h5>
                        </div>
                    </div>
                </div>

                <div className={styles.delimiter}>
                    <div className="text-center">
                        <h3>Start a room open to everyone</h3>
                        <Button onClick={onSubmit} color="green">
                            <img width="18px" height="18px" src="/static/celebration.png" alt="Celebration" />
                            Let`s go
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}