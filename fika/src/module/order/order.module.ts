import { Module } from '@nestjs/common';
import {OrderController} from "src/module/order/order.controller";
import {OrderService} from "src/module/order/order.service";

@Module({
    controllers: [OrderController],
    providers: [OrderService],
})
export class OrderModule {}
