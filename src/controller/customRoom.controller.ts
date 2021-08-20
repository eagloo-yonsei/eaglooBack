import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CustomRoomService, UserInRoomService } from "../service";
import { CustomRoomSocketIoGateway } from "src/gateway";
import { ChattingContent } from "src/model";

@ApiTags("사용자설정방정보")
@Controller("customroom")
export class CustomRoomController {
    constructor(
        private readonly customRoomService: CustomRoomService,
        private readonly userInRoomService: UserInRoomService,
        private readonly customRoomSocket: CustomRoomSocketIoGateway
    ) {}

    @Get()
    async getAllRooms() {
        return this.customRoomService.getAllRooms();
    }

    @Get(":roomId")
    async getRoom(@Param("roomId") roomId: string) {
        return this.customRoomService.getRoom(roomId);
    }

    @Post("checkVacancy")
    async checkVacancy(@Body() body) {
        const roomId = body.roomId;
        const seatNo = body.seatNo;
        return this.customRoomService.checkVacancy(roomId, seatNo);
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

        return this.customRoomService.joinRoom(roomId, newSeat);
    }

    @Post("chat")
    receiveChatting(@Body() body) {
        const roomId: string = body.roomId;
        const userSeatNo: number = body.userSeatNo;
        const chattingContent: ChattingContent = body.chattingContent;

        const room = this.customRoomService.getRoom(roomId);
        if (!room) {
            return { success: false, message: "잘못된 요청입니다." };
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
            return {
                success: false,
                message: "채팅을 전송하는 데 실패했습니다.",
            };
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
