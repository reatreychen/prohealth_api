import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoryRepository } from "../categories/category.repository";
import { In } from "typeorm";
import { ProductRepository } from "./product.repository";
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { categoryIds, ...productData } = createProductDto;
      const product = this.productRepository.create(productData);

      if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
        const categories = await this.categoryRepository.find({
          where: { id: In(categoryIds) },
        });
        if (categories.length !== categoryIds.length) {
          throw new NotFoundException('One or more categories not found');
        }
        product.categories = categories;
      }

      const savedProduct = await this.productRepository.save(product);

      return {
        success: true,
        message: 'Product created successfully',
        data: savedProduct,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async findAll() {
    const products = await this.productRepository.find({
      relations: ['categories'],
    });
    return {
      success: true,
      data: products
    };
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      message: 'Product retrieved successfully',
      data: product
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const res = await this.findOne(id);
    const product = res.data;

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

    const saved = await this.productRepository.save(product);
    return {
      success: true,
      message: 'Product updated successfully',
      data: saved
    };
  }


  async remove(id: string) {
    const res = await this.findOne(id);
    await this.productRepository.delete(id);
    return {
      success: true,
      message: 'Product deleted successfully',
      data: res.data
    };
  }
}
