import { Injectable } from "@nestjs/common";
import { Room, Seat, SocketToSeatInfo } from "../model";

@Injectable()
export class PublicRoomService {
    private rooms: Room[] = [
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
    joinRoom(roomId: string, newSeat: Seat) {
        let currentRoom: Room;
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
        return { success: true, roomInfo: currentRoom as Room };
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
        // console.log(`(@publicRoomService) publicRoom condition after quit:`);
        // console.dir(this.rooms);
    }

    // 이하 아직 쓰일 일 없음
    addRoom(roomId: string, roomDetail: Seat) {
        const currentRoom = this.rooms.find((room) => room.id === roomId);
        let room;
        if (currentRoom) {
            this.rooms = this.rooms.map((newRooms) => {
                if (newRooms.id === roomId) {
                    newRooms.seats.push(roomDetail);
                }
                room = newRooms;
                return newRooms;
            });
        } else {
            room = roomDetail;
            this.rooms[1] = {
                id: roomId,
                seats: [roomDetail],
                roomName: "",
            };
            // this.rooms.push({
            //   no,
            //   details: [roomDetail],
            // });
        }
        return room as Room;
    }

    removeRoom(roomId: string, positionNo: number) {
        this.rooms = this.rooms.map((room) => {
            if (room.id === roomId) {
                room.seats = room.seats.filter(
                    (seat) => seat.seatNo === positionNo
                );
            }
            return room;
        });
    }
}
