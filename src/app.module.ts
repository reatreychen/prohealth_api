import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AcessJwtGuard } from './auth/guards/access-jwt.guard';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
// import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/orderItem.entity';
import { DoctorsModule } from './doctors/doctors.module';
import { PostsModule } from './posts/posts.module';
import { PricingPlansModule } from './pricing-plans/pricing-plans.module';
import { PricingPlan } from './pricing-plans/entities/pricing-plan.entity';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';
import { DepartmentsModule } from "./departments/departments.module";
import { Department } from "./departments/entities/department.entity";
import { Doctor } from "./doctors/entities/doctor.entity";
import { Post } from "./posts/entities/post.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'yamabiko.proxy.rlwy.net'),
        port: configService.get<number>('DB_PORT', 58468),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', 'XMOJVVzrAHGvEWYKcnYdPasvofKNpXWs'),
        database: configService.get('DB_NAME', 'railway'),
        entities: [User, Category, Product, Department, Doctor, Post, Order, OrderItem, PricingPlan],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductModule,
    UploadModule,
    // CartsModule,
    OrdersModule,
    DepartmentsModule,
    DoctorsModule,
    PostsModule,
    PricingPlansModule,
  ],

  providers: [
    {
      useClass: AcessJwtGuard,
      provide: APP_GUARD,
    },
    UploadService,
  ],
})
export class AppModule { }
