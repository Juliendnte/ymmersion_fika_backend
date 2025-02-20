import {Body, Controller, Post, } from '@nestjs/common';

import {SubscriptionService} from './subscription.service';

@Controller('subscriptions')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {
    }

    @Post('pay')
    async pay(@Body() body: any) {
        const {amount, currency, paymentMethodId} = body;
        return this.subscriptionService.createPaymentIntent(amount, currency, paymentMethodId);
    }
}
