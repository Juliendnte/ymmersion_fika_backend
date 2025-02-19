import { Injectable } from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateOrderDto} from "src/module/order/dto/create-order.dto";

@Injectable()
export class OrderService {

    constructor(private prismaService: PrismaService) {
    }

    createOrder({OrdersItems, ...produit}: CreateOrderDto) {

    }
}
