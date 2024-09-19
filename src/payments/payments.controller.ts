import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  createPaymentSession(
    @Body() createPaymentSessionDto: CreatePaymentSessionDto,
  ) {
    // return createPaymentSessionDto;
    return this.paymentsService.createPaymentSession(createPaymentSessionDto);
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
