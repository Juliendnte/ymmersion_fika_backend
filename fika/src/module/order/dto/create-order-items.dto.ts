import {IsDecimal, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

export class CreateOrderItemsDto {
    @IsNumber()
    @IsOptional()
    quantity: number;

    @IsDecimal()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    idProduit: number;
}