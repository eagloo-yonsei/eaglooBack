import { Body, Controller, Post } from "@nestjs/common";
import { FeedbackCategory } from ".prisma/client";
import { FeedbackService } from "src/service/feedback.service";
import { PrismaService } from "src/service/prisma.service";

@Controller("feedback")
export class FeedbackController {
    constructor(
        private readonly feedbackService: FeedbackService,
        private readonly prismaService: PrismaService
    ) {}
    @Post()
    async submitFeedback(@Body() body) {
        const email = body.email;
        const content = body.content;
        const feedbackCategory = body.feedbackCategory;

        return this.feedbackService.submitFeedback(
            email,
            content,
            feedbackCategory
        );
    }
}
