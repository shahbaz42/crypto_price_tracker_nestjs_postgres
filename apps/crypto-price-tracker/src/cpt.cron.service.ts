import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CptHelpers } from './cpt.helpers';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CptCronService {
  private logger = new Logger(CptCronService.name);
  constructor(
    private readonly cptHelpers: CptHelpers,
    private eventEmitter: EventEmitter2,
  ) {}

  @Interval(300000) // Every 5 minutes
  async handleInterval1s() {
    try {
      const cryptoPrice = await this.cptHelpers.saveEthPrice();

      // send price target notifications
      this.eventEmitter.emit('target.price.alert', cryptoPrice);

      // To-do: send price surge alert
    } catch (error) {
      this.logger.error('Error syncing ETH price', error);
    }
  }
}
