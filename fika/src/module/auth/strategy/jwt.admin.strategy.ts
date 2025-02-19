import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {UserService} from 'src/module/user/user.service';
import {ConfigService} from '@nestjs/config';
import {ERROR} from 'src/common/constants/error.constants';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private userService: UserService) {
        const config = new ConfigService();
        const secretOrKey = config.get('JWT_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey
        });
    }

    async validate(payload: { userId: string }) {
        const user = await this.userService.findOne(payload.userId);
        if (!user) {
            throw new UnauthorizedException(ERROR.UnauthorizedAccess);
        }

        if (user.Role.role.toLowerCase() !== 'admin') {
            throw new ForbiddenException(ERROR.ForbiddenAction);
        }

        return user;
    }
}
