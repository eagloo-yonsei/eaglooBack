// import {
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     OnGatewayInit,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
// } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";
// import { Channel } from "src/constants";
// import { Room } from "src/model/room.model";

// // 채팅방에참여하면 1. POST요청 → 2. response으로 프론트 구성 → 서버와 스트림 통신이 가능.
// @WebSocketGateway()
// export class SocketIoGateway
//     implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
// {
//     @WebSocketServer()
//     private wss: Server;

//     afterInit(server: Server) {}
//     handleConnection(client: Socket, ...args: any[]) {}
//     handleDisconnect(client: Socket) {}

//     @SubscribeMessage("message_send")
//     sendMessage(client: Socket, message: string) {}

//     enter(room: Room) {
//         this.wss.emit("accepted", `회원정보 반환값`);
//         console.log(`새 유저 입장, 방인원 : `, room.users?.length);
//         // this.wss.emit(Channel.다른유저참여);
//     }

//     async coming(data) {
//         // 전달받은 data를 통해. 클라이언트단 웹소켓으로 전송
//         console.log("socket - coming: ", data);
//         this.wss.emit("coming_res", {
//             ...data,
//             age: data.age + 500000,
//         });
//     }

//     // TODO : 향후, POST요청이후 controller단에서 해당 메소드를 실행예정임.
//     // 입실시도 : 스터디룸 입장.
//     @SubscribeMessage(Channel.입실시도)
//     async 입실시도(client: Socket, payload: any) {
//         console.log("입실시도: ", payload);
//         // 이부분말고 새로 구현을하는게 나을것같은데
//         if (0 >= parseInt(payload.roomNo) || parseInt(payload.roomNo) >= 7) {
//             console.log("입실시도2");
//             this.wss.emit(Channel.입장거부, "방이 존재하지 않습니다");
//         } else {
//             console.log("입실시도3");
//             const roomName = `room${payload.roomNo}`;
//             client.join(roomName);
//             const roomUsers = Object.keys(
//                 this.wss.sockets.adapter.rooms[roomName].sockets
//             );
//             if (roomUsers.length >= 6) {
//                 client.leave(roomName);
//                 this.wss.sockets
//                     .to(client.id)
//                     .emit(
//                         Channel.입장거부,
//                         "방이 꽉 찼습니다. 다른 방을 이용해 주세요"
//                     );
//             } else {
//                 // userToRoom[client.id] = roomName;
//                 this.wss.sockets
//                     .to(client.id)
//                     .emit(Channel.입장수락, roomUsers);
//                 console.log(
//                     `${client.id}(${payload.email})이 ${roomName}에 입장함. 현재 방 인원 : ${roomUsers.length}`
//                 );
//             }
//         }
//     }

//     @SubscribeMessage(Channel.퇴실)
//     async 퇴실(client: Socket, data: any) {
//         // 전달받은 data를 통해. 클라이언트단 웹소켓으로 전송
//         console.log("socket - coming: ", data);
//         this.wss.emit("coming_res", {
//             ...data,
//             age: data.age + 500000,
//         });
//     }

//     @SubscribeMessage(Channel.캠요청)
//     async 캠요청(client: Socket, data: any) {
//         // 전달받은 data를 통해. 클라이언트단 웹소켓으로 전송
//         console.log("socket - coming: ", data);
//         this.wss.emit("coming_res", {
//             ...data,
//             age: data.age + 500000,
//         });
//     }

//     @SubscribeMessage(Channel.캠요청수락)
//     async 캠요청수락(client: Socket, data: any) {
//         // 전달받은 data를 통해. 클라이언트단 웹소켓으로 전송
//         console.log("socket - coming: ", data);
//         this.wss.emit("coming_res", {
//             ...data,
//             age: data.age + 500000,
//         });
//     }
// }
