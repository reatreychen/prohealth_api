import { HttpException, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorRepository } from './doctor.repository';
import { DepartmentRepository } from '../departments/department.repository';

@Injectable()
export class DoctorsService {
  // inject the DoctorRepository here in the constructor
  constructor(
    private readonly doctorRepository: DoctorRepository,
    protected readonly departmentRepository: DepartmentRepository,
  ) { }

  async create(dto: CreateDoctorDto) {
    const department = await this.departmentRepository.findOne({
      where: { id: dto.departmentId },
    });

    if (!department) {
      throw new HttpException('Department not found', 404);
    }

    const doctor = this.doctorRepository.create({
      name: dto.name,
      image: dto.image,
      description: dto.description,
      department,
    });

    const existing = await this.doctorRepository.findOne({ where: { name: dto.name } });
    if (existing) {
      throw new HttpException('Doctor with same name already exists', 400);
    }

    const saved = await this.doctorRepository.save(doctor);

    if (!saved) {
      throw new HttpException('Failed to create doctor', 500);
    }
    return {
      success: true,
      message: 'Doctor created successfully',
      data: saved,
    }
  }

  async findAll() {
    try {
      const doctors = await this.doctorRepository.find({
        relations: ['department'],
      });
      return {
        success: true,
        message: 'Doctors retrieved successfully',
        data: doctors,
      };
    } catch (error) {
      throw new HttpException('Failed to find doctors', 500);
    }
  }

  async findOne(id: string) {
    try {
      const doctor = await this.doctorRepository.findOne({ where: { id } });
      if (!doctor) {
        throw new HttpException('Doctor not found', 404);
      }
      return {
        success: true,
        message: 'Doctor retrieved successfully',
        data: doctor,
      };
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }

  async update(id: string, dto: UpdateDoctorDto) {
    try {
      const doctor = await this.findOne(id);

      if (dto.departmentId) {
        const department = await this.departmentRepository.findOne({
          where: { id: dto.departmentId },
        });
        if (!department) {
          throw new HttpException('Department not found', 404);
        }
        doctor.data.department = department;
      }


      const updatedDoctor = await this.doctorRepository.save({
        ...doctor.data,
        ...dto,
      });

      return {
        success: true,
        message: 'Doctor updated successfully',
        data: updatedDoctor,
      }

    } catch (e) {
      throw new HttpException('Failed to update doctor', 500);
    }
  }

  async remove(id: string) {
    try {
      const doctor = await this.findOne(id);
      const removed = await this.doctorRepository.remove(doctor.data);
      return {
        success: true,
        message: 'Doctor removed successfully',
        data: removed,
      };
    } catch (e) {
      throw new HttpException('Failed to remove doctor', 500);
    }
  }
}
