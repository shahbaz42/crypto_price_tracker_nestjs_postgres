import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { CptService } from './cpt.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateAlertDto, FetchAlertsDto } from './cpt.dto';

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
}
