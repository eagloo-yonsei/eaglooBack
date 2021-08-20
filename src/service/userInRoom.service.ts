import { Injectable } from "@nestjs/common";
import { SocketToSeatInfo } from "../model";

@Injectable()
export class UserInRoomService {
    private socketToSeatInfos: SocketToSeatInfo[] = [];
    constructor() {}

    getSeatInfoBySocketId(socketId: string) {
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
        // console.log(`(@userInRoomService) socketToSeatInfo :`);
        // console.dir(this.socketToSeatInfos);
    }

    deleteSocketToSeatInfo(socketId: string) {
        this.socketToSeatInfos = this.socketToSeatInfos.filter(
            (socketToSeat) => {
                return socketToSeat.socketId !== socketId;
            }
        );
        // console.log(`(@userInRoomService) users after quit :`);
        // console.dir(this.socketToSeatInfos);
    }
}
