import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Injectable, Logger } from '@nestjs/common';
import { CryptoNameEnum, CryptoSymbolEnum } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPriceEntity } from './entities/crypto.price.entity';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';

@Injectable()
export class CptHelpers {
  private logger = new Logger(CptHelpers.name);
  private transporter: nodemailer.Transporter;
  constructor(
    @InjectRepository(CryptoPriceEntity)
    private readonly cryptoPriceRepository: Repository<CryptoPriceEntity>,
  ) {
    this.initMoralis();
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Initializes the Moralis SDK.
   *
   * @returns {Promise<void>} A promise that resolves when Moralis is successfully initialized.
   * @throws {Error} If there is an error initializing Moralis.
   */
  private async initMoralis() {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.MORALIS_API_KEY,
        });
        this.logger.log('Moralis initialized successfully');
      }
    } catch (error) {
      this.logger.error('Error initializing Moralis', error);
    }
  }

  /**
   * Fetches the price of Ethereum (ETH) token.
   *
   * @returns A promise that resolves to the price of Ethereum token.
   * @throws If there is an error while fetching the price.
   */
  private async fetchEthPrice() {
    try {
      const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
      const chain = EvmChain.ETHEREUM; // Ethereum Mainnet

      const response = await Moralis.EvmApi.token.getTokenPrice({
        address,
        chain,
      });

      return response;
    } catch (error) {
      this.logger.error('Error fetching ETH price', error);
    }
  }

  /**
   * Saves the ETH price to the database.
   *
   * @returns The saved crypto price object.
   */
  async saveEthPrice() {
    try {
      const response = (await this.fetchEthPrice()) as any;
      const ethPrice = response.jsonResponse;

      const cryptoPrice = this.cryptoPriceRepository.create({
        symbol: CryptoSymbolEnum.ETH,
        name: CryptoNameEnum.ETHER,
        usd_price: ethPrice.usdPrice,
        block_timestamp: new Date(Number(ethPrice.blockTimestamp)),
      });

      await this.cryptoPriceRepository.save(cryptoPrice);

      return cryptoPrice;
    } catch (error) {
      this.logger.error('Error saving ETH price', error);
    }
  }

  /**
   * Sends an email with the specified recipient, subject, and body.
   *
   * @param {Object} options - The email options.
   * @param {string} options.to - The recipient's email address.
   * @param {string} options.subject - The email subject.
   * @param {string} options.body - The email body.
   * @returns {Promise<void>} - A promise that resolves when the email is sent successfully.
   */
  async sendEmail({ to, subject, body }) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text: body,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Error sending email', error);
    }
  }
}
