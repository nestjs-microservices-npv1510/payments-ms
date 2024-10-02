import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentSessionDto } from './dtos/create-payment-session.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('create-payment-session')
  @MessagePattern('payments.createSession')
  createPaymentSession(
    @Payload() createPaymentSessionDto: CreatePaymentSessionDto,
  ) {
    // console.log('createPaymentSessionDto');
    const { metadata, ...dto } = createPaymentSessionDto;
    // return dto;

    return this.paymentsService.createPaymentSession(dto);
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
    // console.log('stripeWebhook called');

    return this.paymentsService.webhook(req, res);
  }
}
