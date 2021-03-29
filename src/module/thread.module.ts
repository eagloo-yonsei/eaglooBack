import { Module } from "@nestjs/common";
import { ThreadController } from "src/controller/thread.controller";
import { PrismaModule } from "./prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ThreadController],
})
export class ThreadModule {}
