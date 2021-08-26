import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { UserService } from "src/service/user.service";
import { secretGenerator } from "../utils/secretGenerator";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUser() {
        return this.userService.getAllUser();
    }

    @Get("connected")
    async getAllConnectedUser() {
        return this.userService.getAllConnectedUser();
    }

    @Get("auth/:email/:password")
    async login(
        @Param("email") email: string,
        @Param("password") password: string
    ) {
        return this.userService.login(email, password);
    }

    @Post("createTestUser")
    async createTestUser(@Body() body) {
        const email = body.email;
        const password = body.password;

        return this.userService.createTestUser(email, password);
    }

    @Post()
    async signUpStep1(@Body() body) {
        const email = body.email;
        const secret = secretGenerator();

        return this.userService.signUp1(email, secret);
    }

    @Put("secret")
    async signUpStep2(@Body() body) {
        const email = body.email;
        const givenSecret = body.givenSecret;

        return this.userService.signUp2(email, givenSecret);
    }

    @Put("password")
    async signUpStep3(@Body() body) {
        const email = body.email;
        const givenPassword = body.givenPassword;

        return this.userService.signUp3(email, givenPassword);
    }

    @Get("nickName/:nickName")
    async checkNickNameDuplicate(@Param("nickName") nickName: string) {
        return this.userService.checkNickNameDuplicate(nickName);
    }

    @Put("userInfo")
    async updateUserInfo(@Body() body) {
        const email = body.email;
        const nickName = body.nickName;
        const realName = body.realName;
        const newPassword = body.newPassword;
        const previousPassword = body.previousPassword;

        return this.userService.updateUserInfo(
            email,
            previousPassword,
            nickName,
            realName,
            newPassword
        );
    }
}
