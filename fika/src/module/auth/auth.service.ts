import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma/prisma.service";
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from "@nestjs/config";
import {ERROR} from "src/common/constants/error.constants";
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from "src/module/user/dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    async login(email: string, password: string) {
        const user = await this.prismaService.user.findUnique({
            where: {email},
        })
        if (!user) {
            throw new NotFoundException(ERROR.IncorrectCredentials)
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new NotFoundException(ERROR.IncorrectCredentials)
        }

        const refreshToken = this.generateRefreshToken({userId: user.uid})
        await this.prismaService.user.update({
            where: {uid: user.uid},
            data: {
                refreshToken
            }
        })
        return {
            accessToken: this.generateAccessToken({userId: user.uid}),
            refreshToken
        }
    }

    async register({password, ...userDto}: CreateUserDto) {
        const user = await this.prismaService.user.findUnique({
            where: {email: userDto.email},
        })
        if (!user) {
            throw new ConflictException(ERROR.AlreadyExists)
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const idRole = await this.prismaService.role.findUnique({
            where: {
                role: 'admin'
            }
        })
        if (!idRole) {
            throw new NotFoundException(ERROR.ErrorSystem);
        }

        return this.prismaService.user.create({
            data: {
                ...userDto,
                password: hashedPassword,
                idRole: idRole.id
            }
        })
    }

    generateAccessToken(payload: object): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
        });
    }

    generateRefreshToken(payload: object): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
        });
    }

    generateResetToken(payload: object): string {
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('RESET_TOKEN_EXPIRATION'),
        });
    }

    validateToken(token: string): any {
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
            });
        } catch (error) {
            return null;
        }
    }

    getBaseUrlMedia() {
        return this.configService.get('BASE_URL_MEDIA');
    }

    async refreshToken(token: string) {
        const payload: { userId: string } = this.validateToken(token);
        if (!payload) {
            throw new UnauthorizedException(ERROR.UnauthorizedAccess)
        }

        const user = await this.prismaService.user.findUnique({
            where: {uid: payload.userId},
        })

        if (!user || user.refreshToken !== token) {
            throw new UnauthorizedException(ERROR.UnauthorizedAccess)
        }

        const accessToken = this.generateAccessToken({userId: user.uid})
        const refreshToken = this.generateRefreshToken({userId: user.uid})

        await this.prismaService.user.update({
            where: {
                uid: user.uid
            }

        })
    }
}