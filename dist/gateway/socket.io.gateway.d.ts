import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Room } from "src/model/room.model";
export declare class SocketIoGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private wss;
    afterInit(server: Server): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: Socket): void;
    sendMessage(client: Socket, message: string): void;
    enter(room: Room): void;
}
