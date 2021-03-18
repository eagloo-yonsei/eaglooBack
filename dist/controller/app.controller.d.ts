import { AppService } from "src/service/app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createUser(): Promise<import("../model/app.model").User[]>;
}
