// Содержит в себе методы для работы с комнатами
import {AxiosInstance} from "axios";
import {UserData} from "../pages";

export type UserWithRoomId = UserData & { roomId: number };

export interface Room {
    id: number,
    title: string,
    speakers: UserWithRoomId,
    listenersCount: number,
    speakersCount: number
}

export type RoomType = "open" | "social" | "closed";

export const RoomApi = (Axios: AxiosInstance) => {
    return {
        getRooms: async (): Promise<Room[]> => {
            const {data} = await Axios.get("/rooms");
            return data;
        },
        getRoom: async (id: string): Promise<Room> => {
            const {data} = await Axios.get(`/rooms/${id}`);
            return data;
        },
        createRoom: async (form: {title: string, type: RoomType}): Promise<Room> => {
            const {data} = await Axios.post("/rooms", form);
            return data;
        },
        deleteRoom: async (id: number): Promise<string> => {
            const {data} = await Axios.delete(`/rooms/${id}`);
            return data;
        },
    }
}