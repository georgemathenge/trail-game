import { Controller, Get, Param } from '@nestjs/common';
import { GameTemplate } from './constants/template.constant.js';
import { GameTemplatesService } from './game-templates.service.js';

@Controller('game-templates')
export class GameTemplatesController {
  constructor(private readonly gameTemplatesService: GameTemplatesService) {}

  @Get()
  findAll(): GameTemplate[] {
    return this.gameTemplatesService.getAllTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string): GameTemplate[] {
    return [this.gameTemplatesService.getTemplateById(id)];
  }
}
