import { Body, Controller, Get, Post } from "@nestjs/common";
import { FeedbackService } from "src/service/feedback.service";

@Controller("feedback")
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Get()
    async getAllFeedback() {
        return this.feedbackService.getAllFeedback();
    }

    @Post()
    async submitFeedback(@Body() body) {
        const email = body.email;
        const content = body.content;
        const category = body.category;

        return this.feedbackService.submitFeedback(email, content, category);
    }
}
