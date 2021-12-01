import { Module } from "@nestjs/common";
import { PostController } from "src/controller/post.controller";
import { PostService } from "src/service";

@Module({
    imports: [],
    controllers: [PostController],
    providers: [PostService],
})
export class PostModule {}
