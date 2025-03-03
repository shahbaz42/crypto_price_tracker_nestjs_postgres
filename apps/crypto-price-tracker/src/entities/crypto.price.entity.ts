import { CryptoNameEnum, CryptoSymbolEnum } from '@app/common';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crypto_price')
export class CryptoPriceEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    type: 'enum',
    name: 'symbol',
    enum: CryptoSymbolEnum,
    nullable: false,
  })
  symbol: CryptoSymbolEnum;

  @Column({
    type: 'enum',
    name: 'name',
    enum: CryptoNameEnum,
    nullable: false,
  })
  name: CryptoNameEnum;

  @Column({
    name: 'usd_price',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: false,
  })
  usd_price: string;

  @Column({
    name: 'block_timestamp',
    type: 'timestamp',
    nullable: false,
  })
  block_timestamp: Date;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
