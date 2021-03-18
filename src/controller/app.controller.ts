import { Controller, Get } from "@nestjs/common";
import { AppService } from "src/service/app.service";

// localhost:3000/app
@Controller("app")
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get("/")
    async createUser() {
        // 1. 인자값 검증.

        // 2. 비지니스 로직을 실행.
        this.appService.createUser({
            id: "sampleID",
            email: "sampleEmail",
        });
        return this.appService.user;
    }
}
