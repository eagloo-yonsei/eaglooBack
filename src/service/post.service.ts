import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PostCategory } from ".prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class PostService {
    constructor() {}

    async getAllPosts(roomId: string) {
        try {
            const allPosts = await prisma.customRoom.findUnique({
                where: {
                    id : roomId,
                },
                select: {
                    posts : {
                        select : {
                            id: true,
                            category: true,
                            title: true,
                            contents: true,
                            authorId : true,
                            roomId : true,
                            postlikes : {
                                select : {
                                    userId : true,
                                },
                            },
                            postScraps : {
                                select : {
                                    userId : true,
                                },
                            },
                            postComments : {
                                select : {
                                    userId : true,
                                },
                            },
                            createdAt : true,
                            updatedAt : true,
                        },
                    },
                },
            });
            return {
                success: true,
                posts: allPosts,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async getPost(postId: string) {
        try {
            const post = await prisma.post.findUnique({
                where: {
                    id : postId,
                },
                select: {
                    id: true,
                    category: true,
                    title: true,
                    contents: true,
                    authorId : true,
                    roomId : true,
                    postlikes : {
                        select : {
                            id : true,
                            userId : true,
                        },
                    },
                    postScraps : {
                        select : {
                            id : true,
                            userId : true,
                        },
                    },
                    postComments : {
                        select : {
                            id : true,
                            userId : true,
                            comment : true,
                            createdAt : true,
                            updatedAt : true,
                        },
                    },
                    createdAt : true,
                    updatedAt : true,
                },
            });
            return {
                success: true,
                post: post,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

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

    async createPostLike(
        userId: string,
        postId: string,
    ) {
        try {
            await prisma.postLike.create({
                data: {
                    userId,
                    postId
                },
            });

            return { success: true };
        } catch (error) {
            return { success: false, message: "포스트 생성에 실패했습니다." };
        }
    }

    async createPostScrap(
        userId: string,
        postId: string,
    ) {
        try {
            await prisma.postScrap.create({
                data: {
                    userId,
                    postId
                },
            });

            return { success: true };
        } catch (error) {
            return { success: false, message: "포스트 생성에 실패했습니다." };
        }
    }

    async createPostComment(
        userId: string,
        postId: string,
        comment : string,
    ) {
        try {
            await prisma.postComment.create({
                data: {
                    userId,
                    postId,
                    comment
                },
            });

            return { success: true };
        } catch (error) {
            return { success: false, message: "포스트 생성에 실패했습니다." };
        }
    }

    async updatePost(
        postId : string,
        postTitle: string,
        postContents: string
    ) {
        try {
            await prisma.post.update({
                where: {
                    id: postId,
                },
                data: {
                    title : postTitle,
                    contents : postContents,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async updatePostComment(
        postCommentId : string,
        comment : string,
    ) {
        try {
            await prisma.postComment.update({
                where: {
                    id: postCommentId,
                },
                data: {
                    comment,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async deletePost(postId: string) {
        try {
            await prisma.post.delete({
                where: {
                    id: postId,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async deletePostLike(postLikeId: string) {
        try {
            await prisma.postLike.delete({
                where: {
                    id: postLikeId,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async deletePostScrapLike(postScrapId: string) {
        try {
            await prisma.postScrap.delete({
                where: {
                    id: postScrapId,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async deletePostCommentLike(postCommentId: string) {
        try {
            await prisma.postComment.delete({
                where: {
                    id: postCommentId,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }
}
