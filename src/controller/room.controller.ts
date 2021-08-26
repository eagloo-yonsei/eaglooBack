import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoomService } from "src/service";
import { AppSocketIoGateway } from "src/gateway";
import { ChattingContent, CustomRoomCreationProp } from "src/model";

@ApiTags("방 정보")
@Controller("room")
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly appSocketIoGateway: AppSocketIoGateway
    ) {}

    @Get()
    async getAllRooms() {
        return this.roomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.roomService.getRoom(roomId);
    }

    @Post("checkVacancy")
    async checkVacancy(@Body() body) {
        const roomId = body.roomId;
        const seatNo = body.seatNo;
        return this.roomService.checkVacancy(roomId, seatNo);
    }

    @Post("chat")
    receiveChatting(@Body() body) {
        const roomId: string = body.roomId;
        const userSeatNo: number = body.userSeatNo;
        const chattingContent: ChattingContent = body.chattingContent;

        const room = this.roomService.getRoom(roomId);
        if (!room) {
            return { success: false, message: "잘못된 요청입니다." };
        }

        if (
            this.appSocketIoGateway.receiveChatting(
                userSeatNo,
                chattingContent,
                room.seats
            )
        ) {
            return { success: true };
        } else {
            return {
                success: false,
                message: "채팅을 전송하는 데 실패했습니다.",
            };
        }
    }

    @Post()
    async createRoom(@Body() body: { newRoom: CustomRoomCreationProp }) {
        const newRoom = body.newRoom;

        return this.roomService.createRoom(newRoom);
    }

    @Post("exile")
    async exile(@Body() body) {
        const roomId = body.roomId;
        const seatNo = body.seatNo;
        const message = body.message;

        return this.appSocketIoGateway.exile(roomId, seatNo, message);
    }
}
