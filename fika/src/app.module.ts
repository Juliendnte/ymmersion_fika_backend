import {Module} from '@nestjs/common';
import {ProduitController} from './module/produit/produit.controller';
import {ProduitModule} from './module/produit/produit.module';
import {OrderService} from './module/order/order.service';
import {OrderController} from './module/order/order.controller';
import {OrderModule} from './module/order/order.module';
import {IngredientService} from './module/ingredient/ingredient.service';
import {IngredientController} from './module/ingredient/ingredient.controller';
import {IngredientModule} from './module/ingredient/ingredient.module';
import {UserModule} from "src/module/user/user.module";
import {AuthModule} from "src/module/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {UploadModule} from './uploads/upload.module';
import {StripeService} from './module/stripe/stripe.service';
import {StripeController} from './module/stripe/stripe.controller';
import {StripeModule} from './module/stripe/stripe.module';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env'
    }), AuthModule, UserModule, ProduitModule, OrderModule, IngredientModule, UploadModule, StripeModule.forRootAsync(),],
    providers: [OrderService, IngredientService, StripeService],
    controllers: [StripeController],
})
export class AppModule {
}
