import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {DoctorRepository} from "./doctor.repository";
import {UserRepository} from "../users/user.repository";

@Injectable()
export class DoctorsService {

  // inject the DoctorRepository here in the constructor
    constructor(
        private readonly doctorRepository: DoctorRepository,
        private readonly userRepository : UserRepository
    ) {}
  async create(dto: CreateDoctorDto) {

  }

  findAll() {
    return `This action returns all doctors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
