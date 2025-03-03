import { Inject, Injectable } from '@nestjs/common';
import { CptHelpers } from './cpt.helpers';
import { DataSource } from 'typeorm';

@Injectable()
export class CptService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(CptHelpers)
    private readonly appNotificationsHelpers: CptHelpers,
  ) {}

  async getHello() {
    await this.appNotificationsHelpers.sendEmail({
      to: 'shahbaz_ali@outlook.in',
      subject: 'Test Email',
      body: 'This is a test email',
    });

    return 'Mail Sent';
  }
}
