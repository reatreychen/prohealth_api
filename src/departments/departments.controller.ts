import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post('create')
  async create(@Body() dto: CreateDepartmentDto) {
    return await this.departmentsService.create(dto);
  }

  @Get('get-all')
  async findAll() {
    return await this.departmentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.departmentsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    return await this.departmentsService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.departmentsService.remove(id);
  }
}
