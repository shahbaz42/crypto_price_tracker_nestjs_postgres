import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CptHelpers } from './cpt.helpers';
import { LessThanOrEqual, Repository } from 'typeorm';
import { CreateAlertDto, FetchAlertsDto } from './cpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPriceNotificationsEntity } from './entities/crypto.price.notification.entity';
import { logAndHandleAPIError } from '@app/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CryptoPriceEntity } from './entities/crypto.price.entity';

@Injectable()
export class CptService {
  private logger = new Logger(CptService.name);
  constructor(
    @Inject(CptHelpers)
    private readonly cptHelpers: CptHelpers,
    @InjectRepository(CryptoPriceNotificationsEntity)
    private readonly cryptoPriceNotificationsRepository: Repository<CryptoPriceNotificationsEntity>,
  ) {}

  /**
   * Creates an alert based on the provided data.
   *
   * @param createAlertDto - The data for creating the alert.
   * @returns An object containing the status and message indicating the success of the alert creation.
   */
  async createAlert(createAlertDto: CreateAlertDto) {
    try {
      const alert = this.cryptoPriceNotificationsRepository.create({
        ...createAlertDto,
      });

      await this.cryptoPriceNotificationsRepository.save(alert);

      return {
        message: 'Alert created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      logAndHandleAPIError(this.logger, error);
    }
  }

  /**
   * Fetches alerts based on the provided FetchAlertsDto.
   *
   * @param fetchAlertsDto - The data transfer object containing the email for fetching alerts.
   * @returns An object with a message, status, and data properties.
   */
  async fetchAlerts(fetchAlertsDto: FetchAlertsDto) {
    try {
      const alerts = await this.cryptoPriceNotificationsRepository.find({
        where: {
          email: fetchAlertsDto.email,
        },
      });

      return {
        message: 'Alerts fetched successfully',
        status: HttpStatus.OK,
        data: alerts,
      };
    } catch (error) {
      logAndHandleAPIError(this.logger, error);
    }
  }

  /* ------------------ Event Handlers ---------------------------- */

  @OnEvent('target.price.alert')
  /**
   * Handles the target price alert for a given crypto price.
   *
   * @param cryptoPrice - The crypto price entity for which the target price alert is being handled.
   * @returns A promise that resolves when the target price alert is handled.
   * @throws If an error occurs while handling the target price alert.
   */
  async handleTargetPriceAlert(cryptoPrice: CryptoPriceEntity) {
    try {
      // fetch all alerts with the same symbol and taget_price less than the current price
      const alerts = await this.cryptoPriceNotificationsRepository.find({
        where: {
          symbol: cryptoPrice.symbol,
          target_usd_price: LessThanOrEqual(cryptoPrice.usd_price),
        },
      });

      // send email notifications to all the users
      const pArr = alerts.map(async (alert) => {
        return this.cptHelpers.sendEmail({
          to: alert.email,
          subject: 'Crypto Price Alert',
          body: `The price of ${cryptoPrice.name} has reached your target price of $${alert.target_usd_price}. The current price is $${cryptoPrice.usd_price}.`,
        });
      });

      await Promise.allSettled(pArr);

      // delete all the alerts
      await this.cryptoPriceNotificationsRepository.remove(alerts);
    } catch (error) {
      this.logger.error('Error handling target price alert', error);
    }
  }
}
