import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? Number(value) : value))
  @IsNumber()
  mobile: number;

  @IsOptional()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  address_detail: string;

  @IsOptional()
  @IsString()
  shopping_cart?: string;

  @IsOptional()
  @IsString()
  role: string;
}
