import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createUploadStorage } from '../upload/upload.config';
import { UploadService } from '../upload/upload.service';
import { Public } from '../shared/decorators/public.decorator';

import { Roles } from '../shared/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService,
  ) { }

  @Roles('ADMIN')
  @UseGuards(RolesGuard)
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
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    let imageUrls: string[] = [];

    if (files && files.length > 0) {
      try {
        imageUrls = await this.uploadService.uploadMultipleImages(files);
      } catch (error) {
        // fallback to local
        imageUrls = files
          .map((file) => (file.filename ? `/uploads/${file.filename}` : null))
          .filter(Boolean) as string[];
      }
    }

    return this.postsService.create({
      ...createPostDto,
      image: imageUrls,
    });
  }

  @Get('get-all')
  async findAll() {
    return await this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
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
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const post = await this.postsService.findOne(id);

    let imageUrls: string[] = post.data.image || [];

    if (files && files.length > 0) {
      try {
        const uploadedUrls = await this.uploadService.uploadMultipleImages(
          files,
        );
        imageUrls = imageUrls.concat(uploadedUrls);
      } catch (error) {
        // fallback to local
        const localUrls = files
          .map((file) => (file.filename ? `/uploads/${file.filename}` : null))
          .filter(Boolean) as string[];
        imageUrls = imageUrls.concat(localUrls);
      }
    }

    return this.postsService.update(id, {
      ...updatePostDto,
      image: imageUrls,
    });

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.postsService.remove(id);
  }
}
