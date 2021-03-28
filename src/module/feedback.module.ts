import { Module } from "@nestjs/common";
import { FeedbackController } from "src/controller/feedback.controller";
import { UserService } from "src/service/user.service";
import { PrismaModule } from "./prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
