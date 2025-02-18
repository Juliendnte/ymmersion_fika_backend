import {Catch, Controller} from "@nestjs/common";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {AuthService} from "src/module/auth/auth.service";

@Controller('auth')
@Catch(HttpExceptionFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }
}