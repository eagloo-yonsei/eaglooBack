import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class UserService {
    async getUsers() {
        try {
            const users = await prisma.user.findMany({ take: 10 });
            if (users) {
                return users;
            }
        } catch (error) {}
    }

    async login(email: string, password: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
                return user;
            }
        } catch (error) {}
    }
}
