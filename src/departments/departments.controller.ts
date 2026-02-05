import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Inject } from '@nestjs/common';
import { Public } from '../shared/decorators/public.decorator';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { createUploadStorage, UPLOAD_FOLDER_TOKEN } from '../upload/upload.config';

@Controller('departments')
export class DepartmentsController {
  constructor(
    private readonly departmentsService: DepartmentsService,
    private readonly uploadService: UploadService,
  ) { }

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
    @Body() dto: CreateDepartmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        try {
          imageUrls = await this.uploadService.uploadMultipleImages(files);
        } catch (error) {
          imageUrls = files.map(file => `/uploads/${file.filename}`);
        }
      }

      const departmentData = {
        ...dto,
        image: imageUrls.length > 0 ? imageUrls : (dto.image || []),
      };

      return await this.departmentsService.create(departmentData);
    } catch (error) {
      throw error;
    }
  }

  @Get('get-all')
  @Public()
  async findAll() {
    return await this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.departmentsService.findOne(id);
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
    @Body() updateDepartmentDto: UpdateDepartmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      let imageUrls: string[] = [];
      if (files && files.length > 0) {
        try {
          imageUrls = await this.uploadService.uploadMultipleImages(files);
        } catch (error) {
          imageUrls = files.map(file => `/uploads/${file.filename}`);
        }
      }

      const updateData = {
        ...updateDepartmentDto,
        image: imageUrls.length > 0 ? imageUrls : updateDepartmentDto.image,
      };

      return await this.departmentsService.update(id, updateData);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.departmentsService.remove(id);
  }
}
