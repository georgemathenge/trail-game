// src/maps/maps.controller.ts

import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  ParseFloatPipe,
} from '@nestjs/common';
import { MapsService } from './maps.service.js';
import { CalculateDistanceDto } from './dto/calculate-distance.dto.js';
import { WalkingRouteDto } from './dto/walking-route.dto.js';
import { MultiWaypointRouteDto } from './dto/multi-waypoint-route.dto.js';

@Controller('maps')
export class MapsController {
  constructor(private mapsService: MapsService) {}

  /**
   * GET /maps/geocode?address=Karura Forest, Nairobi
   * Convert address to coordinates
   */
  @Get('geocode')
  async geocode(@Query('address') address: string) {
    return this.mapsService.geocodeAddress(address);
  }

  /**
   * GET /maps/reverse-geocode?lat=-1.2390&lng=36.8352
   * Convert coordinates to address
   */
  @Get('reverse-geocode')
  async reverseGeocode(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
  ) {
    return this.mapsService.reverseGeocode(lat, lng);
  }

  /**
   * POST /maps/calculate-distance
   * Calculate straight-line distance between two points
   */
  @Post('calculate-distance')
  calculateDistance(@Body() dto: CalculateDistanceDto) {
    const distance = this.mapsService.calculateDistance(
      dto.lat1,
      dto.lng1,
      dto.lat2,
      dto.lng2,
    );

    return {
      distance: {
        kilometers: distance,
        meters: distance * 1000,
        text:
          distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance} km`,
      },
      estimatedWalkingTime: {
        minutes: Math.ceil((distance / 5) * 60), // Assuming 5 km/h walking speed
        text: `~${Math.ceil((distance / 5) * 60)} min`,
      },
    };
  }

  /**
   * POST /maps/walking-route
   * Get walking route with turn-by-turn directions
   */
  @Post('walking-route')
  async getWalkingRoute(@Body() dto: WalkingRouteDto) {
    return this.mapsService.getWalkingRoute(dto.start, dto.end);
  }

  /**
   * POST /maps/multi-waypoint-route
   * Get route through multiple waypoints (for entire game route)
   */
  @Post('multi-waypoint-route')
  getMultiWaypointRoute(@Body() dto: MultiWaypointRouteDto) {
    return this.mapsService.getMultiWaypointRoute(dto.waypoints);
  }

  /**
   * GET /maps/bounding-box?lat=-1.2390&lng=36.8352&radius=5
   * Get map viewport bounds for a given center and radius
   */
  @Get('bounding-box')
  getBoundingBox(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', ParseFloatPipe) radius: number,
  ) {
    return this.mapsService.getBoundingBox(lat, lng, radius);
  }
}
