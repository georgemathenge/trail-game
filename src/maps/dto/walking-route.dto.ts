// src/maps/dto/walking-route.dto.ts

import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class WalkingRouteDto {
  @ValidateNested()
  @Type(() => CoordinateDto)
  start: CoordinateDto;

  @ValidateNested()
  @Type(() => CoordinateDto)
  end: CoordinateDto;
}
