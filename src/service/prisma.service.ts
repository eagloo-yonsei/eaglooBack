import { PrismaClient } from ".prisma/client";
import { Injectable } from "@nestjs/common";

// prisma 모듈과 서비스를 진행.
@Injectable()
export class PrismaService extends PrismaClient {}
