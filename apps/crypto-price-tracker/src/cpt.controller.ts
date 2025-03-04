import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CptService } from './cpt.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateAlertDto,
  FetchAlertsDto,
  FetchLast24hPricesDto,
  GetSwapRateDto,
  Last24hPricesResponse,
  SimulateCyptoPriceDto,
  SwapRateResponse,
} from './cpt.dto';

@Controller()
@ApiTags('Crypto Price Tracker')
export class CptController {
  constructor(private readonly cptService: CptService) {}

  @Post('/alert')
  @ApiOperation({ summary: 'Create a new alert' })
  @ApiResponse({
    description: 'Alert created successfully',
    status: HttpStatus.CREATED,
  })
  @ApiResponse({
    description: 'Bad Request',
    status: HttpStatus.BAD_REQUEST,
  })
  createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.cptService.createAlert(createAlertDto);
  }

  @Get('/alert')
  @ApiOperation({ summary: 'Fetch all alerts using email' })
  @ApiResponse({
    description: 'Alerts fetched successfully',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Bad Request',
    status: HttpStatus.BAD_REQUEST,
  })
  fetchAlerts(@Query() fetchAlertsDto: FetchAlertsDto) {
    return this.cptService.fetchAlerts(fetchAlertsDto);
  }

  @Post('/test-alerts')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({
    description: 'Test successful',
    status: HttpStatus.OK,
  })
  @ApiResponse({
    description: 'Bad Request',
    status: HttpStatus.BAD_REQUEST,
  })
  test(@Body() simulateCyptoPriceDto: SimulateCyptoPriceDto) {
    return this.cptService.testAlerts(simulateCyptoPriceDto);
  }

  @Get('/last-24h-price')
  @ApiOperation({ summary: 'Fetch last 24h prices' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Last 24h prices fetched successfully',
    type: Last24hPricesResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  fetchLast24hPrices(@Query() fetchLast24hPricesDto: FetchLast24hPricesDto) {
    return this.cptService.fetchLast24hPricesHourly(fetchLast24hPricesDto);
  }

  @Get('/swap/rate')
  @ApiOperation({ summary: 'Get swap rate from ETH to BTC' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Swap rate calculated successfully',
    type: SwapRateResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  getSwapRate(@Query() dto: GetSwapRateDto): Promise<SwapRateResponse> {
    return this.cptService.getSwapRate(dto);
  }
}
