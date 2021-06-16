import {UserSliceState} from "./slices/userSlice";
import {RoomSliceState} from "./slices/roomSlice";

export type RootState = {
    user: UserSliceState,
    rooms: RoomSliceState
}