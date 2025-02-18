import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PrismaService} from "src/prisma/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private config: ConfigService
    ) {}
}