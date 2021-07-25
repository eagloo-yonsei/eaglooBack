import { Injectable } from "@nestjs/common";
import { Room, Seat } from "../model";

@Injectable()
export class RoomService {
    private rooms: Room[] = [
        {
            roomNo: 1,
            seats: [],
        },
        {
            roomNo: 2,
            seats: [],
        },
        {
            roomNo: 3,
            seats: [],
        },
        {
            roomNo: 4,
            seats: [],
        },
        {
            roomNo: 5,
            seats: [],
        },
        {
            roomNo: 6,
            seats: [],
        },
    ];
    constructor() {}

    getAllRooms() {
        return this.rooms;
    }

    findSeat(roomNo: number, seatNo: number) {
        const room = this.rooms.find((room) => {
            room.roomNo === roomNo;
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

    findRoom(roomNo: number) {
        return this.rooms.find((room) => {
            if (room.roomNo === roomNo) {
                return room;
            }
        });
    }

    checkVacancy(roomNo: number, seatNo: number) {
        const room = this.rooms.find((room) => room.roomNo === roomNo);
        if (!room) {
            return { success: false, type: 1 };
        }
        const seat = room.seats.find((seat) => seat.seatNo === seatNo);
        if (seat) {
            return { success: false, type: 2 };
        }
        return { success: true };
    }

    joinRoom(roomNo: number, newSeat: Seat) {
        const currentRoom = this.rooms.find((room) => room.roomNo === roomNo);
        currentRoom?.seats.push(newSeat);
        console.log(`room info after new user :`);
        console.dir(this.rooms);
        return currentRoom as Room;
    }

    findRoomByPositionNo(roomNo: number, positionNo: number) {
        return this.rooms.find((v) => {
            if (v.roomNo === roomNo) {
                return v.seats.find((subV) => subV.seatNo === positionNo);
            }
        });
    }

    deleteRoomDetailBySocketId(socketId: string) {
        let exitedRoomNo: number | undefined;
        let removedSeatNo: number | undefined;
        this.rooms = this.rooms.map((room) => {
            room.seats =
                room.seats?.filter((seat) => {
                    if (seat.socketId !== socketId) {
                        return seat;
                    } else {
                        exitedRoomNo = room.roomNo;
                        removedSeatNo = seat.seatNo;
                    }
                }) || [];
            return room;
        });
        console.log(`room info after user leave :`);
        console.dir(this.rooms);
        return { roomNo: exitedRoomNo, seatNo: removedSeatNo };
    }

    // 이하 아직 쓰일 일 없음
    addRoom(no: number, roomDetail: Seat) {
        const currentRoom = this.rooms.find((v) => v.roomNo === no);
        let room;
        if (currentRoom) {
            this.rooms = this.rooms.map((v) => {
                if (v.roomNo === no) {
                    v.seats.push(roomDetail);
                }
                room = v;
                return v;
            });
        } else {
            room = roomDetail;
            this.rooms[1] = {
                roomNo: no,
                seats: [roomDetail],
            };
            // this.rooms.push({
            //   no,
            //   details: [roomDetail],
            // });
        }
        return room as Room;
    }

    removeRoom(no: number, positionNo: number) {
        this.rooms = this.rooms.map((v) => {
            if (v.roomNo === no) {
                v.seats = v.seats.filter((subV) => subV.seatNo === positionNo);
            }
            return v;
        });
    }
}
