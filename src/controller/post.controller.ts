import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PostService } from "src/service";
import { PostCategory } from ".prisma/client";

@ApiTags("포스트보드")
@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async createPost(@Body() body) {
        const userId: string = body.userId;
        const roomId: string = body.roomId;
        const postTitle: string = body.postTitle;
        const postContents: string = body.postContents;
        const category: PostCategory = body.category;

        return this.postService.createPost(
            userId,
            roomId,
            postTitle,
            postContents,
            category
        );
    }
}
