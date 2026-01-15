import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoryRepository) {}

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
    return await this.categoriesRepository.find();
  }

  async findOne(id: number) {
    return await this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
      });
      if (!category) {
        throw new HttpException(`Category with id ${id} not found`, 400);
      }

      const updatedCategory = Object.assign(category, updateCategoryDto);
      return await this.categoriesRepository.save(updatedCategory);
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async remove(id: number) {
    try {
      await this.categoriesRepository.delete(id);
      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }
}
