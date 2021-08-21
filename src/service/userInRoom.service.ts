import { Injectable } from "@nestjs/common";
import { SocketToSeatInfo } from "../model";

@Injectable()
export class UserInRoomService {
    private socketToSeatInfos: SocketToSeatInfo[] = [];
    constructor() {}

    getSeatInfoBySocketId(socketId: string) {
        console.log(`(@userInRoomService) ${socketId} 정보를 탐색합니다 :`);
        console.dir(this.socketToSeatInfos);
        if (this.socketToSeatInfos.length === 0) {
            return undefined;
        }
        return this.socketToSeatInfos.find((socketToSeat) => {
            if (socketToSeat.socketId === socketId) {
                return socketToSeat;
            }
        });
    }

    addSocketToSeatInfo(
        socketId: string,
        roomId: string,
        seatNo: number,
        userEmail: string
    ) {
        this.socketToSeatInfos.push({ socketId, roomId, seatNo, userEmail });
        console.log(`(@userInRoomService) 입실 요청 이후 방 접속 유저 현황 :`);
        console.dir(this.socketToSeatInfos);
    }

    deleteSocketToSeatInfo(socketId: string) {
        console.log(
            `(@userInRoomService) ${socketId} 퇴실 요청 이전 방 접속 유저 현황 :`
        );
        console.dir(this.socketToSeatInfos);
        this.socketToSeatInfos = this.socketToSeatInfos.filter(
            (socketToSeat) => {
                return socketToSeat.socketId !== socketId;
            }
        );
        console.log(
            `(@userInRoomService) ${socketId} 퇴실 요청 이후 방 접속 현황 :`
        );
        console.dir(this.socketToSeatInfos);
    }
}
