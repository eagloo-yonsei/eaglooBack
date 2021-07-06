import { ICommonResponse } from "./common.dto";

export interface IConnectRoomResponse extends ICommonResponse {
    rooms?: any[];
}
