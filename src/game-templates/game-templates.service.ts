import { Injectable, NotFoundException } from '@nestjs/common';
import { GAME_TEMPLATES, GameTemplate } from './constants/template.constant.js';
import {
  ApiResponse,
  PaginatedResponse,
} from '../common/filters/all-exceptions.filter.js';

@Injectable()
export class GameTemplatesService {
  // Returns an array of all templates (better for frontend lists)
  getAllTemplates(
    page: number = 1,
    limit: number = 10,
  ): ApiResponse<PaginatedResponse<GameTemplate>> {
    const allTemplates = Object.values(GAME_TEMPLATES);

    const total = allTemplates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Slice the array to get only the items for the current page
    const items = allTemplates.slice(startIndex, endIndex);

    const paginationData: PaginatedResponse<GameTemplate> = {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return new ApiResponse(
      200, // statusCode
      'Templates fetched successfully', // message
      paginationData, // the data (Layer 2)
    );
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
