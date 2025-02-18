import {UserEntity} from "src/module/user/entities/user.entity";
import {TypeEntity} from "src/module/produit/entities/type.entity";
import {CategoryEntity} from "src/module/produit/entities/category.entity";

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
    description: string;
    imagePath: string;
    price: number;
    isPlatDuJour: boolean;
    promotion?: number;
    createdAt: Date;
    updatedAt: Date;
    Type: TypeEntity;
    User: UserEntity;
    Category: CategoryEntity;
}