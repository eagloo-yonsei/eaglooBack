import { Injectable } from "@nestjs/common";
import { FeedbackCategory } from ".prisma/client";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class FeedbackService {
    async getAllFeedback() {
        try {
            const allFeedback = await prisma.feedback.findMany();
            return { success: true, allFeedback };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요.",
            };
        }
    }

    async submitFeedback(
        email: string,
        content: string,
        category: FeedbackCategory
    ) {
        try {
            await prisma.feedback.create({
                data: {
                    user: email,
                    content,
                    category,
                },
            });
            return {
                success: true,
                message:
                    "피드백이 정상적으로 제출되었습니다. 소중한 의견 감사합니다!",
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요.",
            };
        }
    }
}
