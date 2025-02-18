import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from "src/prisma/prisma.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {ERROR} from "src/common/constants/error.constants";

@Injectable()
export class ProduitService {
    constructor(private prisma: PrismaService) {
    }

    async create({type, category, ...produit}: CreateProduitDto,
                 uidUser: string) {
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

    findById(id: number) {
        const produit = this.prisma.produit.findUnique({
            where: {
                id
            }
        })
        if (!produit) {
            throw new NotFoundException(ERROR.ResourceNotFound);
        }
        return produit;
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
        const produit = this.prisma.produit.findMany({
            where: {
                idType: Type.id
            }
        })

        return produit;
    }
}
