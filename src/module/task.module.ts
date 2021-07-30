import { Module } from "@nestjs/common";
import { TaskController } from "src/controller/task.controller";
import { TaskService } from "src/service/task.service";
import { PrismaModule } from "./prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
