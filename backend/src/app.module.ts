import { Module } from '@nestjs/common';
import { FilesModule } from './files/files.module';
import { FormModule } from './form/form.module';
import { PrivacyModule } from './privacy/privacy.module';
import { UmaModule } from './uma/uma.module';
import {AsModule} from "./airstack/airstack.module"

@Module({
  imports: [PrivacyModule, FormModule, FilesModule, UmaModule, AsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
