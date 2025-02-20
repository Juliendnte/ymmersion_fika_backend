import {Body, Controller, Post, UseGuards} from '@nestjs/common';
import {OrderService} from "src/module/order/order.service";
import {JwtAuthGuard} from "src/module/auth/strategy/jwt-auth.guards";
import {CreateOrderDto} from "src/module/order/dto/create-order.dto";
import {GetUser} from "src/common/decorators/get-user.decorator";
import {User} from "@prisma/client";

@Controller('orders')
export class OrderController {

    constructor(private orderService: OrderService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
        return this.orderService.createOrder(user.uid, createOrderDto);
    }
}
