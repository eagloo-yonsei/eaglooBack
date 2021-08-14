import { Module } from "@nestjs/common";
import { FeedbackController } from "src/controller/feedback.controller";
import { FeedbackService } from "src/service/feedback.service";
import { PrismaModule } from "./prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule {}
