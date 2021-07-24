import { Injectable, Logger } from "@nestjs/common";
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomService } from "../service";

enum Channel {
    JOIN = "JOIN",
    DISCONNECT = "DISCONNECT",
    GET_CURRENT_ROOM = "GET_CURRENT_ROOM",
    JOIN_ROOM = "JOIN_ROOM",
    NEW_USER = "NEW_USER",
    RECEIVING_SIGNAL = "RECEIVING_SIGNAL",
    SENDING_SIGNAL = "SENDING_SIGNAL",
    RETURNING_SIGNAL = "RETURNING_SIGNAL",
}

@WebSocketGateway()
export class SocketIoGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    private wss: Server;
    private logger: Logger = new Logger("AppGateway");

    public users = {};
    public socketToRoom = {};

    constructor(private readonly roomService: RoomService) {}

    afterInit(server: Server) {
        this.logger.log("Initialized!");
    }

    // 소켓이 연결되었을 때
    handleConnection(client: Socket, ...args: any[]) {
        // this.logger.log("new Socket connected: ", client.id);
        console.log("Client connected: ", client.id);
    }

    // 소켓 연결이 해제되었을 때
    handleDisconnect(socket: Socket) {
        // 해제된 클라이언트 정보를 서버측 방 정보에서 제거
        const roomDetail = this.roomService.deleteRoomDetailBySocketId(
            socket.id
        );
        this.wss.emit("DISCONNECT", roomDetail?.seatNo);
        console.log("handleDisconnect: ", socket.id);
    }

    /* 1. 방참가 */
    @SubscribeMessage(Channel.JOIN)
    join(
        socket: Socket,
        payload: { roomNo: number; seatNo: number; userName?: string }
    ) {
        console.log(
            `${socket.id}가 ${payload.roomNo}번 방 ${payload.seatNo}에 입장`
        );
        // 소켓 room 및 서버의 RoomService에 신규 참여자의 정보를 추가
        // socket.join("room" + payload.seatNo);
        const room = this.roomService.joinRoom(payload.roomNo, {
            seatNo: payload.seatNo,
            socketId: socket.id,
            userName: payload.userName,
        });

        // 같은 방의 기존 참여자 정보 추출
        const beforeRoomDetail =
            room?.seats.filter((seat) => seat.socketId !== socket.id) || [];

        console.log(`기존 참여자 정보 : ${beforeRoomDetail}`);

        /* 2. 신규 참여자에게 기존 사용자들 정보 발신 */
        socket.emit(Channel.GET_CURRENT_ROOM, beforeRoomDetail);
    }

    /* 3. 기존 사용자에게 연결 요청 (front의 createPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.SENDING_SIGNAL)
    sendingSignal(socket: Socket, payload) {
        /* 4. 기존 참여자에게 연결 요청 전달 */
        console.log(`${socket.id}가 ${payload.userToSignal}에게 연결 요청`);
        this.wss.to(payload.userToSignal).emit(Channel.NEW_USER, {
            signal: payload.signal,
            callerId: payload.callerId,
            seatNo: payload.seatNo,
        });
    }

    /* 5. 기존 참여자가 신규 참여자의 연결 요청 수락 (front의 addPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.RETURNING_SIGNAL)
    returningSignal(socket: Socket, payload) {
        /* 6. 신규 참여자에게 연결 수락 요청 전달 */
        console.log(`${socket.id}가 ${payload.callerId}의 연결 요청 수락`);
        this.wss.to(payload.callerId).emit(Channel.RECEIVING_SIGNAL, {
            signal: payload.signal,
            id: socket.id,
        });
    }
}
