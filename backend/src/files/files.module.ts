import { Module } from '@nestjs/common';
import { FormModule } from 'src/form/form.module';
import { FilesController } from './files.controller';
import { FilesServices } from './files.service';

@Module({
  imports: [FormModule],
  controllers: [FilesController],
  providers: [FilesServices],
  exports: [FilesServices],
})
export class FilesModule {}
