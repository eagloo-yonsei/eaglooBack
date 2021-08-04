import { Controller, Get, Post, Param, ParseIntPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PublicRoomSocketIoGateway } from "../gateway";
import { RoomService } from "../service";

@ApiTags("방정보")
@Controller("room")
export class RoomController {
    constructor(
        private readonly roomSocketIoGateway: PublicRoomSocketIoGateway,
        private readonly roomService: RoomService
    ) {}

    @Get()
    async getAllRooms() {
        return this.roomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.roomService.findRoom(roomId);
    }

    @Post(":roomId/seat/:seatNo")
    async checkVacancy(
        @Param("roomId") roomId: string,
        @Param("seatNo", ParseIntPipe) seatNo: number
    ) {
        return this.roomService.checkVacancy(roomId, seatNo);
    }
}
