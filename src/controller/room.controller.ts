import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SocketIoGateway } from "../gateway";
import { RoomService } from "../service";

@ApiTags("방정보")
@Controller("room")
export class RoomController {
    constructor(
        private readonly socketIoGateway: SocketIoGateway,
        private readonly roomService: RoomService
    ) {}

    @Get()
    async getAllRooms() {
        return this.roomService.getAllRooms();
    }

    @Get(":roomNo")
    async getRoom(@Param("roomNo", ParseIntPipe) roomNo: number) {
        return this.roomService.findRoom(roomNo);
    }

    @Post(":roomNo/seat/:seatNo")
    async checkVacancy(
        @Param("roomNo", ParseIntPipe) roomNo: number,
        @Param("seatNo", ParseIntPipe) seatNo: number
    ) {
        return this.roomService.checkVacancy(roomNo, seatNo);
    }
}
