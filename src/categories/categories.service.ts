import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) { }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoriesRepository.create(createCategoryDto);

      if (!category) {
        throw new HttpException('Category creation failed', 400);
      }

      const savedCategory = await this.categoriesRepository.save(category);
      return {
        message: 'Category created successfully',
        category: savedCategory,
        success: true,
        error: false,
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll() {
    const categories = await this.categoriesRepository.find({
      relations: ['products'],
    });
    return {
      success: true,
      data: categories
    };
  }

  async findOne(id: string) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      // validation
      if (!category) {
        throw new HttpException(`Category with id ${id} not found`, 400);
      }

      return {
        message: 'Category found successfully',
        category,
        success: true,
        error: false,
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });

      // validation
      if (!category) {
        throw new HttpException(`Category with id ${id} not found`, 400);
      }

      const updatedCategory = Object.assign(category, updateCategoryDto);
      await this.categoriesRepository.save(updatedCategory);

      return {
        message: 'Category updated successfully',
        category: updatedCategory,
        success: true,
        error: false,
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async remove(id: string) {
    try {
      const category = await this.categoriesRepository.findOne({ where: { id } });
      if (!category) {
        throw new HttpException(`Category with id ${id} not found`, 404);
      }

      await this.categoriesRepository.delete(id);

      return {
        message: 'Category deleted successfully',
        success: true,
        error: false,
      };
    } catch (error) {
      const message = error.message || 'Failed to delete category. It might be linked to products.';
      throw new HttpException(message, 400);
    }
  }
}
