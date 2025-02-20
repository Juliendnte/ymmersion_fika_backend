import {IsNotEmpty, IsNumber} from "class-validator";
import {CreateOrderItemsDto} from "src/module/order/dto/create-order-items.dto";

export class CreateOrderDto {

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @IsNotEmpty()
    orderItems: CreateOrderItemsDto[];
}