import { Controller, Get, Query } from '@nestjs/common';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(private readonly svc: FormService) {}

  @Get('getForms')
  async getAllForms() {
    console.log(`read all the forms:`);
    return this.svc.getAllForms();
  }

  @Get('getFormById')
  async getFormById(@Query('id') id: number) {
    console.log(`get a single form by its id: ${id}`);
    return this.svc.getFormById(id);
  }
  @Get('getFormByCreator')
  async getFormByCreator(@Query('creator') creator: string) {
    console.log(`in get contributions by user controller: ${creator}`);
    return this.svc.getFormByCreator(creator);
  }

  @Get('getContributionsByUser')
  async getContributionsByUser(@Query('contributor') contributor: string) {
    console.log(`in get contributions by user controller: ${contributor}`);
    return this.svc.getContributionsByUser(contributor);
  }
}
