import {HttpException, Injectable} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {DepartmentRepository} from "./department.repository";

@Injectable()
export class DepartmentsService {
    constructor(
        private readonly departmentRepository: DepartmentRepository
    ) {}
  async create(dto: CreateDepartmentDto) {
    try {
        const department =this.departmentRepository.create(dto);
        // if department with same name exists, throw error
        const existing = await this.departmentRepository.findOne({where: {title: dto.title}});
        if(existing){
            throw new HttpException('Department with same title already exists', 400);
        }
        const saved = await this.departmentRepository.save(department);
         if(!saved){
             throw new HttpException('Failed to create department', 500);
         }
        return {
            success: true,
            message: 'Department created successfully',
            data: saved,
        };
    }catch (error) {
        throw new HttpException(error.message, 500);
    }
  }

  async findAll() {
    try {
        const departments = await this.departmentRepository.find();
        return {
            success: true,
            message: 'Departments retrieved successfully',
            data: departments,
        };
    } catch (error) {
        throw new HttpException(error.message, 500);
    }
  }

  async findOne(id: string) {
    try {
        const department = await this.departmentRepository.findOne({where: {id}});
        if (!department) {
            throw new HttpException('Department not found', 404);
        }
        return {
            success: true,
            message: 'Department retrieved successfully',
            data: department,
        };
    } catch (error) {
        throw new HttpException(error.message, 500);
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    const department = await this.departmentRepository.findOne({where: {id}});
    if (!department) {
        throw new HttpException('Department not found', 404);
    }

    const update = await this.departmentRepository.save({
        ...department,
        ...updateDepartmentDto,
    })

      return {
        success: true,
        message: 'Department updated successfully',
        data: update,
      }
  }

  async remove(id: string) {
        const department = await this.departmentRepository.findOne({where: {id}});
        if (!department) {
            throw new HttpException('Department not found', 404);
        }
        const remove = await this.departmentRepository.remove(department);
        return {
            success: true,
            message: 'Department removed successfully',
            data: remove,
        };
  }
}
