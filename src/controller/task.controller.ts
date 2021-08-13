import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
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
        return this.taskService.getTask(email);
    }

    @Post()
    async createTask(@Body() body) {
        const email = body.email;
        const content = body.content;
        const importance = parseInt(body.importance);

        return this.taskService.createTask(email, content, importance);
    }

    @Put()
    async updateTask(@Body() body) {
        const taskId = body.taskId;
        const done = body.done;
        const content = body.content;
        const importance = parseInt(body.importance);

        return this.taskService.updateTask(taskId, done, content, importance);
    }

    @Delete(":taskId")
    async deleteTask(@Param("taskId") taskId: string) {
        return this.taskService.deleteTask(taskId);
    }
}
