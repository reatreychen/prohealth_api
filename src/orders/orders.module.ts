import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderItem} from "./entities/orderItem.entity";
import {UsersModule} from "../users/users.module";
import {ProductModule} from "../product/product.module";
import {OrderRepository} from "./order.repository";

@Module({
  imports: [
      TypeOrmModule.forFeature([Order ,OrderItem]),
      UsersModule,
      ProductModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService ,OrderRepository],
  exports: [OrdersService ,OrderRepository],
})
export class OrdersModule {}
