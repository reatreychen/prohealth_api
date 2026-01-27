import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbstractRepository } from '../shared/repository.abstract';
import {Doctor} from "./entities/doctor.entity";

@Injectable()
export class DoctorRepository extends AbstractRepository<Doctor> {
    constructor(
        @InjectRepository(Doctor)
        repository: Repository<Doctor>,
    ) {
        super(repository);
    }
}
