import { Module } from '@nestjs/common';
import { ProduitService } from './produit.service';

@Module({
  providers: [ProduitService]
})
export class ProduitModule {}
