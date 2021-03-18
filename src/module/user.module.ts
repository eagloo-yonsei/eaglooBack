import { Module } from "@nestjs/common";
import { UserController } from "src/controller/user.controller";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [],
})
export class UserModule {}
