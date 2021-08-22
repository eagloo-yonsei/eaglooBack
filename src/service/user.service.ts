import { Injectable } from "@nestjs/common";
import { User, ConnectedUser } from "src/model";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "src/utils/sendMail";
const prisma = new PrismaClient();

@Injectable()
export class UserService {
    private connectedUsers: ConnectedUser[] = [];

    getConnectedUserInfo(socketId?: string, email?: string) {
        return this.connectedUsers.find((connectedUser) => {
            return (
                connectedUser.socketId === socketId ||
                connectedUser.userInfo.email === email
            );
        });
    }

    // 소켓 연결 시 정보 추가
    connectUser(socketId: string, userInfo: User) {
        this.connectedUsers.push({ socketId, userInfo });
        // console.log(
        //     `(@User Service) 접속 유저 : ${this.connectedUsers.length}`
        // );
    }

    // 소켓 연결 해제 시(로그아웃 or 창 닫음) 정보 삭제
    disconnectUser(socketId: string) {
        let disconnectedUser: ConnectedUser;
        this.connectedUsers = this.connectedUsers.filter((connectedUser) => {
            return connectedUser.socketId !== socketId;
        });
        // console.log(
        //     `(@User Service) 소켓 연결 해제 후 접속 유저 : ${this.connectedUsers.length}`
        // );
        // console.dir(this.connectedUsers);
        return disconnectedUser;
    }

    // 입실 시 기존에 연결된 사용자 정보에 방 id와 자리번호 추가
    // TODO (enhancement) userService joinRoom : 나중에 email을 기준으로 search 하도록 바꿀 것.
    // joinRoom(email: string, roomId: string, seatNo: number) {
    joinRoom(socketId: string, roomId: string, seatNo: number) {
        let joinedUser: ConnectedUser;
        this.connectedUsers.map((connectedUser) => {
            if (connectedUser.socketId !== socketId) {
                return connectedUser;
            } else {
                joinedUser = connectedUser;
                connectedUser.roomId = roomId;
                connectedUser.seatNo = seatNo;
                return connectedUser;
            }
        });
        // console.log(
        //     `(@User Service) ${socketId}(${joinedUser.userInfo.email})이 ${roomId}방 ${seatNo}번 자리에 입장`
        // );
    }

    // 퇴실 시 기존에 연결된 사용자 정보에서 방 id와 자리번호 삭제
    quitRoom(socketId: string) {
        let quitUser: ConnectedUser;
        this.connectedUsers.map((connectedUser) => {
            if (connectedUser.socketId !== socketId) {
                return connectedUser;
            } else {
                quitUser = connectedUser;
                connectedUser.roomId = undefined;
                connectedUser.seatNo = undefined;
                return connectedUser;
            }
        });
        // console.log(
        //     `(@User Service) ${socketId}(${quitUser.userInfo.email})이 ${quitUser.roomId}방 ${quitUser.seatNo}번 자리에서 퇴장`
        // );
        return quitUser;
    }

    async login(email: string, password: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "일치하는 메일 주소가 없어요.",
                };
            } else {
                if (user.banned) {
                    return {
                        success: false,
                        message: "신고로 인하여 정지된 계정입니다.",
                    };
                }
                if (!user.authenticated) {
                    return {
                        success: false,
                        message: "아직 인증이 완료되지 않은 계정입니다.",
                    };
                }
                if (user.password !== password) {
                    return {
                        success: false,
                        message: "비밀번호가 일치하지 않아요.",
                    };
                }
                return {
                    success: true,
                    user: user,
                };
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요.",
            };
        }
    }

    async signUp1(email: string, secret: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (user) {
                if (user.authenticated && user.password !== "eagloo") {
                    return {
                        success: false,
                        message: "이미 사용 중인 메일 주소입니다.",
                    };
                } else {
                    await prisma.user.update({
                        where: { email },
                        data: { verificationSecret: secret },
                    });
                    // TODO
                    // sendMail 발송 오류 처리
                    if (await sendMail(email, secret)) {
                        return {
                            success: true,
                            message: `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`,
                        };
                    } else {
                        return {
                            success: false,
                            message: "인증 메일 발송 중 오류가 발생했습니다",
                        };
                    }
                }
            }

            await prisma.user.create({
                data: {
                    email,
                    verificationSecret: secret,
                },
            });
            // TODO
            // sendMail 발송 오류 처리
            if (await sendMail(email, secret)) {
                return {
                    success: true,
                    message: `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`,
                };
            } else {
                return {
                    success: false,
                    message: "인증 메일 발송 중 오류가 발생했습니다",
                };
            }
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요.",
            };
        }
    }

    async signUp2(email: string, givenSecret: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });
            if (!user) {
                return {
                    success: false,
                    message:
                        "계정 생성이 완료되지 않았습니다. 잠시 후 처음부터 다시 시도해 주세요.",
                };
            }

            if (user.verificationSecret !== givenSecret) {
                return {
                    success: false,
                    message:
                        "인증 단어가 일치하지 않습니다. 단어를 다시 확인해주세요. 인증 단어는 띄어쓰기를 포함합니다.",
                };
            }

            await prisma.user.update({
                where: { email },
                data: { authenticated: true },
            });
            return {
                success: true,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async signUp3(email: string, givenPassword: string) {
        try {
            await prisma.user.update({
                where: { email },
                data: { password: givenPassword },
            });
            return {
                success: true,
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async checkNickNameDuplicate(nickName: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { nickName },
            });

            if (user) {
                return {
                    success: false,
                    message: "이미 사용 중인 닉네임입니다.",
                };
            }

            return { success: true, message: "사용 가능한 닉네임입니다." };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요",
            };
        }
    }

    async updateUserInfo(
        email: string,
        previousPassword: string,
        nickName?: string,
        realName?: string,
        newPassword?: string
    ) {
        try {
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (user.password !== previousPassword) {
                return {
                    success: false,
                    message: "비밀번호가 일치하지 않아요.",
                };
            }

            await prisma.user.update({
                where: { email },
                data: {
                    nickName: nickName ? nickName : user.nickName,
                    realName: realName ? realName : user.realName,
                    password: newPassword ? newPassword : user.password,
                },
            });
            return {
                success: true,
                message: "사용자 정보가 정상적으로 업데이트 되었습니다.",
            };
        } catch (error) {
            console.error(error);
            return {
                success: false,
                message: "서버 오류입니다. 잠시 후 다시 시도해 주세요.",
            };
        }
    }
}
