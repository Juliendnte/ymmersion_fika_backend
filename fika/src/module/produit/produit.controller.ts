import {Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards} from '@nestjs/common';
import {ProduitService} from "src/module/produit/produit.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {JwtAuthGuard} from "src/module/auth/strategy/jwt-auth.guards";
import {GetUser} from "src/common/decorators/get-user.decorator";
import {User} from "@prisma/client";

@Controller('produit')
export class ProduitController {
    constructor(private readonly produitService: ProduitService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    createProduit(@Body() createProduitDto: CreateProduitDto, @GetUser() user: User) {
        return this.produitService.create(createProduitDto, user.uid)
    }

    @Get()
    getProduits(){

    }

    @Get('/promo')
    getProduitPromo(){

    }

    @Get('platDuJour')
    getProduitPlatDuJour(){

    }


    @Get(':param')
    getProduitType(@Param('param') param: string) {
        if (!isNaN(+param)) {
            const id = parseInt(param, 10);
            return this.produitService.findById(id);
        } else {
            return this.produitService.findByType(param);
        }

    }
}
