import { Global, Module } from '@nestjs/common';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Global()
@Module({
  providers: [FormService],
  controllers: [FormController],
  exports: [FormService],
})
export class FormModule {}
