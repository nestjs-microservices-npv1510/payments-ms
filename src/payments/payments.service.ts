import { BadRequestException, Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

import * as config from '../config';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { isInstance } from 'class-validator';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(config.envs.STRIPE_SECRET_KEY);
  async createPaymentSession(createPaymentSessionDto: CreatePaymentSessionDto) {
    try {
      // console.log(createPaymentSessionDto);
      // return createPaymentSessionDto;

      const lineItems = createPaymentSessionDto.items.map((item) => {
        return {
          price_data: {
            currency: createPaymentSessionDto.currency,
            product_data: {
              name: item.name,
              images: item.images,
              description: item.description,
            },
            unit_amount: item.price * 100, // 10 dollars
          },
          quantity: item.quantity,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        payment_intent_data: {
          metadata: createPaymentSessionDto.metaData,
        },

        success_url: config.envs.STRIPE_SESSION_SUCCESS_URL,
        cancel_url: config.envs.STRIPE_SESSION_CANCEL_URL,
      });
      return session;
    } catch (err) {
      // console.log(err.code);
      // console.log(err.message);
      // console.log(Object(err));

      // console.log(err.code === 'StripeInvalidRequestError');
      // console.log(err.type);
      // console.log(err.param);
      // console.log(err.statusCode);
      console.log(err);

      if (err.type === 'StripeInvalidRequestError') {
        const itemIndex = err.param.match(/\[(\d+)\]/); // Tìm số bên trong []
        const errField = err.param.match(/\[([a-zA-Z_]+)\]/g); // Tìm tất cả các từ bên trong []

        const itemNumber = itemIndex ? itemIndex[1] : 'unknown'; // Lấy group 1 từ kết quả match
        const field = errField
          ? errField[errField.length - 1].replace(/\[|\]/g, '')
          : 'unknown'; // Lấy field cuối cùng, loại bỏ dấu []

        const errMsg = `Error at item #${itemNumber}: ${field} is invalid`;
        throw new BadRequestException(errMsg);
      }
    }
  }

  async webhook(req: Request, res: Response) {
    const endpointSecret = config.envs.STRIPE_WEBHOOK_SECRET_KEY;
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;
    let orderId: number;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );

      switch (event.type) {
        case 'charge.succeeded':
          // HANDLE HERE ...
          // console.log(event);
          const { metadata } = event.data.object;
          orderId = +metadata?.orderId;
          console.log(orderId);

          break;
        default:
          console.log(`${event.type} is not handled !`);
      }
    } catch (err) {
      return res
        .status(500)
        .json({ status: 'error', message: `Webhook error: ${err.message}` });
    }
  }
}
