import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {ERROR} from "src/common/constants/error.constants";
import {ProduitEntity} from "src/module/produit/entities/produit.entity";
import * as fs from 'fs-extra';
import {join} from 'path';
import {IngredientEntity} from "src/module/ingredient/entities/ingredient.entity";

@Injectable()
export class ProduitService {
    constructor(private prisma: PrismaService) {
    }

    async create({
                     type,
                     category,
                     ingredientsProduits,
                     ...produit
                 }: CreateProduitDto, uidUser: string, file: Express.Multer.File) {
        const finalPath = join(__dirname, '../../../uploads', file.filename);
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
                    imagePath: '/uploads' + file.filename,
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
        const produits = await this.prisma.produit.findMany();
        return produits.map(({price, promotion, ...produit}) => new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion ? promotion.toNumber() : null,
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
                }
            }
        })

        if (!produit) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        const {price, promotion, Produit_Ingredient, ...product} = produit;
        const ingredients = Produit_Ingredient.map(({Ingredient}) => new IngredientEntity({
            name: Ingredient.name,
            quantity: Ingredient.quantity,
            unit: Ingredient.unit,
        }));

        return new ProduitEntity({
            price: price.toNumber(),
            promotion: promotion ? promotion.toNumber() : null,
            ingredients,
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
            promotion: promotion ? promotion.toNumber() : null,
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
            promotion: promotion ? promotion.toNumber() : null,
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
            promotion: promotion ? promotion.toNumber() : null,
            ...produit
        }));
    }

    update(id: number, updateProduitDto: CreateProduitDto) {
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
