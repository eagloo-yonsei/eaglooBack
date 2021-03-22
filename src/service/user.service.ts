import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class UserService {
    async login(email: string, password: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (user) {
            }
        } catch (error) {}
    }
}
