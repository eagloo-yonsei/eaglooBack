import { Injectable } from "@nestjs/common";
import { Room, Seat } from "../model";

@Injectable()
export class RoomService {
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
        return currentRoom as Room;
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
