import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { AbstractRepository } from '../shared/repository.abstract';

@Injectable()
export class DepartmentRepository extends AbstractRepository<Department> {
  constructor(
    @InjectRepository(Department)
    repository: Repository<Department>,
  ) {
    super(repository);
  }
}
