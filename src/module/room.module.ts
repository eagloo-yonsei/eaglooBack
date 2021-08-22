// NOTE !#SOCKET socketIoGateway를 provider로서 import 하는 것은 app.module 한 곳에서만 이루어져야 함.
// 만약 다른 module에서 socketIoGateway를 사용하는 경우 같은 소켓 id로 중복 연결됨.

// import { Module } from "@nestjs/common";
// import { RoomController } from "src/controller";
// import { RoomService, UserService } from "src/service";
// import { AppSocketIoGateway } from "src/gateway";
// import { PrismaModule } from "./prisma.module";

// @Module({
//     imports: [PrismaModule],
//     controllers: [RoomController],
//     providers: [RoomService, UserService, AppSocketIoGateway],
// })
// export class RoomModule {}
