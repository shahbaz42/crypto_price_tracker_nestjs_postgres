import { CryptoNameEnum, CryptoSymbolEnum } from '@app/common';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('crypto_price_notifications')
@Index('idx_crypto_price_notifications_symbol_price', [
  'symbol',
  'target_usd_price',
])
export class CryptoPriceNotificationsEntity extends BaseEntity {
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
    name: 'target_usd_price',
    type: 'decimal',
    precision: 18,
    scale: 8,
    nullable: false,
  })
  target_usd_price: number;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
  })
  email: string;

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
