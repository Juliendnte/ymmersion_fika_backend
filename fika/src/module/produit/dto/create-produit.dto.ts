import {IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {CreateProduitIngredientDto} from "src/module/produit/dto/create-produit-ingredient.dto";

export class CreateProduitDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsInt()
    price: number;

    @IsOptional()
    @IsBoolean()
    isPlatDuJour: boolean;

    @IsOptional()
    @IsDecimal()
    promotion: number;

    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    ingredientsProduits: CreateProduitIngredientDto[];
}