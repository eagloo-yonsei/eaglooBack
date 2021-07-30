import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/service/prisma.service";
import { TaskService } from "src/service/task.service";

@Controller("task")
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly prismaService: PrismaService
    ) {}

    @Get(":email")
    async getTask(@Param("email") email: string) {
        try {
            const userWithTasks = await this.taskService.getTask(email);
            return userWithTasks;
        } catch (err) {
            console.log("err: ", err);
            throw new NotFoundException(err);
        }
    }

    @Post()
    async createTask(@Body() body) {
        const email = body.email;
        const content = body.content;
        const importance = parseInt(body.importance);
        const response = { success: false, message: "" };

        try {
            const task = await this.prismaService.task.create({
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
                task,
                success: true,
            };
        } catch (err) {
            console.log(err);
            response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
            throw new NotFoundException(response.message);
        }
    }

    @Put()
    async updateTask(@Body() body) {
        const taskId = body.taskId;
        const content = body.content;
        const done = body.done;
        // const importance = parseInt(req.body.importance);
        const response = { success: false, message: "" };

        // TODO
        // 예쁘지 않음
        try {
            if (done) {
                await this.prismaService.task.update({
                    where: {
                        id: taskId,
                    },
                    data: {
                        content,
                        done: true,
                        // importance,
                    },
                });
            } else {
                await this.prismaService.task.update({
                    where: {
                        id: taskId,
                    },
                    data: {
                        content,
                        done: false,
                        // importance,
                    },
                });
            }
            return {
                success: true,
            };
        } catch (err) {
            console.log(err);
            response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
            throw new NotFoundException(response.message);
        }
    }

    @Delete(":taskId")
    async deleteTask(@Param("taskId") taskId: string) {
        const response = { success: false, message: "" };

        try {
            await this.prismaService.task.delete({
                where: {
                    id: taskId,
                },
            });
            response.success = true;
            return {
                success: true,
            };
        } catch (err) {
            console.log(err);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }
}
