import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreatePaymentSessionDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentSessionItemDto)
  items: PaymentSessionItemDto[];

  @IsString()
  @IsOptional()
  currency: string = 'usd';

  @IsObject()
  @IsOptional()
  metaData: { orderId?: number };
}

export class PaymentSessionItemDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  quantity: number = 1;

  @IsString()
  @IsOptional()
  description: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  images: string[];
}
