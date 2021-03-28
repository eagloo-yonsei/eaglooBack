import { Module } from "@nestjs/common";
import { ScheduleController } from "src/controller/schedule.controller";
import { PrismaModule } from "./prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
