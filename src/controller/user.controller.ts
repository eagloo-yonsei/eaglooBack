import { Controller, Get, Post } from "@nestjs/common";
import { User } from "src/model/user.model";
import { PrismaService } from "src/service/prisma.service";
import { UserService } from "src/service/user.service";

@Controller("user")
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly prismaService: PrismaService
    ) {}

    @Post("/auth")
    async login() {
        this.userService.login("dennis2311", "samplePW");
    }

    @Get()
    async create() {
        const res = await this.prismaService.notice.create({
            data: {
                content: "프리즈마 서비스 테스트",
            },
        });
        console.log("this.prismaService: ", this.prismaService);
        console.log("creat() : ", res);
        return res;
    }

    @Get("list")
    async getUser() {
        const res = await this.prismaService.user.findMany();
        console.log("RES: ", res);
        return res;
    }
}
