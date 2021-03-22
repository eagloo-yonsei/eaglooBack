import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function findUser(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            schedules: {
                select: {
                    content: true,
                },
            },
        },
    });
    console.log(user.schedules[0].content);
}

findUser("dennis2311");
