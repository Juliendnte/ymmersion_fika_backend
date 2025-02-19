import {IsBoolean, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class CreateOrderOptionsDto {
    @IsNumber()
    @IsNotEmpty()
    idIngredient: number;

    @IsBoolean()
    @IsNotEmpty()
    option: boolean;

    @IsNumber()
    @IsOptional()
    price?: number;
}