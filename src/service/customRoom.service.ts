import { Injectable } from "@nestjs/common";
import { customRoom } from "src/beforeInit";
import { Seat, CustomRoom, CustomRoomCreationProp } from "../model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class CustomRoomService {
    private rooms = customRoom;
    constructor() {}

    // 엔트리에서 모든 방 정보 요청
    getAllRooms() {
        return this.rooms;
    }

    // 입장 시도 (빈자리 확인)
    checkVacancy(roomId: string, seatNo: number) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            return { success: false, message: "잘못된 요청입니다." };
        }
        const seat = room.seats.find((seat) => seat.seatNo === seatNo);
        if (seat) {
            return {
                success: false,
                message: "다른 사람이 사용 중인 자리입니다.",
            };
        }
        return { success: true };
    }

    // 입장 성공 후 방 정보에 편입 + 기존 방 정보 반환
    joinRoom(roomId: string, newSeat: Seat) {
        let currentRoom: CustomRoom;
        this.rooms.map((room) => {
            if (room.id !== roomId) {
                return room;
            } else {
                currentRoom = JSON.parse(JSON.stringify(room));
                room.seats.push(newSeat);
                return room;
            }
        });

        if (!currentRoom) {
            return {
                success: false,
                message: "방 입장 중 오류가 발생했습니다.",
            };
        }
        // console.log(`(@publicRoomService) 새 유저 입장 :`);
        // console.dir(this.rooms);
        return { success: true, roomInfo: currentRoom as CustomRoom };
    }

    getRoom(roomId: string) {
        return this.rooms.find((room) => {
            if (room.id === roomId) {
                return room;
            }
        });
    }

    findSeat(roomId: string, seatNo: number) {
        const room = this.rooms.find((room) => {
            room.id === roomId;
        });
        const seat = room?.seats?.find((seat) => {
            seat.seatNo === seatNo;
        });
        if (seat) {
            return seat.socketId;
        } else {
            return undefined;
        }
    }

    quitRoom(roomId: string, seatNo: number) {
        this.rooms = this.rooms.map((room) => {
            if (room.id !== roomId) {
                return room;
            } else {
                room.seats =
                    room.seats?.filter((seat) => {
                        return seat.seatNo !== seatNo;
                    }) || [];
                return room;
            }
        });
        // console.log(`(@customRoomService) customRoom condition after quit:`);
        // console.dir(this.rooms);
    }

    addRoom({
        id,
        roomName,
        roomDescription,
        ownerId,
        openToPublic,
        usePassword,
        password,
        allowMic,
        seats,
    }: CustomRoom) {
        this.rooms.push({
            id,
            roomName,
            ownerId,
            openToPublic,
            usePassword,
            allowMic,
            roomDescription,
            password,
            seats,
        });
    }

    async createRoom({
        roomName,
        roomDescription,
        ownerId,
        openToPublic,
        usePassword,
        password,
        allowMic,
    }: CustomRoomCreationProp) {
        try {
            const customRoom = await prisma.customRoom.findUnique({
                where: {
                    roomName,
                },
            });

            if (customRoom) {
                return {
                    success: false,
                    message: "이미 같은 이름의 방이 있어요.",
                };
            }

            const createdRoom = await prisma.customRoom.create({
                data: {
                    roomName,
                    roomDescription,
                    ownerId,
                    openToPublic,
                    usePassword,
                    password,
                    allowMic,
                },
            });

            this.addRoom({
                id: createdRoom.id,
                roomName,
                roomDescription,
                ownerId,
                openToPublic,
                usePassword,
                password,
                allowMic,
                seats: [],
            });

            return { success: true, roomId: createdRoom.id };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message:
                    "방을 만드는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
            };
        }
    }

    deleteRoomDetailBySocketId(socketId: string) {
        let exitedRoomId: string | undefined;
        let removedSeatNo: number | undefined;
        this.rooms = this.rooms.map((room) => {
            room.seats =
                room.seats?.filter((seat) => {
                    if (seat.socketId !== socketId) {
                        return seat;
                    } else {
                        exitedRoomId = room.id;
                        removedSeatNo = seat.seatNo;
                    }
                }) || [];
            return room;
        });
        return { roomId: exitedRoomId, seatNo: removedSeatNo };
    }

    async modifyRoom() {}

    async deleteRoom() {}
}
