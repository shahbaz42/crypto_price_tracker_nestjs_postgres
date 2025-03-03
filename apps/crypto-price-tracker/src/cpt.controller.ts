import { Controller, Get } from '@nestjs/common';
import { CptService } from './cpt.service';

@Controller()
export class CptController {
  constructor(private readonly cptService: CptService) {}

  @Get('/')
  getHello(): string {
    return this.cptService.getHello();
  }
}
