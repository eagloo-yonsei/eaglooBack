import { Module } from "@nestjs/common";
import { SocketIoAdapter } from "src/adapter";
import { AppController } from "src/controller/app.controller";
import { RoomController } from "src/controller";
import { UserController } from "src/controller";
import { AppSocketIoGateway } from "src/gateway";
import { AppService } from "src/service/app.service";
import { RoomService } from "src/service";
import { UserService } from "src/service";
import { FeedbackModule } from "./feedback.module";
// NOTE !#SOCKET RoomModule 주석 참고
// import { RoomModule } from "./room.module";
import { TaskModule } from "./task.module";
import { ThreadModule } from "./thread.module";

@Module({
    imports: [FeedbackModule, TaskModule, ThreadModule],
    controllers: [AppController, RoomController, UserController],
    providers: [
        AppService,
        SocketIoAdapter,
        AppSocketIoGateway,
        RoomService,
        UserService,
    ], // 필요한 서비스를 주입시킴 ()
})
export class AppModule {}
