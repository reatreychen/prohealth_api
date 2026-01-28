import {IsArray, IsNotEmpty, IsOptional, IsString, IsUUID} from "class-validator";

export class CreateDoctorDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    departmentId: string;

    @IsArray()
    @IsOptional()
    image?: string[];

    @IsOptional()
    @IsString()
    description?: string;
}
