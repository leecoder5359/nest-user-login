import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('process.env.DATABASE_HOST', process.env.DATABASE_HOST)
    return process.env.DATABASE_HOST;
  }
}
