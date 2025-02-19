import {Injectable, NotFoundException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "src/prisma/prisma.service";
import {ERROR} from "src/common/constants/error.constants";
import {UserEntity} from "src/module/user/entities/user.entity";

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private config: ConfigService
    ) {
    }

    async findOne(uid: string): Promise<UserEntity> {
        const user = await this.prismaService.user.findUnique({
            where: {
                uid
            },
            include: {
                Role: true
            }
        })
        if (!user) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        return new UserEntity(user);
    }
}