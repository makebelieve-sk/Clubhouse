import {RootState} from "./types";

export const selectorRoom = (state: RootState) => state.rooms.items;
export const selectorUserData = (state: RootState) => state.user.data;