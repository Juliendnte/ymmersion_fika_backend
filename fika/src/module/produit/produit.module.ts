import { Module } from '@nestjs/common';
import { ProduitService } from './produit.service';
import {ProduitController} from "src/module/produit/produit.controller";

@Module({
  controllers: [ProduitController],
  providers: [ProduitService]
})
export class ProduitModule {}
