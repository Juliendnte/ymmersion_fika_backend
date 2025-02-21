import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateIngredientDto} from "src/module/ingredient/dto/create-ingredient.dto";
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";
import {ERROR} from "src/common/constants/error.constants";

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

    async getIngredient(id: number){
        const ingredient = await this.prismaService.ingredient.findUnique({
            where:{
                id
            }
        })
        if (!ingredient) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        return new IngredientEntity(ingredient);
    }
}
