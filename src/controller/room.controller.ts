import {
    Body,
    Controller,
    Get,
    NotAcceptableException,
    Param,
    ParseIntPipe,
    Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SocketIoGateway } from "../gateway";
import { RoomService } from "../service";

class ConnectRoomInput {}

@ApiTags("방정보")
@Controller("room")
export class RoomController {
    constructor(
        private readonly socketIoGateway: SocketIoGateway,
        private readonly roomService: RoomService
    ) {}

    @Get()
    async getRooms() {
        return this.roomService.findRooms();
    }

    @Post(":roomNo/seat/:seatNo")
    async connectRoom(
        @Param("roomNo", ParseIntPipe) roomNo: number,
        @Param("seatNo", ParseIntPipe) seatNo: number,
        @Body()
        input: ConnectRoomInput
    ) {
        if (roomNo <= 0 || roomNo >= 11 || seatNo <= 0 || seatNo >= 17) {
            throw new NotAcceptableException("올바르지 않은 형식입니다.");
        }
        const room = this.roomService.findRoomByPositionNo(roomNo, seatNo);
        if (room) {
            throw new NotAcceptableException("이미 존재하는 방입니다.");
        }
        this.roomService.addRoom(roomNo, {
            seatNo: seatNo,
            userName: "power",
            socketId: "",
        });

        // console.log("currentRooms: " , rooms);
        // console.log("room: " , room);

        // console.log("this.socketIoGateway.users: ", this.socketIoGateway.users);
        // console.log("roomNo: ", roomNo);
        // console.log("seatNo: ", seatNo);
        // console.log("input: ", input);

        return {
            ok: true,
            roomNo: Number(roomNo),
            seatNo: Number(seatNo),
            // endpoint: `http://localhost:3000/room/${roomNo}`,
        };
        // this.socketIoGateway.createRoom(room);
        // return room;
    }
}
