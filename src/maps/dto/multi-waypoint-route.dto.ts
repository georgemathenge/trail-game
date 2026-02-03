// src/maps/dto/multi-waypoint-route.dto.ts

import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class WaypointDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class MultiWaypointRouteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  @ArrayMinSize(2)
  @ArrayMaxSize(25)
  waypoints: WaypointDto[];
}
