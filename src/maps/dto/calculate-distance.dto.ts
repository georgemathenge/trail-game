// src/maps/dto/calculate-distance.dto.ts

import { IsNumber } from 'class-validator';

export class CalculateDistanceDto {
  @IsNumber()
  lat1: number;

  @IsNumber()
  lng1: number;

  @IsNumber()
  lat2: number;

  @IsNumber()
  lng2: number;
}
