import {Catch, Controller} from "@nestjs/common";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {UserService} from "src/module/user/user.service";

@Controller('users')
@Catch(HttpExceptionFilter)
export class UserController {
    constructor(private readonly userService: UserService) {}

}