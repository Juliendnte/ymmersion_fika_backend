import { Injectable } from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateIngredientDto} from "src/module/ingredient/dto/create-ingredient.dto";
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";

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

    async getAllIngredients() {
        const ingredients = await this.prismaService.ingredient.findMany();
        return ingredients.map(ingredient => new IngredientEntity(ingredient));
    }
}
