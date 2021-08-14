import { Injectable } from "@nestjs/common";
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
                success: true,
                tasks: userWithTasks.tasks,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async createTask(email: string, content: string, importance: number) {
        try {
            const task = await prisma.task.create({
                data: {
                    content,
                    importance,
                    user: {
                        connect: {
                            email,
                        },
                    },
                },
                select: {
                    id: true,
                    content: true,
                    done: true,
                    importance: true,
                },
            });
            return {
                success: true,
                task,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async updateTask(
        taskId: string,
        done: boolean,
        content: string,
        importance: number
    ) {
        try {
            await prisma.task.update({
                where: {
                    id: taskId,
                },
                data: {
                    done,
                    content,
                    importance,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }
    async deleteTask(taskId: string) {
        try {
            await prisma.task.delete({
                where: {
                    id: taskId,
                },
            });

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }
}
