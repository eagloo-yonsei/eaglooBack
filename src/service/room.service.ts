import { Injectable } from "@nestjs/common";
import { customRooms } from "src/beforeInit";
import {
    RoomType,
    Room,
    CustomRoom,
    Seat,
    CustomRoomCreationProp,
} from "../model";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

@Injectable()
export class RoomService {
    private rooms: (Room | CustomRoom)[] = [
        {
            id: "public1",
            roomName: "공용 스터디룸 1",
            seats: [],
        },
        {
            id: "public2",
            roomName: "공용 스터디룸 2",
            seats: [],
        },
        {
            id: "public3",
            roomName: "공용 스터디룸 3",
            seats: [],
        },
        {
            id: "public4",
            roomName: "공용 스터디룸 4",
            seats: [],
        },
        {
            id: "public5",
            roomName: "공용 스터디룸 5",
            seats: [],
        },

        ...customRooms,
    ];

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
    joinRoom(roomType: RoomType, roomId: string, newSeat: Seat) {
        let currentRoom: Room | CustomRoom;
        this.rooms.map((room) => {
            if (room.id !== roomId) {
                return room;
            } else {
                // currentRoom = room; -> 이렇게 주면 얕은 복사가 되어 push 된 정보 (스스로의 정보까지 넘겨줌)
                currentRoom = JSON.parse(JSON.stringify(room));
                room.seats.push(newSeat);
                return room;
            }
        });

        if (!currentRoom) {
            return undefined;
        }
        // console.log(
        //     `(@Room Service) 새 유저가 ${currentRoom.roomName}방 ${newSeat.seatNo}번 자리에 입장. 현재 인원 :`
        // );
        // console.dir(currentRoom);
        return roomType === RoomType.PUBLIC
            ? (currentRoom as Room)
            : (currentRoom as CustomRoom);
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
            return room.id === roomId;
        });
        const seat = room?.seats?.find((seat) => {
            return seat.seatNo === seatNo;
        });
        if (seat) {
            return seat.socketId;
        } else {
            return undefined;
        }
    }

    quitRoom(roomId: string, seatNo: number) {
        let exitedRoom: Room | CustomRoom;
        this.rooms = this.rooms.map((room) => {
            if (room.id !== roomId) {
                return room;
            } else {
                room.seats =
                    room.seats?.filter((seat) => {
                        return seat.seatNo !== seatNo;
                    }) || [];
                exitedRoom = room;
                return room;
            }
        });
        // console.log(
        //     `(@Room Service) ${roomId}방 ${seatNo}번 유저 퇴실. 남은 인원 :`
        // );
        // console.dir(exitedRoom);
        return exitedRoom;
    }

    addRoom(newRoom: CustomRoom) {
        this.rooms.push(newRoom);
    }

    async createRoom(newRoom: CustomRoomCreationProp) {
        try {
            const customRoom = await prisma.customRoom.findUnique({
                where: {
                    roomName: newRoom.roomName,
                },
            });

            if (customRoom) {
                return {
                    success: false,
                    message: "이미 같은 이름의 방이 있어요.",
                };
            }

            const createdRoom = await prisma.customRoom.create({
                data: newRoom,
            });

            this.addRoom({
                id: createdRoom.id,
                ...newRoom,
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
}
