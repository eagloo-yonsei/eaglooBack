import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Channel } from "src/constants";
import { Room } from "src/model/room.model";

// 채팅방에참여하면 1. POST요청 → 2. response으로 프론트 구성 → 서버와 스트림 통신이 가능.
@WebSocketGateway()
export class SocketIoGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    private wss: Server;

    afterInit(server: Server) {}
    handleConnection(client: Socket, ...args: any[]) {}
    handleDisconnect(client: Socket) {}

    @SubscribeMessage("message_send")
    sendMessage(client: Socket, message: string) {}

    enter(room: Room) {
        this.wss.emit("accepted", `회원정보 반환값`);
        console.log(`새 유저 입장, 방인원 : `, room.users?.length);
        // this.wss.emit(Channel.다른유저참여);
    }
}
