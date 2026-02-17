import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { PrismaService } from './prisma/prisma.service.js';
import { AuthService } from './auth/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthController } from './auth/auth.controller.js';
import { JwtStrategy } from './auth/strategies/jwt.strategies.js';

import { ResendModule } from 'nest-resend';
import { MailService } from './services/mail/mail.service.js';
import { VerificationModule } from './verification/verification.module.js';
import { VerificationController } from './verification/verification.controller.js';
import { UserModule } from './user/user.module.js';
import { UploadModule } from './shared/upload/upload.module.js';
import { CloudinaryService } from './services/cloudinary/cloudinary.service.js';
import { AdminModule } from './admin/admin.module.js';
import { LocationModule } from './location/location.module.js';
import { TrailModule } from './trail/trail.module.js';
import { MapsController } from './maps/maps.controller.js';
import { MapsModule } from './maps/maps.module.js';
import { MapsService } from './maps/maps.service.js';
import { GameTemplatesController } from './game-templates/game-templates.controller.js';
import { GameTemplatesService } from './game-templates/game-templates.service.js';
import { GameModule } from './game/game.module.js';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // seconds
          limit: 10, // requests
        },
      ],
    }),
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' }, // Token expires in 7 days
    }),
    ResendModule.forRoot({
      apiKey: process.env.RESEND_API_KEY || 'your-resend-api-key-here',
    }),
    VerificationModule,
    UserModule,
    UploadModule,
    AdminModule,
    LocationModule,
    TrailModule,
    MapsModule,
    GameModule,
  ],
  controllers: [
    AppController,
    AuthController,
    VerificationController,
    MapsController,
    GameTemplatesController,
  ],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AuthService,
    JwtStrategy,
    MailService,
    GameTemplatesService,
  ],
})
export class AppModule {}
