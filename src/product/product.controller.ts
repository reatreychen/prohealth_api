import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFiles, UseInterceptors, Inject } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { Public } from '../shared/decorators/public.decorator';
import { UPLOAD_FOLDER_TOKEN, createUploadStorage } from '../upload/upload.config';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
    @Inject(UPLOAD_FOLDER_TOKEN) private readonly uploadFolder: string,
  ) { }

  @Post('create')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: createUploadStorage(
        process.env.UPLOAD_FOLDER || './uploads',
      ),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      // Upload images to Cloudinary
      let imageUrls: string[] = [];
      try {
        imageUrls = await this.uploadService.uploadMultipleImages(files);
      } catch (uploadError: any) {
        console.error('Image upload error:', uploadError?.message || uploadError);
        // If Cloudinary fails, use local file paths as fallback
        if (files && files.length > 0) {
          imageUrls = files.map((file) => {
            // Return the file path or a relative URL
            return file.path ? `/uploads/${file.filename}` : '';
          }).filter((url) => url !== '');
          console.log('Using local file paths as fallback:', imageUrls);
        }
      }
      // Add image URLs to the DTO - ensure it's always an array
      const productData = {
        ...createProductDto,
        image: imageUrls.length > 0 ? imageUrls : (createProductDto.image || []),
      };

      return await this.productService.create(productData);
    } catch (error) {
      console.error('Product creation error:', error);
      throw error;
    }
  }

  @Get('get-all')
  @Public()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
