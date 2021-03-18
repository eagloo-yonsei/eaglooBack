"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const socket_io_gateway_1 = require("../gateway/socket.io.gateway");
let RoomController = class RoomController {
    constructor(socketIoGateway) {
        this.socketIoGateway = socketIoGateway;
    }
    getTest() {
        return "hello gettest";
    }
    connectRoom(args) {
        console.log("args: ", args);
        if (true) {
            this.socketIoGateway.enter({
                count: 1,
                id: "1",
                limit: 6,
                title: "",
                users: [],
            });
        }
        else {
            if (true) {
                throw new common_1.NotAcceptableException("인원수가 최대치 입니다.");
            }
            else {
                throw new common_1.NotFoundException("해당방이 존재하지 않음");
            }
        }
    }
};
__decorate([
    common_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "getTest", null);
__decorate([
    common_1.Post(),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "connectRoom", null);
RoomController = __decorate([
    common_1.Controller("room"),
    __metadata("design:paramtypes", [socket_io_gateway_1.SocketIoGateway])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map