import { User } from "src/model/app.model";
export declare class AppService {
    user: User[];
    createUser(args: User): Promise<void>;
    deleteUser(): Promise<void>;
}
