export interface Seat {
    /* 자리별 정보 */
    socketId: string;
    seatNo: number;
    userEmail: string;
    userNickName?: string;
    endTime: number;
}

export enum RoomType {
    PUBLIC = "PUBLIC",
    CUSTOM = "CUSTOM",
}

export interface Room {
    id: string;
    roomName: string;
    roomDescription?: string;
    seats: Seat[];
}

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
