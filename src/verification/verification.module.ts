import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MailService } from '../services/mail/mail.service.js';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    PrismaModule,
  ],
  providers: [VerificationService, AuthService, MailService],
  exports: [VerificationService],
})
export class VerificationModule {}
