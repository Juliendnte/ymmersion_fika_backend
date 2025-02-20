import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {ERROR} from "src/common/constants/error.constants";
import {ProduitEntity} from "src/module/produit/entities/produit.entity";
import * as fs from 'fs-extra';
import {join} from 'path';
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";
import {UpdateProduitDto} from "src/module/produit/dto/update-produit.dto";

@Injectable()
export class ProduitService {
    constructor(private prisma: PrismaService) {
    }

    async create({
                     type,
                     category,
                     ingredientsProduits,
                     ...produit
                 }: CreateProduitDto, uidUser: string, file: Express.Multer.File | null) {
        if (!file){
            const Type = await this.prisma.type.findUnique({
                where: {
                    name: type,
                }
            })
            if (!Type) {
                throw new BadRequestException(ERROR.InvalidInputFormat);
            }

            const Category = await this.prisma.category.findUnique({
                where: {
                    name: category,
                }
            })
            if (!Category) {
                throw new BadRequestException(ERROR.InvalidInputFormat);
            }

            const product = await this.prisma.produit.create({
                data: {
                    name: produit.name,
                    description: produit.description,
                    price: produit.price,
                    isPlatDuJour: produit.isPlatDuJour,
                    promotion: produit.promotion ? produit.promotion : null,
                    idType: Type.id,
                    idCategory: Category.id,
                    imagePath: '/uploads' + "defaults.png",
                    uidUser
                }
            })

            if (ingredientsProduits && ingredientsProduits.length > 0) {
                const ingredientRelations = ingredientsProduits.map((ingredientProduit) => ({
                    idProduit: product.id,
                    idIngredient: ingredientProduit.idIngredient,
                    quantity: ingredientProduit.quantity,
                }));

                await this.prisma.produitIngredient.createMany({
                    data: ingredientRelations,
                });
            }
            return
        }
        const finalPath = join(__dirname, '../../../uploads/produits', file.filename);
        return this.prisma.$transaction(async (prisma) => {
            const Type = await prisma.type.findUnique({
                where: {
                    name: type,
                }
            })
            if (!Type) {
                throw new BadRequestException(ERROR.InvalidInputFormat);
            }

            const Category = await prisma.category.findUnique({
                where: {
                    name: category,
                }
            })
            if (!Category) {
                throw new BadRequestException(ERROR.InvalidInputFormat);
            }



            const product = await prisma.produit.create({
                data: {
                    name: produit.name,
                    description: produit.description,
                    price: produit.price,
                    isPlatDuJour: produit.isPlatDuJour,
                    promotion: produit.promotion ? produit.promotion : null,
                    idType: Type.id,
                    idCategory: Category.id,
                    imagePath: '/projects/' + file.filename,
                    uidUser
                }
            })

            if (ingredientsProduits && ingredientsProduits.length > 0) {
                const ingredientRelations = ingredientsProduits.map((ingredientProduit) => ({
                    idProduit: product.id,
                    idIngredient: ingredientProduit.idIngredient,
                    quantity: ingredientProduit.quantity,
                }));

                await prisma.produitIngredient.createMany({
                    data: ingredientRelations,
                });
            }


            try {
                await fs.move(file.path, finalPath);
                return product;
            } catch (error) {
                throw new Error('File move failed, rolling back entity creation');
            }
        })
    }

    async findAll() {
        const produits = await this.prisma.produit.findMany({
            include: {
                Category: true,
                Type: true,
            }
        });
        return produits.map(({price, promotion, idCategory, idType, Category, Type, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion?.toNumber(),
            category: Category?.name,
            type: Type?.name,
            ...produit
        }));
    }

    async findById(id: number) {
        let produit = await this.prisma.produit.findUnique({
            where: {
                id
            },
            include: {
                Produit_Ingredient: {
                    include: {
                        Ingredient: true
                    }
                },
                Category: true,
                Type: true,
            }
        })

        if (!produit) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        const {price, promotion, Produit_Ingredient, Category, Type, idCategory, idType, ...product} = produit;
        const ingredients = Produit_Ingredient.map(({Ingredient}) => new IngredientEntity({
            name: Ingredient.name,
            quantity: Ingredient.quantity,
            unit: Ingredient.unit,
        }));
        const category = Category?.name
        const type = Type?.name

        return new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion?.toNumber(),
            ingredients,
            category,
            type,
            ...product
        });
    }

    async findPopular() {
        let produits = await this.prisma.produit.findMany({
            take: 3,
            orderBy: {
                OrderItem: {
                    _count: 'desc'
                }
            },
            include: {
                OrderItem: true
            }
        });
        const produitsPopular = produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion ? promotion.toNumber() : null,
            ...produit
        }));

        produits = await this.prisma.produit.findMany({
            take: 3,
            orderBy: {
                OrderItem: {
                    _count: 'asc'
                }
            },
            include: {
                OrderItem: true
            }
        })

        const produitsUnpopular = produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion ? promotion.toNumber() : null,
            ...produit
        }))

        return {
            produitsPopular,
            produitsUnpopular
        }
    }

    async findByPromo() {
        const produits = await this.prisma.produit.findMany({
            where: {
                promotion: {
                    not: null
                },
                AND: {
                    promotion: {
                        not: 0
                    }
                }
            }
        });
        return produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion?.toNumber(),
            ...produit
        }));
    }

    async findByPlatDuJour() {
        const produits = await this.prisma.produit.findMany({
            where: {
                isPlatDuJour: {
                    not: false
                }
            }
        });
        return produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion?.toNumber(),
            ...produit
        }));
    }

    async findByType(type: string) {
        const Type = await this.prisma.type.findUnique({
            where: {
                name: type
            }
        })
        if (!Type) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        const produits = await this.prisma.produit.findMany({
            where: {
                idType: Type.id
            }
        })

        return produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion?.toNumber(),
            ...produit
        }));
    }

    update(id: number, {ingredientsProduits, ...updateProduitDto}: UpdateProduitDto) {
        if (ingredientsProduits && ingredientsProduits.length > 0) {
            ingredientsProduits.map(async ingredient => {
                await this.prisma.produitIngredient.upsert({
                    where: {
                        idProduit_idIngredient: { idProduit: id, idIngredient: ingredient.idIngredient }
                    },
                    update: {
                        quantity: ingredient.quantity
                    },
                    create: {
                        idProduit: id,
                        ...ingredient
                    }
                })
            })
        }
        return this.prisma.produit.update({
            where: {
                id
            },
            data: {
                ...updateProduitDto
            }
        })
    }

    delete(id: number) {
        return this.prisma.produit.delete({
            where: {
                id
            }
        })
    }


}
