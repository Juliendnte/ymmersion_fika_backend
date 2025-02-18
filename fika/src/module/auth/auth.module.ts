import {ConfigService} from "@nestjs/config";
import {Module} from "@nestjs/common";
import {PrismaModule} from "src/prisma/prisma/prisma.module";
import {JwtAdminStrategy} from "src/module/auth/strategy/jwt.admin.strategy";
import {JwtOptionalStrategy} from "src/module/auth/strategy/optional-jwt-auth.guards";


const config = new ConfigService();

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: config.get('JWT_SECRET'),
        })
    ],
    controllers: [],
    providers: [JwtAdminStrategy, JwtOptionalStrategy]
})