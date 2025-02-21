import {UserEntity} from "src/module/user/entities/user.entity";
import {TypeEntity} from "src/module/produit/entities/type.entity";
import {CategoryEntity} from "src/module/produit/entities/category.entity";
import {Decimal} from "@prisma/client/runtime/client";
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";

export class ProduitEntity{
    constructor({User, Category, Type, ...data} : Partial<ProduitEntity>) {
        Object.assign(this, data);
        if (User){
            this.User = new UserEntity(User);
        }
        if (Category){
            this.Category = new CategoryEntity(Category);
        }
        if (Type){
            this.Type = new TypeEntity(Type);
        }
    }

    name: string;
    description?: string | null;
    price: number;
    isPlatDuJour: boolean;
    promotion?: number | null;
    createdAt: Date;
    updatedAt: Date;
    available: boolean;
    category: string;
    type: string;
    ingredients: IngredientEntity[];
    Type: TypeEntity;
    User: UserEntity;
    Category: CategoryEntity;
}