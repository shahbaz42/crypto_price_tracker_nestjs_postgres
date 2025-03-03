import { ApiProperty } from '@nestjs/swagger';
import { CryptoSymbolEnum, PaginationAndOrderDTO } from '@app/common';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlertDto {
  @ApiProperty({
    description: 'Cryptocurrency symbol',
    enum: Object.values(CryptoSymbolEnum),
    example: 'ETH',
  })
  @IsEnum(CryptoSymbolEnum)
  @IsNotEmpty()
  symbol: CryptoSymbolEnum;

  @ApiProperty({
    description: 'Target price in USD for the alert',
    type: Number,
    example: 50000.75,
  })
  @IsNotEmpty()
  @IsNumber()
  target_usd_price: number;

  @ApiProperty({
    description: 'User email to receive the alert',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class FetchAlertsDto extends PaginationAndOrderDTO {
  // email
  @ApiProperty({
    description: 'User email to fetch alerts',
    type: String,
    required: true,
    example: 'abc@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
