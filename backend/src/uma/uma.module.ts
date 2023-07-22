import { Global, Module } from '@nestjs/common';
import { UmaController } from './uma.controller';
import { UmaService } from './uma.service';

@Global()
@Module({
  providers: [UmaService],
  controllers: [UmaController],
  exports: [UmaService]
})
export class UmaModule {}
