import { Controller, Get, Query } from '@nestjs/common';
import { UmaService } from './uma.service';

@Controller('uma')
export class UmaController {
  constructor(private readonly svc: UmaService) {}

  @Get('getAssertions')
  async getAssertions() {
    console.log(`get the first 20 assertions :`);
    return this.svc.getAssertions();
  }
  @Get('getDisputes')
  async getDisputes() {
    console.log(`get the first 20 dipsutes :`);
    return this.svc.getDisputes();
  }
  @Get('getAssertionSettled')
  async getAssertionSettled() {
    console.log(`get the first 20 assertions :`);
    return this.svc.getAssertionSettled();
  }
  
  @Get('getAssertionById')
  async getAssertionById(@Query('id') id: string) {
    console.log(`in get survey by id controller: ${id}`);
    return this.svc.getAssertionById(id);
  }


}
    