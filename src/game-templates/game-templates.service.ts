import { Injectable, NotFoundException } from '@nestjs/common';
import { GAME_TEMPLATES, GameTemplate } from './constants/template.constant.js';

@Injectable()
export class GameTemplatesService {
  // Returns an array of all templates (better for frontend lists)
  getAllTemplates(): GameTemplate[] {
    return Object.values(GAME_TEMPLATES);
  }

  // Returns a single template by ID
  getTemplateById(id: string): GameTemplate {
    const template = GAME_TEMPLATES[id];
    if (!template) {
      throw new NotFoundException(`Template with ID "${id}" not found`);
    }
    return template;
  }
}
