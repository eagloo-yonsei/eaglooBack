import { Seat } from "./room.model";

export class CustomRoom {
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

export class CustomRoomDB {
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
