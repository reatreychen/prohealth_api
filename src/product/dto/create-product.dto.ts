import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  stock?: number;

  // category IDs - transform single string to array for form-data compatibility
  @IsOptional()
  @Transform(({ value }) => {
    if (!value || value === '') return undefined;
    if (Array.isArray(value)) {
      // Filter out empty strings
      return value.filter((v) => v && v !== '');
    }
    // If it's a single string, convert to array
    if (typeof value === 'string') {
      return [value];
    }
    return undefined;
  })
  @IsArray()
  categoryIds?: string[];

  @IsArray()
  @IsOptional()
  image?: string[];

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : Number(value)))
  discount?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  public?: boolean;
}
