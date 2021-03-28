import { Module } from "@nestjs/common";
import { FeedbackController } from "src/controller/feedback.controller";
import { PrismaModule } from "./prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
