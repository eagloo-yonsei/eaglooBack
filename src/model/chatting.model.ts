import { User } from "./user.model";

export interface ChattingContent {
    user: User;
    content: string;
    writtenTime: string;
    key: number;
}
