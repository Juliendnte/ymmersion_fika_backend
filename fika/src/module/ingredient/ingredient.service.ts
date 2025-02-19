import { Injectable } from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateIngredientDto} from "src/module/ingredient/dto/create-ingredient.dto";

@Injectable()
export class IngredientService {
    constructor(private prismaService: PrismaService) {}

    create(createIngredientDto: CreateIngredientDto){
        return this.prismaService.ingredient.create({
            data: {
                ...createIngredientDto
            }
        })
    }

    update(createIngredientDto: CreateIngredientDto, id: number){
        return this.prismaService.ingredient.update({
            where: {
                id
            },
            data: {
                ...createIngredientDto
            }
        })
    }

    getAllIngredients() {
        return this.prismaService.ingredient.findMany()
    }
}
