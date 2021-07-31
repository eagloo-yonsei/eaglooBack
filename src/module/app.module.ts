import { Module } from "@nestjs/common";
import { SocketIoAdapter } from "src/adapter";
import { AppController } from "src/controller/app.controller";
import { RoomController } from "src/controller/room.controller";
import { CustomRoomController } from "src/controller/customRoom.controller";
import { PublicRoomSocketIoGateway } from "src/gateway/publicroom.socket.io.gateway";
import { CustomRoomSocketIoGateway } from "src/gateway/customroom.socket.io.gateway";
import { RoomService } from "src/service";
import { CustomRoomService } from "src/service/customRoom.service";
import { AppService } from "src/service/app.service";
import { FeedbackModule } from "./feedback.module";
import { TaskModule } from "./task.module";
import { ThreadModule } from "./thread.module";
import { UserModule } from "./user.module";

@Module({
    imports: [UserModule, FeedbackModule, TaskModule, ThreadModule],
    controllers: [AppController, RoomController, CustomRoomController],
    providers: [
        AppService,
        SocketIoAdapter,
        PublicRoomSocketIoGateway,
        CustomRoomSocketIoGateway,
        RoomService,
        CustomRoomService,
    ], // 필요한 서비스를 주입시킴 ()
})
export class AppModule {}
