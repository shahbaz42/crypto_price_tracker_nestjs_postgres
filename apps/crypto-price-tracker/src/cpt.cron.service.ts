import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CptHelpers } from './cpt.helpers';

@Injectable()
export class CptCronService {
  private logger = new Logger(CptCronService.name);
  constructor(private readonly cptHelpers: CptHelpers) {}

  @Interval(1000)
  async handleInterval1s() {
    try {
      await this.cptHelpers.saveEthPrice();
    } catch (error) {
      this.logger.error('Error syncing ETH price', error);
    }
  }
}
