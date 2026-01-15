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
// import { CartsModule } from './carts/carts.module';
// import { OrdersModule } from './orders/orders.module';
// import { DepartmentsModule } from './departments/departments.module';
// import { DoctorsModule } from './doctors/doctors.module';
// import { PostsModule } from './posts/posts.module';
// import { PricingPlansModule } from './pricing-plans/pricing-plans.module';
import { UploadService } from './upload/upload.service';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5431),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASS', 'root'),
        database: configService.get('DB_NAME', 'typeorm'),
        entities: [User, Category],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    UploadModule,
    // CartsModule,
    // OrdersModule,
    // DepartmentsModule,
    // DoctorsModule,
    // PostsModule,
    // PricingPlansModule,
  ],

  providers: [
    {
      useClass: AcessJwtGuard,
      provide: APP_GUARD,
    },
    UploadService,
  ],
})
export class AppModule {}
