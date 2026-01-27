import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../shared/decorators/public.decorator';
import { AcessJwtGuard } from './guards/access-jwt.guard';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  // inject service
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
    };

    // set refresh token in cookie
    res.cookie('access_token', result.accessToken, cookieOptions);
    res.cookie('refresh_token', result.refreshToken, cookieOptions);

    return {
      message: 'Login successful',
      data: result.data,
      success: true,
      error: false,
    };
  }

  @Post('register')
  @Public()
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('logout')
  @UseGuards(AcessJwtGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.id);
  }
}
