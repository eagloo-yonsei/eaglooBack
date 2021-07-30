import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class TaskService {
    async getTask(email: string) {
        try {
            const userWithTasks = await prisma.user.findUnique({
                where: {
                    email,
                },
                include: {
                    tasks: {
                        orderBy: {
                            createdAt: "asc",
                        },
                        select: {
                            id: true,
                            content: true,
                            done: true,
                            importance: true,
                        },
                    },
                },
            });
            return {
                tasks: userWithTasks.tasks,
                success: true,
            };
        } catch (err) {
            console.log("err: ", err);
            throw new NotFoundException(err);
        }
    }

    async createTask(email: string, content: string, importance: number) {}
    async updateTask(taskId: string, content: string, done: boolean) {}
    async deleteTask(taskId: string) {}
}
