import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UPLOAD_FOLDER_TOKEN, createUploadStorage } from './upload.config';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    @Inject(UPLOAD_FOLDER_TOKEN) private readonly uploadFolder: string,
  ) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: createUploadStorage(
        process.env.UPLOAD_FOLDER || './uploads',
      ),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.uploadService.uploadImage(file);
  }
}
