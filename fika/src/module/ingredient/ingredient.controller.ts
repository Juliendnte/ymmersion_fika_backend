import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import {IngredientService} from "src/module/ingredient/ingredient.service";
import {CreateIngredientDto} from "src/module/ingredient/dto/create-ingredient.dto";

@Controller('ingredient')
export class IngredientController {
    constructor(private ingredientService: IngredientService) {
    }

    @Post()
    createIngredient(@Body() ingredientDto: CreateIngredientDto) {
        return this.ingredientService.create(ingredientDto)
    }

    @Patch(':id')
    updateIngredient(@Body() ingredientDto: CreateIngredientDto, @Param('id', ParseIntPipe) id: number) {
        return this.ingredientService.update(ingredientDto, id)
    }

    @Get()
    getIngredients() {
        return this.ingredientService.getAllIngredients()
    }
}
