import {
    Body,
    Catch,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UnauthorizedException,
    ValidationPipe
} from "@nestjs/common";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {AuthService} from "src/module/auth/auth.service";
import {LoginDto} from "src/module/auth/dto/login.dto";
import {CreateUserDto} from "src/module/user/dto/create-user.dto";
import {RefreshTokenDto} from "src/module/auth/dto/refresh-token.dto";
import {ERROR} from "src/common/constants/error.constants";
import {ForgotPasswordDto} from "src/module/auth/dto/forgot-password.dto";
import {ResetPasswordDto} from "src/module/auth/dto/reset-password.dto";

@Controller('auth')
@Catch(HttpExceptionFilter)
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Post('register')
    async register(@Body(new ValidationPipe()) userDto: CreateUserDto) {
        await this.authService.register(userDto);
    }

    @Post('refresh-token')
    async refreshToken(@Body() payload: RefreshTokenDto) {
        try {
            return await this.authService.refreshToken(payload.refreshToken);
        } catch (e) {
            throw new UnauthorizedException(ERROR.InvalidToken);
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() {email}: ForgotPasswordDto) {
        await this.authService.forgotPassword(email);
        return ERROR.EmailSucces
    }

    @Post('reset-password')
    async resetPassword(@Body() {resetToken, password}: ResetPasswordDto) {
        //return this.authService.resetPassword(resetToken, password);
    }
}