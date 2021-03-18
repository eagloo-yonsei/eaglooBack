import { Injectable } from "@nestjs/common";
import { User } from "src/model/user.model";

@Injectable()
export class AppService {
    sayHello(): string {
        return "Welcome to Eagloo";
    }

    user: User[] = [];

    async createUser(args: User) {
        this.user.push(args);
    }

    async deleteUser() {}
}
