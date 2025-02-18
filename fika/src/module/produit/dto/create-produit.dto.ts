import {IsBoolean, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString} from "class-validator";

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
}