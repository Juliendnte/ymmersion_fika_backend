import {IsBoolean, IsDecimal, IsInt,  IsOptional, IsString} from "class-validator";
import {CreateProduitIngredientDto} from "src/module/produit/dto/create-produit-ingredient.dto";

export class UpdateProduitDto{
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsInt()
    price: number;

    @IsOptional()
    @IsBoolean()
    isPlatDuJour: boolean;

    @IsOptional()
    @IsDecimal()
    promotion: number;

    @IsOptional()
    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    ingredientsProduits: CreateProduitIngredientDto[];
}