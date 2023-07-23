import { Controller, Get, Query } from '@nestjs/common';
import { AsService } from './airstack.service';

@Controller('airstack')
export class AsController {
  constructor(private readonly svc: AsService) {}

  @Get('hasXMTP')
  async hasXMTP(@Query('address') address: string) {
    console.log(`Checking if there is an dadres`);
    return this.svc.hasXMTP(address);
  }
 


}
    