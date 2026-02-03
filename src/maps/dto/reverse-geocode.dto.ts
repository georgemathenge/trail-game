// src/maps/dto/reverse-geocode.dto.ts

import { IsNumber } from 'class-validator';

export class ReverseGeocodeDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
