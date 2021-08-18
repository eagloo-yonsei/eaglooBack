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
import { Channel } from "src/constants";
import { ChattingContent, Seat } from "src/model";
import { CustomRoomService } from "../service";

@WebSocketGateway({ namespace: "/customroom" })
export class CustomRoomSocketIoGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    private wss: Server;
    private logger: Logger = new Logger("CustomRoomGateway");

    constructor(private readonly customRoomService: CustomRoomService) {}

    afterInit(server: Server) {
        this.logger.log("Initialized!");
    }

    // 소켓이 연결되었을 때
    handleConnection(socket: Socket, ...args: any[]) {
        // this.logger.log("new Socket connected: ", socket.id);
        console.log(
            "Client connected to Custom Room Socket Server: ",
            socket.id
        );
    }

    // 소켓 연결이 해제되었을 때
    handleDisconnect(socket: Socket) {
        // 해제된 클라이언트 정보를 서버측 방 정보에서 제거
        const exitedUserInfo =
            this.customRoomService.deleteRoomDetailBySocketId(socket.id);
        const exitedRoom = this.customRoomService.findRoom(
            exitedUserInfo.roomId
        );
        exitedRoom?.seats.forEach((seat) => {
            this.wss
                .to(seat.socketId)
                .emit(Channel.DISCONNECT, exitedUserInfo.seatNo);
        });
        console.log(
            `${exitedUserInfo.roomId}방 ${exitedUserInfo.seatNo}자리 유저가 퇴장함`
        );
    }

    /* 1. 방참가 */
    @SubscribeMessage(Channel.JOIN)
    join(
        socket: Socket,
        payload: {
            roomId: string;
            newSeat: Seat;
        }
    ) {
        console.log(
            `${socket.id}가 ${payload.roomId}방 ${payload.newSeat.seatNo}에 입장`
        );
        const room = this.customRoomService.joinRoom(
            payload.roomId,
            payload.newSeat
        );

        // 같은 방의 기존 참여자 정보 추출
        const beforeRoomDetail =
            room?.seats.filter((seat) => seat.socketId !== socket.id) || [];

        // console.log(`기존 참여자 정보 : ${beforeRoomDetail}`);

        /* 2. 신규 참여자에게 기존 사용자들 정보 발신 */
        socket.emit(Channel.GET_CURRENT_ROOM, beforeRoomDetail);
    }

    /* 3. 기존 사용자에게 연결 요청 (front의 createPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.SENDING_SIGNAL)
    sendingSignal(socket: Socket, payload) {
        /* 4. 기존 참여자에게 연결 요청 전달 */
        // console.log(`${socket.id}가 ${payload.userToSignal}에게 연결 요청`);
        this.wss.to(payload.userToSignal).emit(Channel.NEW_USER, {
            signal: payload.signal,
            callerSeatInfo: payload.callerSeatInfo,
        });
    }

    /* 5. 기존 참여자가 신규 참여자의 연결 요청 수락 (front의 addPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.RETURNING_SIGNAL)
    returningSignal(socket: Socket, payload) {
        /* 6. 신규 참여자에게 연결 수락 요청 전달 */
        // console.log(`${socket.id}가 ${payload.callerId}의 연결 요청 수락`);
        this.wss.to(payload.callerId).emit(Channel.RECEIVING_SIGNAL, {
            signal: payload.signal,
            id: socket.id,
        });
    }

    @SubscribeMessage("exile")
    exile(payload: { roomId: string; seatNo: number }) {
        const beExiledId = this.customRoomService.findSeat(
            payload.roomId,
            payload.seatNo
        );
        if (beExiledId) {
            this.wss.to(beExiledId).emit("exile");
        }
    }

    receiveChatting(
        userSeatNo: number,
        chattingContent: ChattingContent,
        receivingSeats: Seat[]
    ) {
        try {
            receivingSeats.forEach((seat) => {
                if (seat.seatNo !== userSeatNo) {
                    this.wss.to(seat.socketId).emit(Channel.RECEIVE_CHATTING, {
                        chattingContent: chattingContent,
                    });
                }
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}
