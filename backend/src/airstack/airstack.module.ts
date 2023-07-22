import { Global, Module } from '@nestjs/common';
import { AsController } from './airstack.controller';
import { AsService } from './airstack.service';

@Global()
@Module({
  providers: [AsService],
  controllers: [AsController],
  exports: [AsService]
})
export class AsModule {}
