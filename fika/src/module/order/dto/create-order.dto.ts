import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";
import {CreateOrderItemsDto} from "src/module/order/dto/create-order-items.dto";
import {CreateOrderOptionsDto} from "src/module/order/dto/create-order-options.dto";

export class CreateOrderDto {

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    OrdersItems: CreateOrderItemsDto[];

    @IsOptional()
    OrdersOptions?: CreateOrderOptionsDto[];
}