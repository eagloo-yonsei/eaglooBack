import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotAcceptableException,
    NotFoundException,
    Post,
} from "@nestjs/common";
import { SocketIoGateway } from "src/gateway/socket.io.gateway";

@Controller("room")
export class RoomController {
    constructor(private readonly socketIoGateway: SocketIoGateway) {
        // 싱글톤개념 : 한번의 객체가 생성이됨. (자바 스프링에서와 비슷함)
    }

    @Get()
    getTest() {
        return "hello gettest";
    }

    @Post()
    connectRoom(@Body() args: any) {
        console.log("args: ", args);
        // 데코레이터 : 함수.
        // 참여했을때, 방정보들을 불러와야됨 (방존재 여부 및 인원수 체크)
        if (true) {
            // 해당조건에 만족.
            // this.socketIoGateway. 으로 구현
            this.socketIoGateway.enter({
                count: 1,
                id: "1",
                limit: 6,
                title: "",
                users: [],
            });
            // 방정보 업데이트 (인원수 ++)
        } else {
            // 해당조검과 상이
            if (true) {
                // 방이 존재하나, 인원수가 맞지않음. (406)
                throw new NotAcceptableException("인원수가 최대치 입니다.");
            } else {
                // 방이 존재하지 않음. (404)
                throw new NotFoundException("해당방이 존재하지 않음");
            }
        }

        // user.on("enter", (payload) => {
        //     if (0 >= parseInt(payload.roomNo) || parseInt(payload.roomNo) >= 7) {
        //         io.to(user.id).emit("rejected", "방이 존재하지 않습니다");
        //     } else {
        //         const roomName = `room${payload.roomNo}`;
        //         user.join(roomName);
        //         const roomUsers = Object.keys(
        //             io.sockets.adapter.rooms[roomName].sockets
        //         );
        //         if (roomUsers.length >= 6) {
        //             user.leave(roomName);
        //             io.to(user.id).emit(
        //                 "rejected",
        //                 "방이 꽉 찼습니다. 다른 방을 이용해 주세요"
        //             );
        //         } else {
        //             userToRoom[user.id] = roomName;
        //             io.to(user.id).emit("accepted", roomUsers);
        //             console.log(
        //                 `${user.id}(${payload.email})이 ${roomName}에 입장함. 현재 방 인원 : ${roomUsers.length}`
        //             );
        //         }
        //     }
        // });
        //
        // this.socketIoGateway.connectRoom();
    }
}
