export interface User {
    id: string;
    email: string;
    nickName?: string;
}

export interface ConnectedUser {
    socketId: string;
    userInfo: User;
    roomId?: string;
    seatNo?: number;
}
