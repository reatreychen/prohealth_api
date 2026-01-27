import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { UserRepository } from '../users/user.repository';
import { ProductRepository } from '../product/product.repository';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {

  }

  @Get()
  findAll() {

  }

  @Get(':id')
  findOne(@Param('id') id: string) {

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {

  }

  @Delete(':id')
  remove(@Param('id') id: string) {

  }
}
