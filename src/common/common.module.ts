import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ImageService } from './image.service';

@Module({
  providers: [MailService, ImageService, ImageService],
  exports: [MailService, ImageService, ImageService],
})
export class CommonModule {}
