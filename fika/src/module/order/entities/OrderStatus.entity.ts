import { OrderEntity } from './order.entity';

export class OrderStatusEntity {
    constructor({ Orders, ...data }: Partial<OrderStatusEntity>) {
        Object.assign(this, data);

        if (Orders) {
            this.Orders = Orders.map(order => new OrderEntity(order));
        }
    }

    id: number;
    name: string; // Ex: "En attente", "En préparation", "Prête", "Terminée"
    Orders: OrderEntity[];
}
