export class Seat {
    /* 자리별 정보 */
    seatNo: number;
    socketId: string;
    userName?: string;
}

export class Room {
    roomNo: number;
    seats: Seat[];
}
