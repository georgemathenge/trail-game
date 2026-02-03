import { Module } from '@nestjs/common';
import { MapsService } from './maps.service.js';
import { MapsController } from './maps.controller.js';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [MapsController],
  providers: [MapsService, ConfigService],
  exports: [MapsService],
})
export class MapsModule {}
