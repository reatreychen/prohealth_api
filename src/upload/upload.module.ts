import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { UPLOAD_FOLDER_PROVIDER, UPLOAD_FOLDER_TOKEN } from './upload.config';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    UPLOAD_FOLDER_PROVIDER, // Provide upload folder path
  ],
  exports: [
    UploadService, // Export UploadService so other modules can use it
    UPLOAD_FOLDER_TOKEN, // Export upload folder token so other modules can inject it
  ],
})
export class UploadModule {}
