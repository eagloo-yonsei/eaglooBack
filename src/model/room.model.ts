export class Room {
    /** 방 순번 */
    id: string;
    /** 방 제목 */
    title: string;
    /** 제한인원 */
    limit: number;
    /** 현재 참여수 */
    count: number;
    /** 현재 참여 유저목록 */
    users: any[];
}
