import { Module } from "@nestjs/common";
import { UserController } from "src/controller/user.controller";
import { UserService } from "src/service/user.service";
import { PrismaModule } from "./prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
