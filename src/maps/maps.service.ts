import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// Fixed Imports for ESM compatibility
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import mbxDirections from '@mapbox/mapbox-sdk/services/directions.js';

@Injectable()
export class MapsService {
  private geocodingClient: any;
  private directionsClient: any;
  private accessToken: string;

  constructor(private configService: ConfigService) {
    // FIX: Use '!' or provide a default string to satisfy "string | undefined" error
    const token = this.configService.get<string>('MAPBOX_ACCESS_TOKEN');

    if (!token) {
      throw new Error(
        'MAPBOX_ACCESS_TOKEN not configured in environment variables',
      );
    }

    this.accessToken = token;

    // Initialize Mapbox clients
    this.geocodingClient = mbxGeocoding({ accessToken: this.accessToken });
    this.directionsClient = mbxDirections({ accessToken: this.accessToken });
  }

  async geocodeAddress(address: string) {
    try {
      const response = await this.geocodingClient
        .forwardGeocode({
          query: address,
          limit: 5,
          countries: ['KE'],
        })
        .send();

      if (!response.body.features.length) {
        throw new BadRequestException(`Address not found: ${address}`);
      }

      // FIX: Added explicit type (any) to feature to stop TS7006
      const results = response.body.features.map((feature: any) => ({
        address: feature.place_name,
        latitude: feature.center[1], // Mapbox uses [lng, lat], we want lat
        longitude: feature.center[0],
        bbox: feature.bbox,
        placeType: feature.place_type,
        relevance: feature.relevance,
        context: feature.context,
      }));

      return { query: address, results, count: results.length };
    } catch (error) {
      throw new BadRequestException(`Geocoding failed: ${error.message}`);
    }
  }

  async reverseGeocode(latitude: number, longitude: number) {
    if (!this.validateCoordinates(latitude, longitude)) {
      throw new BadRequestException('Invalid coordinates');
    }

    try {
      const response = await this.geocodingClient
        .reverseGeocode({
          query: [longitude, latitude],
          limit: 1,
        })
        .send();

      if (!response.body.features.length) {
        throw new BadRequestException('Location not found');
      }

      // FIX: Access the first element of the array [0]
      const feature = response.body.features[0];

      return {
        address: feature.place_name,
        latitude,
        longitude,
        placeType: feature.place_type,
        context: feature.context,
      };
    } catch (error) {
      throw new BadRequestException(
        `Reverse geocoding failed: ${error.message}`,
      );
    }
  }

  async getWalkingRoute(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number },
  ) {
    try {
      const response = await this.directionsClient
        .getDirections({
          profile: 'walking',
          waypoints: [
            { coordinates: [start.lng, start.lat] },
            { coordinates: [end.lng, end.lat] },
          ],
          geometries: 'geojson',
          overview: 'full',
          steps: true,
        })
        .send();

      if (!response.body.routes.length) {
        throw new BadRequestException('No route found');
      }

      // FIX: Access the first route in the array [0]
      const route = response.body.routes[0];

      return {
        distance: {
          meters: route.distance,
          kilometers: (route.distance / 1000).toFixed(2),
          text: this.formatDistance(route.distance),
        },
        duration: {
          seconds: route.duration,
          minutes: Math.ceil(route.duration / 60),
          text: this.formatDuration(route.duration),
        },
        geometry: route.geometry,
        steps: route.legs?.[0]?.steps || [], // FIX: Access legs[0]
      };
    } catch (error) {
      throw new BadRequestException(
        `Route calculation failed: ${error.message}`,
      );
    }
  }

  async getMultiWaypointRoute(waypoints: Array<{ lat: number; lng: number }>) {
    try {
      const response = await this.directionsClient
        .getDirections({
          profile: 'walking',
          waypoints: waypoints.map((wp) => ({
            coordinates: [wp.lng, wp.lat],
          })),
          geometries: 'geojson',
          overview: 'full',
        })
        .send();

      if (!response.body.routes.length) {
        throw new BadRequestException('No route found');
      }

      // FIX: Access the first route in the array [0]
      const route = response.body.routes[0];

      return {
        totalDistance: {
          meters: route.distance,
          kilometers: (route.distance / 1000).toFixed(2),
          text: this.formatDistance(route.distance),
        },
        totalDuration: {
          seconds: route.duration,
          minutes: Math.ceil(route.duration / 60),
          text: this.formatDuration(route.duration),
        },
        geometry: route.geometry,
        waypointCount: waypoints.length,
      };
    } catch (error) {
      throw new BadRequestException(
        `Multi-waypoint route failed: ${error.message}`,
      );
    }
  }

  // ... helper methods (calculateDistance, validateCoordinates, etc) remain the same
  // Just ensure they are included below in your actual file.

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  }

  validateCoordinates(latitude: number, longitude: number): boolean {
    return (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    );
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private formatDistance(meters: number): string {
    return meters < 1000
      ? `${Math.round(meters)} m`
      : `${(meters / 1000).toFixed(1)} km`;
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  }
  getBoundingBox(centerLat: number, centerLng: number, radiusKm: number) {
    const latDelta = radiusKm / 111; // 1 degree ≈ 111 km
    const lngDelta = radiusKm / (111 * Math.cos(this.toRadians(centerLat)));

    return {
      north: centerLat + latDelta,
      south: centerLat - latDelta,
      east: centerLng + lngDelta,
      west: centerLng - lngDelta,
      center: { lat: centerLat, lng: centerLng },
      zoom: this.calculateZoomLevel(radiusKm),
    };
  }

  private calculateZoomLevel(radiusKm: number): number {
    if (radiusKm < 0.5) return 17;
    if (radiusKm < 1) return 16;
    if (radiusKm < 2) return 15;
    if (radiusKm < 5) return 14;
    if (radiusKm < 10) return 13;
    if (radiusKm < 20) return 12;
    return 11;
  }
}
