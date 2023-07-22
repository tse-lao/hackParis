import { Module } from '@nestjs/common';
import { PrivacyModule } from './privacy/privacy.module';

@Module({
  imports: [PrivacyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
