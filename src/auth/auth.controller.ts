import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { LoginDto } from './dto/login.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import * as currentUserDto from './dto/current-user.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: any) {
    return {
      user,
    };
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@CurrentUser() user: currentUserDto.RequestUser) {
    const token = await this.authService.refreshToken(user.id);
    return { token };
  }
}
