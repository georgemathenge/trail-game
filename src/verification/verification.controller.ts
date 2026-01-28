import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateVerificationDto } from './dto/update-verification.dto.js';
import { VerificationService } from './verification.service.js';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service.js';

@Controller('verification')
export class VerificationController {
  constructor(
    private readonly verificationService: VerificationService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFICATION_SECRET,
      });

      const user = await this.authService.findUserById(payload.sub);
      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      if (user.email_verified) {
        return { message: 'Email already verified' };
      }

      await this.authService.markEmailAsVerified(payload.sub, token);
      return { status: 204, message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException('Invalid or expired token');
      }
      throw new InternalServerErrorException('Verification failed');
    }
  }

  @Get()
  findAll() {
    return this.verificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.verificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateVerificationDto: UpdateVerificationDto,
  ) {
    return this.verificationService.update(+id, updateVerificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.verificationService.remove(+id);
  }
}
