// create-trail.dto.ts

import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class CreateTrailDto {
  @IsInt()
  @Min(1)
  trail_number: number;

  @IsOptional()
  @IsString()
  location_id: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsInt()
  elevation?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty_rating?: number;

  @IsOptional()
  @IsNumber()
  distance_from_start?: number;
}

// bulk-create-trails.dto.ts
export class BulkCreateTrailsDto {
  @IsArray()
  trails: CreateTrailDto[];
}
