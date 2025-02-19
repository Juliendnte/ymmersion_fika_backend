import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateOrderDto} from "src/module/order/dto/create-order.dto";
import {ERROR} from "src/common/constants/error.constants";

@Injectable()
export class OrderService {

    constructor(private prismaService: PrismaService) {
    }

    async createOrder(uidUser: string, {OrdersItems, OrdersOptions, ...produit}: CreateOrderDto) {
        const status = await this.prismaService.orderStatus.findUnique({
            where: {
                name: produit.status
            }
        })
        if (!status) {
            throw new BadRequestException(ERROR.InvalidInputFormat)
        }

        const orders = OrdersOptions?.map(async option => await this.prismaService.option.findFirst({
            where: {
                option: false,
                available: true,
                idIngredient: option.idIngredient,
                idProduit: option.idProduit,
            }
        }));
        if (!orders || orders.length === 0) {
            throw new BadRequestException(ERROR.InvalidInputFormat)
        }
        /*
        orders.map(option => this.prismaService.option.upsert({
            where: {
                id: option.id
            },
            update: {},
            create: {

            }
        }))*/

        const createOrder = await this.prismaService.order.create({
            data: {
                totalPrice: produit.totalPrice,
                idStatus: status.id,
                uidUser,
                OrderItems: {
                    create: OrdersItems.map(item => ({
                        quantity: item.quantity,
                        unitPrice: item.price,
                        idProduit: item.idProduit
                    }))
                },
                OrderOption: {

                }
            }
        })

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
