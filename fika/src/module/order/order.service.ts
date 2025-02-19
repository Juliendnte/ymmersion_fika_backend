import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateOrderDto} from "src/module/order/dto/create-order.dto";
import {ERROR} from "src/common/constants/error.constants";

@Injectable()
export class OrderService {

    constructor(private prismaService: PrismaService) {
    }

    createOrder({OrdersItems, OrdersOptions, ...produit}: CreateOrderDto) {

    }

    async getOrderById(orderId: number) {
        const Order = await this.prismaService.order.findUnique({
            where: {
                id: orderId,
            }
        })
        if (!Order) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        return Order;
    }
}
