import { Module } from '@nestjs/common';
import {SubscriptionController} from "src/module/subscription/subscription.controller";
import {OrderService} from "src/module/order/order.service";

@Module({
    controllers: [SubscriptionController],
    providers: [OrderService],
})
export class SubscriptionModule {}
