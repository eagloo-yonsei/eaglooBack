// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function findUser(email: string) {
//     const user = await prisma.user.findUnique({
//         where: { email },
//         include: {
//             schedules: {
//                 select: {
//                     content: true,
//                 },
//             },
//         },
//     });
//     console.log(user.schedules[0].content);
// }

// findUser("dennis2311");

const users = [
    { no: 1, name: "denni" },
    { no: 8, name: "chris" },
    { no: 111, name: "tom" },
    { no: 24, name: "friday" },
    { no: 84, name: "violet" },
    { no: 27, name: "hardey" },
];
const addedUser = { no: 120, name: "loren" };
const new_users = users.map((user) => {
    if (user.no === addedUser.no) {
        return {
            ...user,
            name: addedUser.name,
        };
    }
    return user;
});
console.log(users);
console.log(new_users);
