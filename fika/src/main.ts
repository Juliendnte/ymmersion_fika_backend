import {HttpAdapterHost, NestFactory, Reflector} from '@nestjs/core';
import {AppModule} from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";
import {customValidationExceptionFactory} from "src/common/filters/custom-validation-exception.factory";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {PrismaClientExceptionFilter} from "src/prisma/exceptions/prisma-client-exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            exceptionFactory: customValidationExceptionFactory
        })
    )
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    const {httpAdapter} = app.get(HttpAdapterHost)
    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalFilters(new PrismaClientExceptionFilter())
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
