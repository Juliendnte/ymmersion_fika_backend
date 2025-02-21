import {Catch, Controller, Get, Param, UseGuards} from "@nestjs/common";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {UserService} from "src/module/user/user.service";
import {GetUser} from "src/common/decorators/get-user.decorator";
import {User} from "@prisma/client";
import {JwtAuthGuard} from "src/module/auth/strategy/jwt-auth.guards";

@Controller('users')
@Catch(HttpExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@GetUser() user: User) {
        return user;
    }

    @Get(':uid')
    getUserById(@Param('uid') uid: string) {
        return this.userService.findOne(uid)
    }
}