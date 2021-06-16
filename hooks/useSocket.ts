// Хук, возвращающий экземпляр socket
import React from "react";
import {io, Socket} from "socket.io-client";

export const useSocket = () => {
    // Создание сокета
    const socketRef = React.useRef<Socket>();

    if (!socketRef.current) {
        socketRef.current = typeof window !== 'undefined' && io('http://localhost:3001');
    } else {
        socketRef.current.connect();
    }

    // При размонтировании компонента, происходит отключение от сокета
    React.useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        }
    }, [])

    return socketRef.current;
}