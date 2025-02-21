import {Module} from '@nestjs/common';
import {SubscriptionController} from "src/module/subscription/subscription.controller";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {SubscriptionService} from "src/module/subscription/subscription.service";
import { StripeModule } from '@golevelup/nestjs-stripe';

@Module({
    imports: [
        ConfigModule,
        StripeModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const apiKey = configService.get<string>('STRIPE_SECRET_KEY');
                if (!apiKey) {
                    throw new Error('STRIPE_SECRET_KEY is not defined in the environment variables');
                }
                return {
                    apiKey,
                    apiVersion: "2025-01-27.acacia",
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [SubscriptionController],
    providers: [SubscriptionService],
    exports: [SubscriptionService],
})
export class SubscriptionModule {
}
