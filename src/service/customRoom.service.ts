import { Injectable } from "@nestjs/common";
import { customRoom } from "src/beforeInit";
import { Seat, CustomRoom, CustomRoomCreationProp } from "../model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class CustomRoomService {
    private rooms = customRoom;
    constructor() {}

    getAllRooms() {
        return this.rooms;
    }

    findRoom(roomId: string) {
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

    checkVacancy(roomId: string, seatNo: number) {
        const room = this.rooms.find((room) => room.id === roomId);
        if (!room) {
            return { success: false, type: 1 };
        }
        const seat = room.seats.find((seat) => seat.seatNo === seatNo);
        if (seat) {
            return { success: false, type: 2 };
        }
        return { success: true };
    }

    joinRoom(roomId: string, newSeat: Seat) {
        const currentRoom = this.rooms.find((room) => room.id === roomId);
        currentRoom?.seats.push(newSeat);
        console.log(`room info after new user :`);
        console.dir(this.rooms);
        return currentRoom as CustomRoom;
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
        console.log(`custom room info after user leave :`);
        console.dir(this.rooms);
        return { roomId: exitedRoomId, seatNo: removedSeatNo };
    }

    async modifyRoom() {}

    async deleteRoom() {}
}
