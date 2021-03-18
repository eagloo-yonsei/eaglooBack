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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const constants_1 = require("../constants");
const room_model_1 = require("../model/room.model");
let SocketIoGateway = class SocketIoGateway {
    afterInit(server) { }
    handleConnection(client, ...args) { }
    handleDisconnect(client) { }
    sendMessage(client, message) { }
    enter(room) {
        var _a;
        this.wss.emit("accepted", `회원정보 반환값`);
        console.log(`새 유저 입장, 방인원 : `, (_a = room.users) === null || _a === void 0 ? void 0 : _a.length);
    }
};
__decorate([
    websockets_1.WebSocketServer(),
    __metadata("design:type", socket_io_1.Server)
], SocketIoGateway.prototype, "wss", void 0);
__decorate([
    websockets_1.SubscribeMessage("message_send"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], SocketIoGateway.prototype, "sendMessage", null);
SocketIoGateway = __decorate([
    websockets_1.WebSocketGateway()
], SocketIoGateway);
exports.SocketIoGateway = SocketIoGateway;
//# sourceMappingURL=socket.io.gateway.js.map