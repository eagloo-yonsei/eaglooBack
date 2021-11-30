import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PostService } from "src/service";
import { PostCategory } from ".prisma/client";

@ApiTags("포스트보드")
@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get(":roomId")
    async getAllPosts(@Param("roomId") roomId: string) {
        return this.postService.getAllPosts(roomId);
    }

    @Get(":postId")
    async getPost(@Param("postId") postId: string) {
        return this.postService.getPost(postId);
    }

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

    @Post()
    async createPostLike(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;

        return this.postService.createPostLike(
            userId,
            postId,
        );
    }

    @Post()
    async createPostScrap(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;

        return this.postService.createPostScrap(
            userId,
            postId,
        );
    }

    @Post()
    async createPostComment(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;
        const comment: string = body.comment;

        return this.postService.createPostComment(
            userId,
            postId,
            comment
        );
    }

    @Put(":postId")
    async updatePost(@Body() body) {
        const postId: string = body.postId;
        const postTitle: string = body.postTitle;
        const postContents: string = body.postContents;

        return this.postService.updatePost(
            postId,
            postTitle,
            postContents
        );
    }

    @Put(":postCommentId")
    async updatePostComment(@Body() body) {
        const postCommentId : string = body.postCommentId;
        const comment: string = body.comment;

        return this.postService.updatePostComment(
            postCommentId,
            comment,
        );
    }

    @Delete(":postId")
    async deletePost(@Param("postId") postId: string) {
        return this.postService.deletePost(postId);
    }

    @Delete(":postLikeId")
    async deletePostLike(@Param("postLikeId") postLikeId: string) {
        return this.postService.deletePostLike(postLikeId);
    }

    @Delete(":postScrapId")
    async deletePostScrapLike(@Param("postScrapId") postScrapId: string) {
        return this.postService.deletePostScrapLike(postScrapId);
    }

    @Delete(":postCommentId")
    async deletePostCommentLike(@Param("postCommentId") postCommentId: string) {
        return this.postService.deletePostCommentLike(postCommentId);
    }
}
