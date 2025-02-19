import {ConfigService} from "@nestjs/config";
import {forwardRef, Module} from "@nestjs/common";
import {PrismaModule} from "src/prisma/prisma.module";
import {JwtAdminStrategy} from "src/module/auth/strategy/jwt.admin.strategy";
import {JwtOptionalStrategy} from "src/module/auth/strategy/optional-jwt-auth.strategy";
import {EmailModule} from "src/module/auth/email/email.module";
import {AuthController} from "src/module/auth/auth.controller";
import {AuthService} from "src/module/auth/auth.service";
import {UserService} from "src/module/user/user.service";
import {JwtModule} from "@nestjs/jwt";


@Module({
    imports: [
        PrismaModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => EmailModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtAdminStrategy, JwtOptionalStrategy],
    exports: [AuthService],
})
export class AuthModule {
}