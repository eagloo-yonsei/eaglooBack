export class RoomDetail {
    /* 자리별 정보 */
    no: number;
    socketId: string;
    userName: string;
}

export class Room {
    no: number;
    details: RoomDetail[];
}
