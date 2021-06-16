import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Room, RoomApi, RoomType} from "../../api/RoomApi";
import {Axios} from "../../core/axios";
import rooms from "../../pages/rooms";
import {HYDRATE} from "next-redux-wrapper";
import {RootState} from "../types";
import {UserData} from "../../pages";

export type RoomSliceState = {
    items: Room[],
}

const initialState: RoomSliceState = {
    items: []
}

export const fetchCreateRoom = createAsyncThunk<Room, {title: string, type: RoomType}>(
    '/rooms/fetchCreateRoomStatus',
    async ({title, type}) => {
        try {
            return await RoomApi(Axios).createRoom({title, type});
        } catch (e) {
            console.log(e);
            throw new Error("Произошла ошибка при создании комнаты");
        }
    }
);

// Создание слайса (включает в себя initialState и actions)
export const roomSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<Room[]>) => {
            state.items = action.payload;
        },
        setRoomSpeakers: (state, action: PayloadAction<{ speakers: Room["speakers"], roomId: number }>) => {
            state.items = state.items.map(room => {
                if (room.id === action.payload.roomId) {
                    room.speakers = action.payload.speakers;
                }

                return room;
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCreateRoom.fulfilled.type, (state, action: PayloadAction<Room> | null) => {
                state.items.push(action.payload);
            })
            .addCase(HYDRATE as any, (state, action: PayloadAction<RootState>) => {
                state.items = action.payload.rooms.items;
            })
    }
});

export const {setRoom, setRoomSpeakers} = roomSlice.actions;

export const roomsReducer = roomSlice.reducer;