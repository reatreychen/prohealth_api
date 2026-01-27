import {HttpException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {CategoryRepository} from "../categories/category.repository";
import {In} from "typeorm";
import {ProductRepository} from "./product.repository";
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
      private readonly productRepository: ProductRepository,
      private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(dto: CreateProductDto) {
    try {
      let categories: Category[] = [];

      if (dto.categoryIds && Array.isArray(dto.categoryIds) && dto.categoryIds.length > 0) {
        categories = await this.categoryRepository.find({
          where: { id: In(dto.categoryIds) },
        });
      }
      
      // Remove categoryIds from dto before creating product
      const { categoryIds, ...productData } = dto;
      
      console.log('Creating product with data:', {
        name: productData.name,
        image: productData.image,
        imageType: typeof productData.image,
        imageIsArray: Array.isArray(productData.image),
      });
      
      // Ensure image is always an array
      const imageArray = Array.isArray(productData.image) 
        ? productData.image 
        : (productData.image ? [productData.image] : []);
      
      const product = this.productRepository.create({
        ...productData,
        image: imageArray,
        categories,
      });
      
      console.log('Product entity before save:', {
        name: product.name,
        image: product.image,
        imageLength: product.image?.length,
      });
      
      const savedProduct = await this.productRepository.save(product);
      
      console.log('Product saved with images:', {
        id: savedProduct.id,
        image: savedProduct.image,
        imageLength: savedProduct.image?.length,
      });
      
      return {
        message: 'Product created successfully',
        data: savedProduct,
        success: true,
        error: false,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['categories'],
    });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);

    if (dto.categoryIds && Array.isArray(dto.categoryIds)) {
      product.categories = await this.categoryRepository.find({
        where: { id: In(dto.categoryIds) },
      });
    }

    if (dto.image !== undefined) {
      product.image = Array.isArray(dto.image)
          ? dto.image
          : [dto.image];
    }

    const { categoryIds, ...productData } = dto;
    Object.assign(product, productData);

    return await this.productRepository.save(product);
  }


  async remove(id: string) {
    const product = await this.findOne(id);
     await this.productRepository.delete(id);
    return {
      message: 'Product deleted successfully',
      data: product,
      success: true,
      error: false,
    };
  }
}
