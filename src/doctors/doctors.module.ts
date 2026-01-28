import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import {DoctorRepository} from "./doctor.repository";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Doctor} from "./entities/doctor.entity";
import {DepartmentsModule} from "../departments/departments.module";
import {UploadModule} from "../upload/upload.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]),
      DepartmentsModule,
      UploadModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService,DoctorRepository],

})
export class DoctorsModule {}
