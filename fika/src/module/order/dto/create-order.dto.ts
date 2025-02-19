import {IsNotEmpty, IsNumber, IsString} from "class-validator";
import {CreateOrderItemsDto} from "src/module/order/dto/create-order-items.dto";

export class CreateOrderDto {

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    OrdersItems: CreateOrderItemsDto[];
}