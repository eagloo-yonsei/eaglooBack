import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class ScheduleService {
    async getSchedule(email: string) {
        try {
            const userWithSchedules = await prisma.user.findUnique({
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
            console.log("err: ", err);
            throw new NotFoundException(err);
        }
    }

    async createSchedule(email: string, content: string, importance: number) {}
    async updateSchedule(scheduleId: string, content: string, done: boolean) {}
    async deleteSchedule(scheduleId: string) {}
}
