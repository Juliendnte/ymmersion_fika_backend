import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {ERROR} from "src/common/constants/error.constants";
import {ProduitEntity} from "src/module/produit/entities/produit.entity";

@Injectable()
export class ProduitService {
    constructor(private prisma: PrismaService) {
    }

    async create({type, category, ...produit}: CreateProduitDto, uidUser: string) {
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

        return this.prisma.produit.create({
            data: {
                name: produit.name,
                description: produit.description,
                price: produit.price,
                isPlatDuJour: produit.isPlatDuJour,
                promotion: produit.promotion ? produit.promotion : null,
                idType: Type.id,
                idCategory: Category.id,
                uidUser
            }
        })
    }

    async findAll(){
        const produits = await this.prisma.produit.findMany();
        return produits.map(produit => new ProduitEntity(produit));
    }

    async findById(id: number) {
        const produit = await this.prisma.produit.findUnique({
            where: {
                id
            }
        })
        if (!produit) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        return produit;
    }

    async findPopular() {
        const produits = await this.prisma.produit.findMany({
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
        return produits.map(produit => new ProduitEntity(produit));
    }

    async findByPromo(){
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
        return produits.map(produit => new ProduitEntity(produit));
    }

    async findByPlatDuJour(){
        const produits = await this.prisma.produit.findMany({
            where: {
                isPlatDuJour: {
                    not: false
                }
            }
        });
        return produits.map(produit => new ProduitEntity(produit));
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

        return produits.map(produit => new ProduitEntity(produit))
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
