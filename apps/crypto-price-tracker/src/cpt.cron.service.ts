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
      const cryptoPrices = await Promise.allSettled([
        this.cptHelpers.saveEthPrice(),
        this.cptHelpers.saveBtcPrice(),
        this.cptHelpers.saveSolPrice(),
      ]);

      // send price target notifications
      if (cryptoPrices[0].status === 'fulfilled')
        this.eventEmitter.emit('target.price.alert', cryptoPrices[0].value);

      if (cryptoPrices[1].status === 'fulfilled')
        this.eventEmitter.emit('target.price.alert', cryptoPrices[1].value);

      if (cryptoPrices[2].status === 'fulfilled')
        this.eventEmitter.emit('target.price.alert', cryptoPrices[2].value);

      // send surge alert to admin only for ETH
      if (cryptoPrices[0].status === 'fulfilled')
        this.eventEmitter.emit('price.surge.alert', cryptoPrices[0].value);
    } catch (error) {
      this.logger.error('Error syncing prices', error);
    }
  }
}
