import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PostCategory } from ".prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class PostService {
    constructor() {}

    async createPost(
        userId: string,
        roomId: string,
        postTitle: string,
        postContents: string,
        category: PostCategory
    ) {
        try {
            await prisma.post.create({
                data: {
                    title: postTitle,
                    contents: postContents,
                    authorId: userId,
                    roomId,
                    category,
                },
            });

            return { success: true };
        } catch (error) {
            return { success: false, message: "포스트 생성에 실패했습니다." };
        }
    }
}
