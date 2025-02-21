import { OrderEntity } from './order.entity';
import {OptionEntity} from "src/module/order/entities/option.entity";

export class OrderOptionEntity {
    constructor({ Option, Order, ...data }: Partial<OrderOptionEntity>) {
        Object.assign(this, data);

        if (Option) {
            this.Option = new OptionEntity(Option);
        }
        if (Order) {
            this.Order = new OrderEntity(Order);
        }
    }

    idOption: number;
    idOrder: number;
    Option: OptionEntity;
    Order: OrderEntity;
}
