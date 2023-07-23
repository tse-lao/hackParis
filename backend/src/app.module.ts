import { Module } from '@nestjs/common';
import { AsModule } from './airstack/airstack.module';
import { FilesModule } from './files/files.module';
import { FormModule } from './form/form.module';
import { PrivacyModule } from './privacy/privacy.module';
import { UmaModule } from './uma/uma.module';
import { VoteFormModule } from './voteform/voteform.module';

@Module({
  imports: [
    PrivacyModule,
    FormModule,
    FilesModule,
    UmaModule,
    AsModule,
    VoteFormModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
