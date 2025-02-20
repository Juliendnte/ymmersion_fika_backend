import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateOrderDto} from "src/module/order/dto/create-order.dto";
import {ERROR} from "src/common/constants/error.constants";

@Injectable()
export class OrderService {

    constructor(private prismaService: PrismaService) {
    }

    async createOrder(uidUser: string, {orderItems, ...produit}: CreateOrderDto) {
        const status = await this.prismaService.orderStatus.findUnique({
            where: {
                name: "En attente"
            }
        })
        if (!status) {
            throw new BadRequestException(ERROR.ErrorSystem)
        }

        const missingIngredients = await Promise.all(
            orderItems.map(async order => {
                if (order) {
                    const produit = await this.prismaService.produit.findUnique({
                        where: {id: order.idProduit},
                        include: {Produit_Ingredient: true}
                    })
                    if (!produit) {
                        throw new NotFoundException(ERROR.ResourceNotFound)
                    }
                    const baseIngredients = produit.Produit_Ingredient.map(ingr => ingr.idIngredient);
                    const orderIngredients = order.ingredients.map(ingr => ingr.id);
                    const missing = baseIngredients.filter(id => !orderIngredients.includes(id));
                    if( missing.length > 0 ){
                        return missing.map(id => ({
                            idProduit: order.idProduit,
                            idIngredient: id
                        }))
                    }
                }
            }))
        const flattenedMissingIngredients = missingIngredients.flat();
        const orderOptions = flattenedMissingIngredients.length > 0 ? flattenedMissingIngredients : [];

        const orders = await Promise.all(
            orderOptions?.filter(option => option !== undefined).map(async option => await this.prismaService.option.findFirst({
                where: {
                    option: false,
                    available: true,
                    idIngredient: option.idIngredient,
                    idProduit: option.idProduit,
                }
            })) || []
        );
        if (!orders || orders.length === 0) {
            throw new BadRequestException(ERROR.InvalidInputFormat)
        }


        const OrdersOption = await Promise.all(orders.map(option => {
                if (option) {
                    return this.prismaService.option.upsert({
                        where: {
                            id: option.id
                        },
                        update: {},
                        create: {
                            option: false,
                            idIngredient: option.idIngredient,
                            idProduit: option.idProduit,
                            available: true,
                            price: null
                        }
                    })
                }
            }
        ))

        await this.prismaService.order.create({
            data: {
                totalPrice: produit.totalPrice,
                idStatus: status.id,
                uidUser,
                OrderItems: {
                    create: orderItems.map(item => ({
                        quantity: item.quantity,
                        unitPrice: item.price,
                        idProduit: item.idProduit
                    }))
                },
                OrderOption: {
                    create: OrdersOption?.filter((item) => item != null)
                        .map((item) => ({
                                    idOption: item?.id,
                                    idIngredient: item?.idIngredient,
                                }
                            )
                        )
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
