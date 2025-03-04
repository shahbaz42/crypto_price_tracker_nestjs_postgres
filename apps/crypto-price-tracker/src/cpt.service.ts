import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CptHelpers } from './cpt.helpers';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  CreateAlertDto,
  FetchAlertsDto,
  FetchLast24hPricesDto,
} from './cpt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPriceNotificationsEntity } from './entities/crypto.price.notification.entity';
import { addOrdering, addPagination, logAndHandleAPIError } from '@app/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CryptoPriceEntity } from './entities/crypto.price.entity';
import { interval } from 'rxjs';

@Injectable()
export class CptService {
  private logger = new Logger(CptService.name);
  constructor(
    @Inject(CptHelpers)
    private readonly cptHelpers: CptHelpers,
    @InjectRepository(CryptoPriceNotificationsEntity)
    private readonly cryptoPriceNotificationsRepository: Repository<CryptoPriceNotificationsEntity>,
    @InjectRepository(CryptoPriceEntity)
    private readonly cryptoPriceRepository: Repository<CryptoPriceEntity>,
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
      const { email, limit, skip, order, order_by } = fetchAlertsDto;

      const query = this.cryptoPriceNotificationsRepository.createQueryBuilder(
        'crypto_price_notifications',
      );
      query.where('crypto_price_notifications.email = :email', {
        email: email,
      });

      addPagination(query, limit, skip);
      addOrdering(query, order_by, order);

      const [alerts, count] = await query.getManyAndCount();

      return {
        message: 'Alerts fetched successfully',
        status: HttpStatus.OK,
        data: alerts,
        count,
      };
    } catch (error) {
      logAndHandleAPIError(this.logger, error);
    }
  }

  /**
   * Fetches the last 24-hour prices hourly.
   *
   * @param fetchLast24hPricesDto - The data transfer object containing the symbol.
   * @returns An object with timestamp and usd_price for the last 24 hours.
   * Note: If there is no price record in an interval, we return null for that hour.
   * The prices returned are the closing prices for each hour i.e. price with maximum block_timestamp in the interval.
   */
  async fetchLast24hPricesHourly(fetchLast24hPricesDto: FetchLast24hPricesDto) {
    try {
      const { symbol } = fetchLast24hPricesDto;

      const query =
        this.cryptoPriceRepository.createQueryBuilder('crypto_price');
      query.where('crypto_price.symbol = :symbol', { symbol });

      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);

      console.log(yesterday);

      query.andWhere('crypto_price.block_timestamp >= :yesterday', {
        yesterday,
      });

      query.orderBy('crypto_price.block_timestamp', 'DESC');

      const prices = await query.getMany();

      const hourlyPrices = [];

      // Loop over 24 hours from the starting time (yesterday) up to now.
      for (let i = 0; i < 24; i++) {
        const intervalStart = new Date(
          yesterday.getTime() + i * 60 * 60 * 1000,
        );
        const intervalEnd = new Date(
          yesterday.getTime() + (i + 1) * 60 * 60 * 1000,
        );

        // Find all price records that fall within the current interval.
        const records = prices.filter((price) => {
          const priceTime = new Date(price.block_timestamp);
          return priceTime >= intervalStart && priceTime < intervalEnd;
        });

        // Determine the closing price as the one with the maximum block_timestamp in the interval.
        let closingPrice: number | null = null;
        if (records.length > 0) {
          const closingRecord = records.reduce((prev, curr) => {
            return new Date(prev.block_timestamp) >
              new Date(curr.block_timestamp)
              ? prev
              : curr;
          });
          closingPrice = closingRecord.usd_price;
        }

        // Using intervalEnd as the timestamp marker for the interval.
        hourlyPrices.push({
          timestamp: intervalEnd,
          usd_price: closingPrice,
        });
      }

      return {
        message: 'Prices fetched successfully',
        status: HttpStatus.OK,
        data: {
          symbol,
          start: yesterday,
          end: now,
          interval: 'hourly',
          prices: hourlyPrices,
        },
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
