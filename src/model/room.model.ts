export class Seat {
    /* 자리별 정보 */
    seatNo: number;
    socketId: string;
    userName?: string;
}

export class Room {
    id: string;
    roomName: string;
    roomDescription?: string;
    seats: Seat[];
}
