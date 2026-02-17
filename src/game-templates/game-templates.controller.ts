import { Controller, Get, Param } from '@nestjs/common';
import { GameTemplate } from './constants/template.constant.js';
import { GameTemplatesService } from './game-templates.service.js';
import {
  ApiResponse,
  PaginatedResponse,
} from '../common/filters/all-exceptions.filter.js';

@Controller('game-templates')
export class GameTemplatesController {
  constructor(private readonly gameTemplatesService: GameTemplatesService) {}

  @Get()
  findAll(): ApiResponse<PaginatedResponse<GameTemplate>> {
    return this.gameTemplatesService.getAllTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GameTemplate[] {
    return [this.gameTemplatesService.getTemplateById(id)];
  }
}
