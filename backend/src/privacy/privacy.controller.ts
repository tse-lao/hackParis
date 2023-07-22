import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { PrivacyService } from './privacy.service';

@Controller('privacy')
export class PrivacyController {
  constructor(private readonly svc: PrivacyService) {}

  @Get('getPrivacyScore')
  async getPrivacyScore(
    @Query('groupid', new ParseArrayPipe({ items: String, separator: ',' }))
    groupid: string[],
  ) {
    console.log(`in get all survey list controller:`);
    return this.svc.getPrivacyScore(groupid);
  }
}
