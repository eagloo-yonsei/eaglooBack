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
import { RoomService, UserService } from "src/service";
import { Channel } from "src/constants";
import { ChattingContent, RoomType, Seat, MinimalUser } from "src/model";
import Peer from "simple-peer";

@WebSocketGateway()
export class AppSocketIoGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer()
    private wss: Server;
    private logger: Logger = new Logger("App_Socke_IO_Gateway");

    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService
    ) {}

    afterInit(server: Server) {
        this.logger.log("App WSS Initialized");
    }

    // 소켓이 연결되었을 때
    handleConnection(socket: Socket) {
        this.logger.log("새 유저 로그인 ", socket.id);

        if (typeof socket.handshake.query.userInfo === "string") {
            this.userService.connectUser(
                socket.id,
                JSON.parse(socket.handshake.query.userInfo) as MinimalUser
            );
        }
    }

    // 소켓 연결이 해제되었을 때
    handleDisconnect(socket: Socket) {
        const disconnectedUserInfo = this.userService.getConnectedUserInfo(
            socket.id
        );

        if (!disconnectedUserInfo) {
            this.logger.log(
                `${socket.id} 소켓 연결 해제 중 오류가 발생했습니다 : 일치하는 사용자 정보가 없습니다.`
            );
        } else {
            this.logger.log(
                `(@App Socket) ${socket.id}(${disconnectedUserInfo.userInfo.email}) 소켓 연결 해제`
            );
            this.userService.disconnectUser(socket.id);
            if (disconnectedUserInfo.roomId && disconnectedUserInfo.seatNo) {
                this.logger.log(
                    `(@App Socket) ${disconnectedUserInfo.roomId}방 ${disconnectedUserInfo.seatNo}번 자리 유저(${disconnectedUserInfo.userInfo.email}) 퇴실`
                );

                const quitRoom = this.roomService.quitRoom(
                    disconnectedUserInfo.roomId,
                    disconnectedUserInfo.seatNo
                );

                // console.log(`(@App Socket) ${quitRoom.id} 방 정보:`);
                // console.dir(quitRoom.seats);

                quitRoom?.seats?.forEach((seat) => {
                    this.wss
                        .to(seat.socketId)
                        .emit(
                            Channel.PEER_QUIT_ROOM,
                            disconnectedUserInfo.seatNo
                        );
                });
            }
        }
    }

    /* 1. 방 참여 */
    @SubscribeMessage(Channel.JOIN_ROOM)
    joinRoom(
        socket: Socket,
        payload: { roomType: RoomType; roomId: string; newSeat: Seat }
    ) {
        /* 2. 새로운 참여자에게 기존 참여자 정보 전달 */
        const currentRoom = this.roomService.joinRoom(
            payload.roomType,
            payload.roomId,
            {
                ...payload.newSeat,
                socketId: socket.id,
            }
        );

        if (currentRoom) {
            this.userService.joinRoom(
                socket.id,
                // payload.newSeat.userEmail,
                payload.roomId,
                payload.newSeat.seatNo
            );
            // this.logger.log(`${socket.id}(${payload.newSeat.userEmail})이 ${currentRoom.roomName}에 입장`)
            socket.emit(Channel.GET_CURRENT_ROOM, currentRoom);
        }
    }

    /* 3. 기존 사용자에게 연결 요청 (front의 createPeer() 부분에서 호출) */
    @SubscribeMessage(Channel.REQUEST_PEER_CONNECTION)
    requestPeerConnection(
        socket: Socket,
        payload: {
            userToSignal: string;
            signal: Peer.SignalData;
            callerSeatInfo: Seat;
        }
    ) {
        /* 4. 기존 참여자에게 연결 요청 전달 */
        // const requestedPeer = this.userService.getConnectedUserInfo(
        //     payload.userToSignal
        // );
        // console.log(
        //     `${payload.callerSeatInfo.seatNo}가 ${requestedPeer.seatNo}에게 연결 요청`
        // );
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
    acceptPeerConnectionRequest(
        socket: Socket,
        payload: { callerId: string; signal: Peer.SignalData }
    ) {
        /* 6. 신규 참여자에게 연결 수락 요청 전달 */
        // console.log(`${accepter.seatNo}가 ${caller.seatNo}의 연결 요청 수락`);
        this.wss
            .to(payload.callerId)
            .emit(Channel.PEER_CONNECTION_REQUEST_ACCEPTED, {
                signal: payload.signal,
                id: socket.id,
            });
    }

    /* 퇴실시 */
    @SubscribeMessage(Channel.QUIT_ROOM)
    quitRoom(socket: Socket, payload: { roomId: string; seatNo: number }) {
        this.userService.quitRoom(socket.id);
        const quitRoom = this.roomService.quitRoom(
            payload.roomId,
            payload.seatNo
        );

        quitRoom?.seats?.forEach((seat) => {
            this.wss
                .to(seat.socketId)
                .emit(Channel.PEER_QUIT_ROOM, payload.seatNo);
        });
    }

    exile(roomId: string, seatNo: number, message: string) {
        const beExiledId = this.roomService.findSeat(roomId, seatNo);
        if (beExiledId) {
            this.wss.to(beExiledId).emit(Channel.EXILED, message);
            return { success: true, message: "유저가 퇴출되었습니다." };
        }
        return {
            success: false,
            message: "조건에 맞는 유저가 없습니다",
        };
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
