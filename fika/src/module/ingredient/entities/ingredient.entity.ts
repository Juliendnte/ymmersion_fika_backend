import {IsInt, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class IngredientEntity{
    constructor(partial: Partial<IngredientEntity>) {
        Object.assign(this, partial);
    }
    @IsNotEmpty()
    @IsInt()
    id: number;

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