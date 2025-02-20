import {
    BadRequestException,
    Body, Catch,
    Controller,
    Delete,
    Get, HttpException, HttpStatus, NotFoundException,
    Param, ParseIntPipe,
    Patch,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ProduitService} from "src/module/produit/produit.service";
import {CreateProduitDto} from "src/module/produit/dto/create-produit.dto";
import {JwtAuthGuard} from "src/module/auth/strategy/jwt-auth.guards";
import {GetUser} from "src/common/decorators/get-user.decorator";
import {User} from "@prisma/client";
import {diskStorage} from 'multer';
import {FileInterceptor} from "@nestjs/platform-express";
import {extname} from 'path';
import {ERROR} from "src/common/constants/error.constants";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {UpdateProduitDto} from "src/module/produit/dto/update-produit.dto";

@Controller('produits')
@Catch(HttpExceptionFilter)
export class ProduitController {
    constructor(private readonly produitService: ProduitService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(file.originalname));
                },
            }),
        }),
    )
    async createProduit(@UploadedFile() file: Express.Multer.File, @Body() createProduitDto: CreateProduitDto, @GetUser() user: User) {
        if (!file) {
            throw new NotFoundException(ERROR.InvalidInputFormat);
        }
        try {
            const entity = await this.produitService.create(createProduitDto, user.uid, file);
            return {message: 'File uploaded and produit created', entity};
        } catch (error) {
            throw new BadRequestException(ERROR.ErrorSystem);
        }
    }

    @Get()
    getProduits() {
        return this.produitService.findAll()
    }

    @Get('promo')
    getProduitPromo() {
        return this.produitService.findByPromo()
    }

    @Get('platDuJour')
    getProduitPlatDuJour() {
        return this.produitService.findByPlatDuJour()
    }

    @Get('popular')
    getProduitPopular() {
        return this.produitService.findPopular()
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

    @Patch(':id')
    updateProduit(@Param('id', ParseIntPipe) id: number, @Body() updateProduitDto: UpdateProduitDto) {
        return this.produitService.update(id, updateProduitDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async deleteProduit(@Param('id', ParseIntPipe) id: number) {
        await this.produitService.delete(id);
    }
}
