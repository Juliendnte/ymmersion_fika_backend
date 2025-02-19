import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class IngredientEntity{
    constructor(partial: Partial<IngredientEntity>) {
        Object.assign(this, partial);
    }

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    unit: string;
}