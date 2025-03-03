import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmModuleOptions from './config/db.config';
import { CptController } from './cpt.controller';
import { CptService } from './cpt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.crypto-price-tracker'],
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions()),
  ],
  controllers: [CptController],
  providers: [CptService],
})
export class CptModule {}
