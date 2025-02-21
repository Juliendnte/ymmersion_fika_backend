import {Decimal} from '@prisma/client/runtime/library';
import {UserEntity} from '../../user/entities/user.entity';
import {OrderOptionEntity} from "src/module/order/entities/OrderOption.entity";
import {OrderItemEntity} from "src/module/order/entities/OrdersItems.entity";
import {OrderStatusEntity} from "src/module/order/entities/OrderStatus.entity";

export class OrderEntity {
    constructor({User, Status, OrderItems, OrderOptions, ...data}: Partial<OrderEntity>) {
        Object.assign(this, data);

        if (User) {
            this.User = new UserEntity(User);
        }
        if (Status) {
            this.Status = new OrderStatusEntity(Status);
        }
        if (OrderItems) {
            this.OrderItems = OrderItems.map(item => new OrderItemEntity(item));
        }
        if (OrderOptions) {
            this.OrderOptions = OrderOptions.map(option => new OrderOptionEntity(option));
        }
    }

    id: number;
    createdAt: Date;
    updatedAt: Date;
    totalPrice: number;
    idStatus: number;
    uidUser: string;
    User: UserEntity;
    Status: OrderStatusEntity;
    OrderItems: OrderItemEntity[];
    OrderOptions: OrderOptionEntity[];
}
