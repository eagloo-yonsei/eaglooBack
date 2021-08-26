import { Module } from "@nestjs/common";
import { FeedbackController } from "src/controller/feedback.controller";
import { FeedbackService } from "src/service/feedback.service";

@Module({
    imports: [],
    controllers: [FeedbackController],
    providers: [FeedbackService],
})
export class FeedbackModule {}
