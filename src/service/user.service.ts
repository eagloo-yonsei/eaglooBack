import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { sendMail } from "src/utils/sendMail";
const prisma = new PrismaClient();

@Injectable()
export class UserService {
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
