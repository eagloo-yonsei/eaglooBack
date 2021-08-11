import { Seat } from "./room.model";

export interface CustomRoom {
    id: string;
    roomName: string;
    roomDescription?: string;
    ownerId: string;
    openToPublic: boolean;
    usePassword: boolean;
    password?: string;
    allowMic: boolean;
    seats: Seat[];
}

export interface CustomRoomDB {
    id: string;
    roomName: string;
    roomDescription?: string;
    ownerId: string;
    openToPublic: boolean;
    usePassword: boolean;
    password?: string;
    allowMic: boolean;
}

export interface CustomRoomCreationProp {
    roomName: string;
    roomDescription?: string;
    ownerId: string;
    openToPublic: boolean;
    usePassword: boolean;
    password?: string;
    allowMic: boolean;
}
