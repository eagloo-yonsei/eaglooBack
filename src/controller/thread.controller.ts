import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
} from "@nestjs/common";
import { PrismaService } from "src/service/prisma.service";

@Controller("api/thread")
export class ThreadController {
    constructor(private readonly prismaServcie: PrismaService) {}

    @Get("all/total")
    async getAll() {
        const response = { success: false, message: "" };

        try {
            const totalThreads = await this.prismaServcie.mainthread.count();
            return {
                totalThreads,
                success: true,
            };
        } catch (error) {
            console.error(error);
            response.message = "서버 오류입니다. 잠시 후 다시 시도해 주세요";
            throw new NotFoundException(response.message);
        }
    }

    @Get("all/page/:pageNo")
    async getThread(@Param("pageNo", ParseIntPipe) pageNo: number) {
        try {
            const threads = await this.prismaServcie.mainthread.findMany({
                skip: 10 * (pageNo - 1),
                take: 10,
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                    subthreads: {
                        orderBy: {
                            createdAt: "asc",
                        },
                        select: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                            id: true,
                            content: true,
                            createdAt: true,
                        },
                    },
                },
            });
            console.dir(threads);
            return {
                threads,
                success: true,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }

    @Get(":college/total")
    async getThreadCountsByCollege(@Param("college") college: any) {
        try {
            const totalThreads = await this.prismaServcie.mainthread.count({
                where: {
                    college,
                },
            });
            return {
                totalThreads,
                success: true,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }

    @Get(":college/page/:pageNo")
    async getThreadsByCollege(
        @Param("college") college: any,
        @Param("pageNo", ParseIntPipe) pageNo: number
    ) {
        try {
            const threads = await this.prismaServcie.mainthread.findMany({
                skip: 10 * (pageNo - 1),
                take: 10,
                where: {
                    college,
                },
                include: {
                    user: {
                        select: {
                            email: true,
                        },
                    },
                    subthreads: {
                        orderBy: {
                            createdAt: "asc",
                        },
                        select: {
                            user: {
                                select: {
                                    email: true,
                                },
                            },
                            id: true,
                            content: true,
                            createdAt: true,
                        },
                    },
                },
            });
            return {
                threads,
                success: true,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }

    @Post("main")
    async createMainThread(@Body() body) {
        const email = body.email;
        const college = body.college;
        const subject = body.subject;
        const content = body.content;

        try {
            const newMainthread = await this.prismaServcie.mainthread.create({
                data: {
                    college,
                    subject,
                    content,
                    user: {
                        connect: {
                            email,
                        },
                    },
                },
            });
            return {
                newMainthread,
                success: true,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }

    @Post("sub")
    async createSubThread(@Body() body) {
        const email = body.email;
        const mainthreadId = body.mainthreadId;
        const content = body.content;
        const response = { success: false, message: "" };

        try {
            const newSubthread = await this.prismaServcie.subthread.create({
                data: {
                    user: {
                        connect: {
                            email,
                        },
                    },
                    mainthread: {
                        connect: {
                            id: mainthreadId,
                        },
                    },
                    content,
                },
            });
            return {
                newSubthread,
                success: true,
            };
        } catch (error) {
            console.error(error);
            throw new NotFoundException(
                "서버 오류입니다. 잠시 후 다시 시도해 주세요"
            );
        }
    }
}
