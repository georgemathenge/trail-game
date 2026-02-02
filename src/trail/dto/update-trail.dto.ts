import { PartialType } from '@nestjs/swagger';
import { CreateTrailDto } from './create-trail.dto.js';

export class UpdateTrailDto extends PartialType(CreateTrailDto) {}
