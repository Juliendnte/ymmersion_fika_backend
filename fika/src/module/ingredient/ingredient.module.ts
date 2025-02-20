import { Module } from '@nestjs/common';
import {IngredientController} from "src/module/ingredient/ingredient.controller";
import {IngredientService} from "src/module/ingredient/ingredient.service";

@Module({
    controllers: [IngredientController],
    providers: [IngredientService],
})
export class IngredientModule {
}
