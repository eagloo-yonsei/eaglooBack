import { SocketIoGateway } from "src/gateway/socket.io.gateway";
export declare class RoomController {
    private readonly socketIoGateway;
    constructor(socketIoGateway: SocketIoGateway);
    getTest(): string;
    connectRoom(args: any): void;
}
