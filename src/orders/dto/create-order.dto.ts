import { IsArray, IsNumber, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
    @IsUUID()
    productId: string;

    @IsNumber()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @IsUUID()
    userId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
