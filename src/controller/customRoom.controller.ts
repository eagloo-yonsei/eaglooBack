import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    ParseIntPipe,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomRoomService } from "src/service/customRoom.service";
import { CustomRoomSocketIoGateway } from "src/gateway";
import { ChattingContent } from "src/model";

@ApiTags("사용자설정방정보")
@Controller("customroom")
export class CustomRoomController {
    constructor(
        private readonly customRoomService: CustomRoomService,
        private readonly customRoomSocket: CustomRoomSocketIoGateway
    ) {}

    @Get()
    async getAllRooms() {
        return this.customRoomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.customRoomService.findRoom(roomId);
    }

    @Post(":roomId/seat/:seatNo")
    async checkVacancy(
        @Param("roomId") roomId: string,
        @Param("seatNo", ParseIntPipe) seatNo: number
    ) {
        return this.customRoomService.checkVacancy(roomId, seatNo);
    }

    @Post("chat")
    receiveChatting(@Body() body) {
        const roomId: string = body.roomId;
        const userSeatNo: number = body.userSeatNo;
        const chattingContent: ChattingContent = body.chattingContent;

        const room = this.customRoomService.findRoom(roomId);
        if (!room) {
            return { success: false };
        }

        if (
            this.customRoomSocket.receiveChatting(
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

    @Post()
    async createRoom(@Body() body) {
        const roomName = body.roomName;
        const roomDescription = body.roomDescription;
        const ownerId = body.ownerId;
        const openToPublic = body.openToPublic;
        const usePassword = body.usePassword;
        const password = body.password;
        const allowMic = body.allowMic;

        return this.customRoomService.createRoom({
            roomName,
            roomDescription,
            ownerId,
            openToPublic,
            usePassword,
            password,
            allowMic,
        });
    }
}
