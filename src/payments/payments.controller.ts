import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('create-payment-session')
  @MessagePattern({ cmd: 'create.payment.session' })
  createPaymentSession(@Payload() createPaymentSessionDto: any) {
    return this.paymentsService.createPaymentSession({
      ...createPaymentSessionDto,
      metaData: { orderId: createPaymentSessionDto.orderId },
    });
  }

  @Get('success')
  success() {
    return {
      status: 200,
      message: 'Create payment session successfully created',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      status: 'success',
      message: 'Payment session cancelled',
    };
  }

  @Post('webhook')
  stripeWebhook(@Req() req, @Res() res) {
    console.log('stripeWebhook called');

    return this.paymentsService.webhook(req, res);
  }
}
