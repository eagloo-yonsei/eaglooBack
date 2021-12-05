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
import { anonymization } from "../utils/anonymization";

@ApiTags("포스트보드")
@Controller("post")
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get("/room/:roomId")
    async getAllPosts(@Param("roomId") roomId: string) {
        var data = await this.postService.getAllPosts(roomId);
        for (var i = 0; i < data.posts.posts.length; i++) {
            data.posts.posts[i].postComments = anonymization(
                data.posts.posts[i].postComments
            );
        }
        return data;
    }

    @Get("/post/:postId")
    async getPost(@Param("postId") postId: string) {
        var data = await this.postService.getPost(postId);
        data.post.postComments = anonymization(data.post.postComments);
        return data;
    }

    @Post("/post")
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

    @Post("/postLike")
    async createPostLike(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;

        return this.postService.createPostLike(userId, postId);
    }

    @Post("/postScrap")
    async createPostScrap(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;

        return this.postService.createPostScrap(userId, postId);
    }

    @Post("/postComment")
    async createPostComment(@Body() body) {
        const userId: string = body.userId;
        const postId: string = body.postId;
        const comment: string = body.comment;

        return this.postService.createPostComment(userId, postId, comment);
    }

    @Put("/post/:postId")
    async updatePost(@Body() body) {
        const postId: string = body.postId;
        const postTitle: string = body.postTitle;
        const postContents: string = body.postContents;

        return this.postService.updatePost(postId, postTitle, postContents);
    }

    @Put("/postComment/:postCommentId")
    async updatePostComment(@Body() body) {
        const postCommentId: string = body.postCommentId;
        const comment: string = body.comment;

        return this.postService.updatePostComment(postCommentId, comment);
    }

    @Delete("/post/:postId")
    async deletePost(@Param("postId") postId: string) {
        return this.postService.deletePost(postId);
    }

    @Delete("/postLike/:postLikeId")
    async deletePostLike(@Param("postLikeId") postLikeId: string) {
        return this.postService.deletePostLike(postLikeId);
    }

    @Delete("/postScrap/:postScrapId")
    async deletePostScrapLike(@Param("postScrapId") postScrapId: string) {
        return this.postService.deletePostScrapLike(postScrapId);
    }

    @Delete("/postComment/:postCommentId")
    async deletePostCommentLike(@Param("postCommentId") postCommentId: string) {
        return this.postService.deletePostCommentLike(postCommentId);
    }
}
