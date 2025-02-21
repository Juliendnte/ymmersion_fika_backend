import {IsDecimal, IsNotEmpty, IsNumber, IsOptional} from "class-validator";
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";

export class CreateOrderItemsDto {
    @IsNumber()
    @IsOptional()
    quantity: number = 1;

    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    ingredients: IngredientEntity[]
}