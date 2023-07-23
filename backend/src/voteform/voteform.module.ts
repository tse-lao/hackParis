import { Global, Module } from '@nestjs/common';
import { UmaModule } from 'src/uma/uma.module';
import { VoteFormController } from './voteform.controller';
import { VoteFormService } from './voteform.service';

@Global()
@Module({
  imports: [UmaModule],
  providers: [VoteFormService],
  controllers: [VoteFormController],
  exports: [VoteFormService],
})
export class VoteFormModule {}
