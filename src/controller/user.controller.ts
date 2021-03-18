import { Controller, Get, Post } from "@nestjs/common";
import { User } from "src/model/user.model";

@Controller("user")
export class UserController {
    @Get()
    async getUser() {
        return "hello user";
    }

    @Post("create")
    async createUser() {
        return "hello world";
    }
}
