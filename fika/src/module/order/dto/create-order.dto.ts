import {IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateOrderDto {

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @IsString()
    @IsNotEmpty()
    status: string;

}