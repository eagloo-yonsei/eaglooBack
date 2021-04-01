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

@Controller("api/schedule")
export class ScheduleController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(":email")
  async getSchedule(@Param("email") email: string) {
    try {
      const userWithSchedules = await this.prismaService.user.findUnique({
        where: {
          email,
        },
        include: {
          schedules: {
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
        schedules: userWithSchedules.schedules,
        success: true,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post()
  async createSchedule(@Body() body) {
    const email = body.email;
    const content = body.content;
    const importance = parseInt(body.importance);
    const response = { success: false, message: "" };

    try {
      const schedule = await this.prismaService.schedule.create({
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
        schedule,
        success: true,
      };
    } catch (err) {
      console.log(err);
      response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
      throw new Error(response.message);
    }
  }

  @Put()
  async updateSchedule(@Body() body) {
    const scheduleId = body.scheduleId;
    const content = body.content;
    const done = body.done;
    // const importance = parseInt(req.body.importance);
    const response = { success: false, message: "" };

    // TODO
    // 예쁘지 않음
    try {
      if (done) {
        await this.prismaService.schedule.update({
          where: {
            id: scheduleId,
          },
          data: {
            content,
            done: true,
            // importance,
          },
        });
      } else {
        await this.prismaService.schedule.update({
          where: {
            id: scheduleId,
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
      throw new Error(response.message);
    }
  }

  @Delete(":scheduleId")
  async deleteSchedule(@Param("scheduleId") scheduleId: string) {
    const response = { success: false, message: "" };

    try {
      await this.prismaService.schedule.delete({
        where: {
          id: scheduleId,
        },
      });
      response.success = true;
      return {
        success: true,
      };
    } catch (err) {
      console.log(err);
      throw new Error("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }
}
