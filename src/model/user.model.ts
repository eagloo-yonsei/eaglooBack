import { CustomRoom } from "./room.model";

export interface User {
    id: string;
    email: string;
    nickName?: string;
    realName?: string;
    isAdmin?: boolean;
    owningRooms: CustomRoom[];
}

export interface MinimalUser {
    id: string;
    email: string;
    nickName?: string;
}

export interface ConnectedUser {
    socketId: string;
    userInfo: MinimalUser;
    roomId?: string;
    seatNo?: number;
}
