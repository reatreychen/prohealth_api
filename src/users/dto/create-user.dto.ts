import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
