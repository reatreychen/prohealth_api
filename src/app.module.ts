import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5431,
      username: 'postgres',
      password: 'root',
      database: 'test_nest',
      entities: [User],
      // equivalent to hibernate ddl-auto: update
      synchronize: true,

      // show-sql: true
      logging: true,

      //autoLoadEntities: true,
    }),
    UsersModule,
  ],
})
export class AppModule {}
