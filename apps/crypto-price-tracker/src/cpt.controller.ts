import { Controller, Get, HttpStatus } from '@nestjs/common';
import { CptService } from './cpt.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Crypto Price Tracker')
export class CptController {
  constructor(private readonly cptService: CptService) {}

  @Get('/')
  @ApiOperation({ summary: 'Test Email Sending' })
  @ApiResponse({
    description: 'Email sent successfully',
    status: HttpStatus.OK,
  })
  getHello() {
    return this.cptService.getHello();
  }
}
