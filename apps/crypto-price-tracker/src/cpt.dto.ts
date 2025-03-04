import { ApiProperty } from '@nestjs/swagger';
import { CryptoSymbolEnum, PaginationAndOrderDTO } from '@app/common';
import { IsEmail, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { HttpStatus } from '@nestjs/common';

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

export class FetchLast24hPricesDto {
  @ApiProperty({
    description: 'Cryptocurrency symbol',
    enum: Object.values(CryptoSymbolEnum),
    example: 'ETH',
  })
  @IsEnum(CryptoSymbolEnum)
  @IsNotEmpty()
  symbol: CryptoSymbolEnum;
}

export class HourlyPrice {
  @ApiProperty({
    description: 'Timestamp marking the end of the hourly interval',
    type: Date,
  })
  timestamp: Date;

  @ApiProperty({
    description: 'Closing USD price for the interval',
    type: Number,
    nullable: true,
  })
  usd_price: number | null;
}

// Define schema for the response data
export class Last24hPricesResponseData {
  @ApiProperty({ description: 'The cryptocurrency symbol', example: 'ETH' })
  symbol: string;

  @ApiProperty({
    description: 'Start timestamp for the 24-hour period',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    description: 'End timestamp for the 24-hour period',
    type: Date,
  })
  end: Date;

  @ApiProperty({ description: 'Interval type', example: 'hourly' })
  interval: string;

  @ApiProperty({
    description: 'Array of hourly price records',
    type: [HourlyPrice],
  })
  prices: HourlyPrice[];
}

// Define the complete response schema
export class Last24hPricesResponse {
  @ApiProperty({
    description: 'Response message',
    example: 'Prices fetched successfully',
  })
  message: string;

  @ApiProperty({ description: 'HTTP status code', example: HttpStatus.OK })
  status: number;

  @ApiProperty({
    description: 'Response data containing price details',
    type: Last24hPricesResponseData,
  })
  data: Last24hPricesResponseData;
}

export class SimulateCyptoPriceDto {
  @ApiProperty({
    description: 'Cryptocurrency symbol',
    enum: Object.values(CryptoSymbolEnum),
    example: 'ETH',
  })
  @IsEnum(CryptoSymbolEnum)
  @IsNotEmpty()
  symbol: CryptoSymbolEnum;

  @ApiProperty({
    description: 'Current price in USD',
    type: Number,
    example: 2500.75,
  })
  @IsNotEmpty()
  @IsNumber()
  usd_price: number;
}

export class GetSwapRateDto {
  @ApiProperty({
    description: 'Amount of Ethereum to swap',
    example: 1,
  })
  @IsNotEmpty()
  eth_amount: number;
}

export class SwapRateResponse {
  @ApiProperty({
    description: 'Amount of BTC that can be obtained for the given ETH amount after fee deduction',
    example: 0.05,
  })
  btc_amount: number;

  @ApiProperty({
    description: 'Fee charged in ETH',
    example: 0.03,
  })
  fee_eth: number;

  @ApiProperty({
    description: 'Fee charged in USD',
    example: 60,
  })
  fee_usd: number;
}
