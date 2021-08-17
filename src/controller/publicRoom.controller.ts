import {
    Controller,
    Body,
    Get,
    Post,
    Param,
    ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PublicRoomSocketIoGateway } from "../gateway";
import { PublicRoomService } from "../service";
import { ChattingContent } from "src/model";

@ApiTags("방정보")
@Controller("publicroom")
export class PublicRoomController {
    constructor(
        private readonly publicRoomSocketIoGateway: PublicRoomSocketIoGateway,
        private readonly publicRoomService: PublicRoomService
    ) {}

    @Get()
    async getAllRooms() {
        return this.publicRoomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.publicRoomService.findRoom(roomId);
    }

    @Post(":roomId/seat/:seatNo")
    async checkVacancy(
        @Param("roomId") roomId: string,
        @Param("seatNo", ParseIntPipe) seatNo: number
    ) {
        return this.publicRoomService.checkVacancy(roomId, seatNo);
    }

    @Post("chat")
    receiveChatting(@Body() body) {
        const roomId: string = body.roomId;
        const userSeatNo: number = body.userSeatNo;
        const chattingContent: ChattingContent = body.chattingContent;

        const room = this.publicRoomService.findRoom(roomId);
        if (!room) {
            return { success: false };
        }

        if (
            this.publicRoomSocketIoGateway.receiveChatting(
                userSeatNo,
                chattingContent,
                room.seats
            )
        ) {
            return { success: true };
        } else {
            return { success: false };
        }
    }
}
