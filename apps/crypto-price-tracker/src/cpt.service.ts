import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CptHelpers } from './cpt.helpers';
import { DataSource } from 'typeorm';

@Injectable()
export class CptService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(CptHelpers)
    private readonly appNotificationsHelpers: CptHelpers,
  ) {}

  async onModuleInit() {
    console.log('Loaded entities:', this.dataSource.entityMetadatas.map(e => e.name));
  }

  getHello() {
    return this.appNotificationsHelpers.fetchEthPrice();
  }
}
