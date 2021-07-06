import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SocketIoAdapter } from "./adapter";
import { AppModule } from "./module/app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        credentials: true,
    });
    app.setGlobalPrefix("/api");
    // 소켓 어댑터 등록.
    app.useWebSocketAdapter(new SocketIoAdapter(app, true));
    app.enableCors({
        credentials: true,
    });

    await app.listen(3001);
}

bootstrap();
