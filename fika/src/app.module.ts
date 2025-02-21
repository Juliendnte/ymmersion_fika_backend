import {Module} from '@nestjs/common';
import {ProduitModule} from './module/produit/produit.module';
import {OrderService} from './module/order/order.service';
import {OrderModule} from './module/order/order.module';
import {IngredientService} from './module/ingredient/ingredient.service';
import {IngredientModule} from './module/ingredient/ingredient.module';
import {UserModule} from "src/module/user/user.module";
import {AuthModule} from "src/module/auth/auth.module";
import {ConfigModule} from "@nestjs/config";
import {UploadModule} from './uploads/upload.module';
import configs from "./module/config";
import {SubscriptionModule} from "src/module/subscription/subscription.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configs],
        }), AuthModule, UserModule, ProduitModule, OrderModule, IngredientModule, UploadModule, SubscriptionModule],
    providers: [OrderService, IngredientService,],
    controllers: [],
})
export class AppModule {
}
