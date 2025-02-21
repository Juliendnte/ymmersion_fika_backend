import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
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
        console.log(createOrderDto);
        return this.orderService.createOrder(user.uid, createOrderDto);
    }

    @Get()
    getAll(){
        return this.orderService.getAllOrder()
    }

    @Get(':id')
    getById(@Param('id', ParseIntPipe) id: number){
        return this.orderService.getOrderById(id);
    }
}
