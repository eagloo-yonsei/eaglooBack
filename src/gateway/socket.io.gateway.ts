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

    // 소켓이 연결되었을 때 자동으로 실행
    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log("new Socket connected: ", client.id);
        console.log("Client connected: ", args);
    }

    // 소켓 연결이 해제되었을 때 자동으로 실행
    handleDisconnect(socket: Socket) {
        // 해제된 클라이언트 정보를 서버측 방 정보에서 제거
        const roomDetail = this.roomService.deleteRoomDetailBySocketId(
            socket.id
        );
        this.wss.emit("DISCONNECT", roomDetail?.no);
        console.log("handleDisconnect: ", socket.id);
    }

    /** 방참가 */
    // 1. 새로운 참여자로부터 JOIN 신호 수신
    @SubscribeMessage(Channel.JOIN)
    join(socket: Socket, payload: { roomNo: number; positionNo: number }) {
        // 소켓 및 서버의 RoomService에 새로운 참여자의 정보를 추가
        socket.join("room" + payload.roomNo);
        const room = this.roomService.updateRoom(payload.roomNo, {
            no: payload.positionNo,
            socketId: socket.id,
            userName: "power",
        });
        // 같은 방의 기존 참여자 정보 추출
        const beforeRoom =
            room?.details?.filter((v) => v.socketId !== socket.id) || [];

        // 새로운 참여자에게 기존 참여자들의 정보 전달
        socket.emit(Channel.GET_CURRENT_ROOM, beforeRoom);
    }

    // 새로운 참여자가 자신의 기존의 참여자 각각에게 보내는 signal.
    // (front 단의 createPeer() 부분에서 emit 됨)
    @SubscribeMessage(Channel.SENDING_SIGNAL)
    sendingSignal(socket: Socket, payload) {
        this.wss.to(payload.userToSignal).emit(Channel.NEW_USER, {
            signal: payload.signal,
            callerId: payload.callerId,
            no: payload.no,
        });
    }

    // 기존 참여자가 새로운 참여자에게 자신의 스트림 정보를 전송
    // (front 단의 addPeer() 부분에서 emit 됨)
    @SubscribeMessage(Channel.RETURNING_SIGNAL)
    returningSignal(socket: Socket, payload) {
        this.wss.to(payload.callerId).emit(Channel.RECEIVING_SIGNAL, {
            signal: payload.signal,
            id: socket.id,
        });
    }
}
