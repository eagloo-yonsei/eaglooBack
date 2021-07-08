import { Module } from "@nestjs/common";
import { SocketIoAdapter } from "src/adapter";
import { AppController } from "src/controller/app.controller";
import { RoomController } from "src/controller/room.controller";
import { SocketIoGateway } from "src/gateway/socket.io.gateway";
import { RoomService } from "src/service";
import { AppService } from "src/service/app.service";
import { FeedbackModule } from "./feedback.module";
import { ScheduleModule } from "./schedule.module";
import { ThreadModule } from "./thread.module";
import { UserModule } from "./user.module";

@Module({
    imports: [UserModule, FeedbackModule, ScheduleModule, ThreadModule],
    controllers: [AppController, RoomController],
    providers: [AppService, SocketIoAdapter, SocketIoGateway, RoomService], // 필요한 서비스를 주입시킴 ()
})
export class AppModule {}
