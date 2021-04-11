import { Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { PrismaService } from "src/service/prisma.service";

@Controller("api/feedback")
export class FeedbackController {
  constructor(private readonly prismaService: PrismaService) {}
  @Post("/")
  async createFeedback(@Body() body) {
    const email = body.email;
    const content = body.content;
    const response = { success: false, message: "" };

    try {
      await this.prismaService.feedback.create({
        data: {
          user: email,
          content,
        },
      });
      response.success = true;
      return {
        success: true,
      };
    } catch (err) {
      console.log(err);
      throw new NotFoundException("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }
}
