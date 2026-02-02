import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateTrailDto } from './dto/create-trail.dto.js';
import { UpdateTrailDto } from './dto/update-trail.dto.js';
import { TrailService } from './trail.service.js';
import { Roles } from '../auth/decorators/role.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Controller('locations/:locationId/trails')
export class TrailController {
  constructor(private readonly trailService: TrailService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'creator')
  addTrailMarker(
    @Param('locationId') locationId: string,
    @Body() dto: CreateTrailDto,
  ) {
    return this.trailService.createTrail(dto, locationId);
  }

  @Get()
  findAll() {
    return this.trailService.findAll();
  }

  @Get()
  async getTrailsByLocation(@Param('locationId') locationId: string) {
    return this.trailService.findByLocation(locationId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrailDto: UpdateTrailDto) {
    return this.trailService.update(id, updateTrailDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.trailService.delete(id);
  }
}
