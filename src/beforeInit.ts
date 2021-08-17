import { PrismaClient } from ".prisma/client";
import { CustomRoom, CustomRoomDB } from "./model";
const prisma = new PrismaClient();

export let customRoom: CustomRoom[];

export async function setCustomRoom() {
    try {
        const initializedCustomRooms: CustomRoomDB[] =
            await prisma.customRoom.findMany();

        customRoom = initializedCustomRooms.map((initializedCustomRoom) => ({
            ...initializedCustomRoom,
            seats: [],
        }));
    } catch (error) {
        console.error(error);
        console.error("사용자 설정방 로딩에 실패했습니다");
    } finally {
        return;
    }
}
