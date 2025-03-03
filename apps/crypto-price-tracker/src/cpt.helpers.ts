import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';
import { Injectable, Logger } from '@nestjs/common';
import { CryptoNameEnum, CryptoSymbolEnum } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoPriceEntity } from './entities/crypto.price.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CptHelpers {
  private logger = new Logger(CptHelpers.name);
  constructor(
    @InjectRepository(CryptoPriceEntity)
    private readonly cryptoPriceRepository: Repository<CryptoPriceEntity>,
  ) {
    this.initMoralis();
  }

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

  async fetchEthPrice() {
    // make it private later
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
    } catch (error) {
      this.logger.error('Error saving ETH price', error);
    }
  }
}
