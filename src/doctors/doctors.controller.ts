import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  createUploadStorage,
  UPLOAD_FOLDER_TOKEN,
} from '../upload/upload.config';
import { UploadService } from '../upload/upload.service';

@Controller('doctors')
export class DoctorsController {
  constructor(
      private readonly doctorsService: DoctorsService,
      private readonly uploadService: UploadService,
      @Inject(UPLOAD_FOLDER_TOKEN) private readonly uploadFolder: string,
  ) {}

  @Post('create')
  @UseInterceptors(
      FilesInterceptor('images', 10, {
        storage: createUploadStorage(process.env.UPLOAD_FOLDER || './uploads'),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
  )
  async create(
      @Body() createDoctorDto: CreateDoctorDto,
      @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      try {
        imageUrls = await this.uploadService.uploadMultipleImages(files);
      } catch (error) {
        // fallback to local
        imageUrls = files
            .map(file =>
                file.filename ? `/uploads/${file.filename}` : null,
            )
            .filter(Boolean) as string[];
      }
    }

    return this.doctorsService.create({
      ...createDoctorDto,
      image: imageUrls,
    });
  }

  @Get('get-all')
  async findAll() {
    return await this.doctorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.doctorsService.findOne(id); // ✅ UUID string
  }

  @Patch(':id')
  @UseInterceptors(
      FilesInterceptor('images', 10, {
        storage: createUploadStorage(process.env.UPLOAD_FOLDER || './uploads'),
        fileFilter: (req, file, cb) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
            return cb(new Error('Only image files are allowed!'), false);
          }
          cb(null, true);
        },
      }),
  )
  async update(
      @Param('id') id: string,
      @Body() updateDoctorDto: UpdateDoctorDto,
      @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      try {
        imageUrls = await this.uploadService.uploadMultipleImages(files);
      } catch (error) {
        // fallback to local
        imageUrls = files
            .map(file =>
                file.filename ? `/uploads/${file.filename}` : null,
            )
            .filter(Boolean) as string[];
      }
    }

    return await this.doctorsService.update(id, {
        ...updateDoctorDto,
        image: imageUrls.length > 0 ? imageUrls : updateDoctorDto.image,
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.doctorsService.remove(id);
  }
}
