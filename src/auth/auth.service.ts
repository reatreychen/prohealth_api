import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  // inject user service
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const userExists = await this.userService.findByEmail(loginDto.email);
      if (!userExists) {
        throw new HttpException('Invalid credentials', 401);
      }

      const passwordMatches = await this.userService.compareHash(
        loginDto.password,
        userExists.password, // hash from database
      );

      if (!passwordMatches) {
        throw new HttpException('Invalid credentials', 401);
      }

      // generate JWT token
      const token = await this.jwtService.signAsync({
        userId: userExists.id,
      });

      if (!token) {
        throw new HttpException('Invalid credentials', 401);
      }

      return {
        data: userExists,
        access_token: token,
        token_type: 'bearer',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async register(dto: RegisterDto) {
    const userExists = await this.userService.findByEmail(dto.email);
    if (userExists) {
      throw new HttpException('User already exists', 400);
    }
    const user = await this.userService.create(dto);

    if (!user) {
      throw new HttpException('User not created', 400);
    }

    // generate JWT token
    const token = await this.jwtService.signAsync({
      userId: user.id,
    });

    if (!token) {
      throw new HttpException('Invalid credentials', 401);
    }

    return {
      user,
      access_token: token,
      token_type: 'bearer',
    };
  }
}
