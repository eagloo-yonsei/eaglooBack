import { Logger } from "@nestjs/common";
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
import { CustomRoomService, UserInRoomService } from "../service";

@WebSocketGateway({ namespace: "/customroom" })
export class CustomRoomSocketIoGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    private wss: Server;
    private logger: Logger = new Logger("CustomRoomGateway");

    constructor(
        private readonly customRoomService: CustomRoomService,
        private readonly userInRoomService: UserInRoomService
    ) {}

    afterInit(server: Server) {
        this.logger.log("CustomRoom WSS Initialized");
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
        console.info(`${socket.id} disconnected :`);
        const exitedUserInfo = this.userInRoomService.getSeatInfoBySocketId(
            socket.id
        );

        if (!exitedUserInfo) {
            console.log(
                `${socket.id} 소켓 연결 해제 중 오류가 발생했습니다 : 일치하는 사용자 정보가 없습니다.`
            );
        } else {
            console.log(
                `(@Custom Room Socket) ${exitedUserInfo.roomId}방 ${exitedUserInfo.seatNo}번 자리 유저(${exitedUserInfo.userEmail}) 퇴실`
            );

            this.userInRoomService.deleteSocketToSeatInfo(socket.id);

            this.customRoomService.quitRoom(
                exitedUserInfo.roomId,
                exitedUserInfo.seatNo
            );

            const exitedRoom = this.customRoomService.getRoom(
                exitedUserInfo.roomId
            );

            // console.log(`(@publicRoomSocket) ${exitedRoom.id} 방 정보:`);
            // console.dir(exitedRoom.seats);

            exitedRoom?.seats?.forEach((seat) => {
                this.wss
                    .to(seat.socketId)
                    .emit(Channel.DISCONNECT, exitedUserInfo.seatNo);
            });
        }
    }

    /* 3. 기존 사용자에게 연결 요청 (front의 createPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.REQUEST_PEER_CONNECTION)
    sendingSignal(socket: Socket, payload) {
        /* 4. 기존 참여자에게 연결 요청 전달 */
        // console.log(`${socket.id}가 ${payload.userToSignal}에게 연결 요청`);
        this.wss
            .to(payload.userToSignal)
            .emit(Channel.PEER_CONNECTION_REQUESTED, {
                signal: payload.signal,
                callerSeatInfo: payload.callerSeatInfo,
            });
    }

    /* 5. 기존 참여자가 신규 참여자의 연결 요청 수락 (front의 addPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.ACCEPT_PEER_CONNECTION_REQUEST)
    returningSignal(socket: Socket, payload) {
        /* 6. 신규 참여자에게 연결 수락 요청 전달 */
        // console.log(`${socket.id}가 ${payload.callerId}의 연결 요청 수락`);
        this.wss
            .to(payload.callerId)
            .emit(Channel.PEER_CONNECTION_REQUEST_ACCEPTED, {
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
