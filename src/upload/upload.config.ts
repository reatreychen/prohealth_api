import { diskStorage } from 'multer';
import { extname } from 'path';

export const UPLOAD_FOLDER_TOKEN = 'UPLOAD_FOLDER';

export const UPLOAD_FOLDER_PROVIDER = {
  provide: UPLOAD_FOLDER_TOKEN,
  useValue: process.env.UPLOAD_FOLDER || './uploads',
};

/**
 * Creates multer disk storage configuration with the specified upload folder
 */
export function createUploadStorage(uploadFolder: string) {
  return diskStorage({
    destination: uploadFolder,
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueName + extname(file.originalname));
    },
  });
}

