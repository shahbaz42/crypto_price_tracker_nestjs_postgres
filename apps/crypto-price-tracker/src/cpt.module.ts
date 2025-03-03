import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmModuleOptions from './config/db.config';
import { CptController } from './cpt.controller';
import { CptService } from './cpt.service';
import { CptHelpers } from './cpt.helpers';
import { CryptoPriceEntity } from './entities/crypto.price.entity';
import { CptCronService } from './cpt.cron.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.crypto-price-tracker'],
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions()),
    TypeOrmModule.forFeature([CryptoPriceEntity]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CptController],
  providers: [CptService, CptHelpers, CptCronService],
})
export class CptModule {}
