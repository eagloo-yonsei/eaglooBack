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

    findRooms() {
        return this.rooms;
    }

    findRoom(roomNo: number) {
        return this.rooms.find((v) => {
            if (v.roomNo === roomNo) {
                return v;
            }
        });
    }

    findRoomByPositionNo(roomNo: number, positionNo: number) {
        return this.rooms.find((v) => {
            if (v.roomNo === roomNo) {
                return v.seats.find((subV) => subV.seatNo === positionNo);
            }
        });
    }

    deleteRoomDetailBySocketId(socketId: string) {
        let removedDetail: Seat | undefined;
        this.rooms = this.rooms.map((room) => {
            room.seats =
                room.seats?.filter((detail) => {
                    if (detail.socketId !== socketId) {
                        return true;
                    } else {
                        removedDetail = detail;
                    }
                }) || [];
            return room;
        });
        return removedDetail;
    }

    joinRoom(roomNo: number, newSeat: Seat) {
        const currentRoom = this.rooms.find((room) => room.roomNo === roomNo);
        // if (currentRoom) {
        //     currentRoom.seats = currentRoom.seats.map((seat) => {
        //         if (seat.seatNo === newSeat.seatNo) {
        //             return {
        //                 ...seat,
        //                 socketId: newSeat.socketId,
        //             };
        //         }
        //         return seat;
        //     });
        // }
        currentRoom?.seats.push(newSeat);
        return currentRoom as Room;
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
