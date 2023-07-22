import { Module } from '@nestjs/common';
import { PrivacyModule } from './privacy/privacy.module';
import {FormModule} from './form/form.module';

@Module({
  imports: [PrivacyModule, FormModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
