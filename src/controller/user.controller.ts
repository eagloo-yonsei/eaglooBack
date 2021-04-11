import { Body, Controller, Get, NotFoundException, Param, Post, Put } from "@nestjs/common";
import { User } from "src/model/user.model";
import { PrismaService } from "src/service/prisma.service";
import { UserService } from "src/service/user.service";

import { sendMail } from "../utils/sendMail";
import { secretGenerator } from "../utils/secretGenerator";

@Controller("api/user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService
  ) {}

  // @Post("/auth")
  // async login() {
  //     this.userService.login("dennis2311", "samplePW");
  // }

  @Get()
  async create() {
    const res = await this.prismaService.notice.create({
      data: {
        content: "프리즈마 서비스 테스트",
      },
    });
    console.log("this.prismaService: ", this.prismaService);
    console.log("creat() : ", res);
    return res;
  }

  @Get("list")
  async getUser() {
    const res = await this.prismaService.user.findMany();
    console.log("RES: ", res);
    return res;
  }

  // Eagloo-back의 userRouter.js.

  @Get(":email/:password")
  async login(
    @Param("email") email: string,
    @Param("password") password: string
  ) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        if (user.password === password) {
          if (user.authenticated) {
            if (!user.banned) {
              return {
                success: true,
              };
            } else {
              throw new NotFoundException(
                "신고로 인하여 정지된 계정입니다. 관리자에게 문의하세요"
              );
            }
          } else {
            throw new NotFoundException("아직 계정 인증이 완료되지 않았어요");
          }
        } else {
          throw new NotFoundException("비밀번호가 일치하지 않아요");
        }
      } else {
        throw new NotFoundException("일치하는 메일 주소가 없어요");
      }
    } catch (err) {
      console.log(err);
      throw new NotFoundException("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }

  @Post()
  async signUpStep1(@Body() body) {
    const email = body.email;
    const secret = secretGenerator();
    const response = { success: false, message: "" };

    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        if (user.authenticated) {
          throw new NotFoundException("이미 사용 중인 메일 주소입니다");
        } else {
          await this.prismaService.user.update({
            where: { email },
            data: { verificationSecret: secret },
          });
          // TODO
          // sendMail 발송 오류 처리
          if (sendMail(email, secret)) {
            return {
              success: true,
              message: `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`,
            };
          } else {
            throw new NotFoundException("메일 발송 중 오류가 발생했습니다");
          }
        }
      } else {
        await this.prismaService.user.create({
          data: {
            email,
            verificationSecret: secret,
          },
        });
        // TODO
        // sendMail 발송 오류 처리
        if (sendMail(email, secret)) {
          return {
            success: true,
            message: `인증 메일이 ${email}@yonsei.ac.kr 로 발송되었습니다`,
          };
        } else {
          throw new NotFoundException("메일 발송 중 오류가 발생했습니다");
        }
      }
    } catch (err) {
      console.log(err);
      throw new NotFoundException("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }

  @Put("secret")
  async signUpStep2(@Body() body) {
    const email = body.email;
    const givenSecret = body.givenSecret;

    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        if (user.verificationSecret === givenSecret) {
          await this.prismaService.user.update({
            where: { email },
            data: { authenticated: true },
          });
          return {
            success: true,
          };
        } else {
          throw new NotFoundException("인증 단어가 일치하지 않습니다");
        }
      } else {
        throw new NotFoundException(
          "임시 계정 생성이 완료되지 않았습니다. 잠시 후 다시 시도해주세요. \n증상이 계속되는 경우, 관리자에게 문의해주세요"
        );
      }
    } catch (err) {
      console.log(err);
      throw new NotFoundException("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }

  @Put("password")
  async signUpStep3(@Body() body) {
    const email = body.email;
    const givenPassword = body.givenPassword;

    try {
      await this.prismaService.user.update({
        where: { email },
        data: { password: givenPassword },
      });
      return {
        success: true,
      };
    } catch (err) {
      console.log(err);
      throw new NotFoundException("서버 오류입니다. 잠시 후 다시 시도해 주세요");
    }
  }
}
