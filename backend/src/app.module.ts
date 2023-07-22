import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { FormModule } from './form/form.module';
import { PrivacyModule } from './privacy/privacy.module';
import { UmaModule } from './uma/uma.module';

@Module({
  imports: [PrivacyModule, FormModule, FilesModule, UmaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
