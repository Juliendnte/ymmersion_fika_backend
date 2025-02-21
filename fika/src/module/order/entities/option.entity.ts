import {ProduitEntity} from "src/module/produit/entities/produit.entity";
import {OrderOptionEntity} from "src/module/order/entities/OrderOption.entity";

export class OptionEntity {
    constructor({ Produits, OrderOptions, ...data }: Partial<OptionEntity>) {
        Object.assign(this, data);

        if (Produits) {
            this.Produits = Produits.map(produit => new ProduitEntity(produit));
        }
        if (OrderOptions) {
            this.OrderOptions = OrderOptions.map(orderOption => new OrderOptionEntity(orderOption));
        }
    }

    id: number;
    name: string;
    additionalPrice: number;
    Produits?: ProduitEntity[];
    OrderOptions?: OrderOptionEntity[];
}
