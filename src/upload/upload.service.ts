import { BadRequestException, Injectable } from '@nestjs/common';
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'nest_uploads',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }
}
