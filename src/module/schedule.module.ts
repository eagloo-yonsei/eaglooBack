import { Module } from "@nestjs/common";
import { ScheduleController } from "src/controller/schedule.controller";
import { ScheduleService } from "src/service/schedule.service";
import { PrismaModule } from "./prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [ScheduleController],
    providers: [ScheduleService],
})
export class ScheduleModule {}
