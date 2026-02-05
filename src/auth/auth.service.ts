import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtUtil } from './Util/jwt.util';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  // inject user service
  constructor(
    private readonly userService: UsersService,
    private readonly jwtUtil: JwtUtil,
  ) { }

  async register(dto: RegisterDto) {
    try {
      const userExists = await this.userService.findByEmail(dto.email);
      if (userExists) {
        throw new HttpException('User already exists', 400);
      }

      const user = await this.userService.create({
        ...dto,
      });

      return {
        message: 'User registered successfully',
        data: user,
        success: true,
        error: false,
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(loginDto.password, user.password);
    if (!valid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const accessToken = this.jwtUtil.generateAccessToken(user.id, user.role);
    const refreshToken = this.jwtUtil.generateRefreshToken(user.id);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    // Exclude password and refreshToken from user data
    const { password, refreshToken: _, ...userData } = user;

    return {
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    let payload: any;

    try {
      payload = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN!);
    } catch {
      throw new HttpException('Invalid refresh token', 401);
    }

    const { data: user } = await this.userService.findById(payload.id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new HttpException('Refresh token not valid', 401);
    }

    const newAccessToken = this.jwtUtil.generateAccessToken(user.id, user.role);

    return {
      accessToken: newAccessToken,
    };
  }

  async logout(userId: string) {
    await this.userService.updateRefreshToken(userId, '');
  }
}
