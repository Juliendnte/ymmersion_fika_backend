import {
    BadRequestException,
    Body, Catch,
    Controller,
    Delete,
    Get, HttpException, HttpStatus, InternalServerErrorException, NotFoundException,
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
import {extname, join} from 'path';
import {ERROR} from "src/common/constants/error.constants";
import {HttpExceptionFilter} from "src/common/filters/http-exception.filter";
import {UpdateProduitDto} from "src/module/produit/dto/update-produit.dto";
import * as fs from "fs-extra";

@Controller('produits')
@Catch(HttpExceptionFilter)
export class ProduitController {
    constructor(private readonly produitService: ProduitService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('imagePath', {
            storage: diskStorage({
                destination: './temp',
                filename: (req, imagePath, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(imagePath.originalname));
                },
            }),
        }),
    )
    createProduit(@UploadedFile() imagePath: Express.Multer.File, @Body() createProduitDto: CreateProduitDto, @GetUser() user: User) {
        try {
            return this.produitService.create(createProduitDto, user.uid, imagePath);
        } catch (error) {
            throw new InternalServerErrorException(ERROR.ErrorSystem);
        }
    }

    /*
    @UseInterceptors(
        FileInterceptor('imagePath', {
            storage: diskStorage({
                destination: './temp',
                filename: (req, imagePath, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + extname(imagePath.originalname));
                },
            }),
        }),
    )
    @Post("test")
    async testupload(@UploadedFile() imagePath: Express.Multer.File) {
        const finalPath = join(__dirname, '../../../uploads/produits', imagePath.filename);
        try {
            await fs.move(imagePath.path, finalPath);
            return finalPath;
        } catch (error) {
            throw new Error('File move failed, rolling back entity creation');
        }
    }

     */

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
