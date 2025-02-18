import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {UserService} from "src/module/user/user.service";
import {UserController} from "src/module/user/user.controller";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [ConfigModule],
    exports: [UserService],
})
export class UserModule {}