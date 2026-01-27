import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import {DoctorRepository} from "./doctor.repository";

@Module({
  controllers: [DoctorsController],
  providers: [DoctorsService,DoctorRepository ],

})
export class DoctorsModule {}
