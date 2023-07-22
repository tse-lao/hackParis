import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { FormModule } from './form/form.module';
import { PrivacyModule } from './privacy/privacy.module';

@Module({
  imports: [PrivacyModule, FormModule, FilesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
