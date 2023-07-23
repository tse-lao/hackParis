import { Controller, Get, Query } from '@nestjs/common';
import { VoteFormService } from './voteform.service';

@Controller('voteform')
export class VoteFormController {
  constructor(private readonly svc: VoteFormService) {}

  @Get('getAllRequestCreated')
  async getAllRequestCreated() {
    console.log(`read all the forms:`);
    return this.svc.getAllRequestCreated();
  }
  @Get('getById')
  async getById(@Query('id') id: number) {
    console.log(`get id:`);
    return this.svc.getById(id);
  }

  @Get('getContributionByRequest')
  async getContributionByRequest() {
    console.log(`read all the forms:`);
    return this.svc.getContributionByRequest();
  }

  @Get('getAssertionsById')
  async getAssertionsById(@Query('id') id: number) {
    console.log(`trying to read the values of ${id}:`);
    return this.svc.getAssertionsById(id);
  }
}
