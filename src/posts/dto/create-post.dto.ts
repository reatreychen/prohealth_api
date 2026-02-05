import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    @IsArray()
    image?: string[];
}
