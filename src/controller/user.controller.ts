import { Controller, Get, Post } from "@nestjs/common";
import { User } from "src/model/user.model";
import { UserService } from "src/service/user.service";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post("/auth")
    async login() {
        this.userService.login("dennis2311", "samplePW");
    }
}
