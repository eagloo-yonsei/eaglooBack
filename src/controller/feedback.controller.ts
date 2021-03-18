import { Controller, Post } from "@nestjs/common";

@Controller("feedback")
export class FeedbackController {
    @Post("/")
    async createFeedback() {}
}
