import {Injectable} from '@nestjs/common';
import {InjectStripeClient} from '@golevelup/nestjs-stripe';
import Stripe from "stripe";

@Injectable()
export class SubscriptionService {
    constructor(@InjectStripeClient() private stripe: Stripe) {
    }

    async createPaymentIntent(amount: number, currency: string, paymentMethodId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount,
                currency,
                payment_method: paymentMethodId,
                confirmation_method: 'automatic',
                confirm: true,
            });

            return { success: true, paymentIntent };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}
