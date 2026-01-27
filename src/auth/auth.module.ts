import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/access-jwt.strategy';
import { JwtUtil } from './Util/jwt.util';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'fassfaf',
      signOptions: { expiresIn: '5h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtUtil],
  controllers: [AuthController],
  

})
export class AuthModule {}
