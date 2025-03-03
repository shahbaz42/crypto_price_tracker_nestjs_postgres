import { Injectable } from '@nestjs/common';

@Injectable()
export class CptService {
  getHello(): string {
    return 'Hello World!';
  }
}
