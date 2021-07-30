import { Injectable } from "@nestjs/common";
import { customRoom } from "src/beforeInit";
import { CustomRoom, CustomRoomCreationProp } from "../model";
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
            room.id == roomId;
        });
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

            return { success: true };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message:
                    "방을 만드는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.",
            };
        }
    }

    async modifyRoom() {}

    async deleteRoom() {}
}
