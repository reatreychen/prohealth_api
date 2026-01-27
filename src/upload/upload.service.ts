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

  async uploadMultipleImages(files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      return [];
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.warn('Cloudinary configuration is missing. Returning local file paths instead.');
      // Return local file paths as fallback
      return files
        .map((file) => (file.filename ? `/uploads/${file.filename}` : null))
        .filter((path) => path !== null) as string[];
    }

    const uploadPromises = files.map((file) => {
      if (!file.path) {
        console.warn(`File path is missing for file: ${file.originalname}`);
        return null;
      }
      return cloudinary.uploader.upload(file.path, {
        folder: 'nest_uploads',
      }).catch((error) => {
        console.error(`Failed to upload ${file.originalname}:`, error.message);
        // Return local path as fallback
        return file.filename ? { secure_url: `/uploads/${file.filename}` } : null;
      });
    });

    const results = await Promise.all(uploadPromises);

    return results
      .filter((result) => result !== null)
      .map((result) => result!.secure_url);
  }
}
