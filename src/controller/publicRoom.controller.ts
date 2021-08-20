import { Controller, Body, Get, Post, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PublicRoomService, UserInRoomService } from "../service";
import { PublicRoomSocketIoGateway } from "../gateway";
import { ChattingContent } from "src/model";

@ApiTags("공용방정보")
@Controller("publicroom")
export class PublicRoomController {
    constructor(
        private readonly publicRoomService: PublicRoomService,
        private readonly userInRoomService: UserInRoomService,
        private readonly publicRoomSocketIoGateway: PublicRoomSocketIoGateway
    ) {}

    @Get()
    async getAllRooms() {
        return this.publicRoomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.publicRoomService.getRoom(roomId);
    }

    @Post("checkVacancy")
    async checkVacancy(@Body() body) {
        const roomId = body.roomId;
        const seatNo = body.seatNo;

        return this.publicRoomService.checkVacancy(roomId, seatNo);
    }

    @Post("joinRoom")
    async joinRoom(@Body() body) {
        const roomId = body.roomId;
        const newSeat = body.newSeat;

        this.userInRoomService.addSocketToSeatInfo(
            newSeat.socketId,
            roomId,
            newSeat.seatNo,
            newSeat.userEmail
        );

        return this.publicRoomService.joinRoom(roomId, newSeat);
    }

    @Post("chat")
    receiveChatting(@Body() body) {
        const roomId: string = body.roomId;
        const userSeatNo: number = body.userSeatNo;
        const chattingContent: ChattingContent = body.chattingContent;

        const room = this.publicRoomService.getRoom(roomId);
        if (!room) {
            return { success: false, message: "잘못된 요청입니다." };
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
            return {
                success: false,
                message: "채팅을 전송하는 데 실패했습니다.",
            };
        }
    }
}
