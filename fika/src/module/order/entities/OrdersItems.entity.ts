import { Decimal } from '@prisma/client/runtime/library';
import { ProduitEntity } from '../../produit/entities/produit.entity';
import { OrderEntity } from './order.entity';

export class OrderItemEntity {
    constructor({ Produit, Order, ...data }: Partial<OrderItemEntity>) {
        Object.assign(this, data);

        if (Produit) {
            this.Produit = new ProduitEntity(Produit);
        }
        if (Order) {
            this.Order = new OrderEntity(Order);
        }
    }

    id: number;
    idOrder: number;
    idProduit: number;
    quantity: number;
    unitPrice: Decimal;
    Produit?: ProduitEntity;
    Order: OrderEntity;
}
