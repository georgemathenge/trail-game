import { Module } from '@nestjs/common';
import { TrailController } from './trail.controller.js';
import { TrailService } from './trail.service.js';

@Module({
  controllers: [TrailController],
  providers: [TrailService],
})
export class TrailModule {}
