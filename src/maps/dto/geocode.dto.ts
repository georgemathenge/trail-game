// src/maps/dto/geocode.dto.ts

import { IsString, IsNotEmpty } from 'class-validator';

export class GeocodeDto {
  @IsString()
  @IsNotEmpty()
  address: string;
}
