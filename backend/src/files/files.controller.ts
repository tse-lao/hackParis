import { Body, Controller, Headers, Post } from '@nestjs/common';
import { FilesServices } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly svc: FilesServices) {}

  @Post('uploadContribution')
  async uploadContribution(
    @Headers('authorization') jwt: string,
    @Body('address') address: string,
    @Body('json') json: string,
    @Body('apiKey') apiKey: string,
    @Body('tokenID') tokenID: number,
  ) {
    console.log('Start uploaded the file to IPFS with lighthouse...');
    console.log(json, jwt, address, apiKey, tokenID);
    return this.svc.uploadContribution(json, jwt, address, apiKey, tokenID);
  }
}
