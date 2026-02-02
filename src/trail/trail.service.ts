import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrailDto } from './dto/create-trail.dto.js';
import { UpdateTrailDto } from './dto/update-trail.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
// import {
//   calculateDistance,
//   calculateRouteDistance,
//   estimateWalkingTime,
// } from '../utils/util.distance.js';

@Injectable()
export class TrailService {
  constructor(private readonly prisma: PrismaService) {}
  async createTrail(createTrailDto: CreateTrailDto, locationId: string) {
    try {
      const location = await this.prisma.locations.findUnique({
        where: { id: locationId },
      });

      if (!location) {
        throw new NotFoundException('Location not found');
      }

      const existingTrail = await this.prisma.trails.findUnique({
        where: {
          location_id_trail_number: {
            location_id: locationId,
            trail_number: createTrailDto.trail_number,
          },
        },
      });

      if (existingTrail) {
        throw new ConflictException(
          `Trail number ${createTrailDto.trail_number} already exists at this location`,
        );
      }

      if (createTrailDto.latitude < -90 || createTrailDto.latitude > 90) {
        throw new BadRequestException('Invalid latitude');
      }
      if (createTrailDto.longitude < -180 || createTrailDto.longitude > 180) {
        throw new BadRequestException('Invalid longitude');
      }

      // // Auto-calculate distance from start if not provided
      // if (!createTrailDto.distance_from_start) {
      //   createTrailDto.distance_from_start = calculateDistance(
      //     location.latitude,
      //     location.longitude,
      //     createTrailDto.latitude,
      //     createTrailDto.longitude,
      //   );
      // }

      return await this.prisma.trails.create({
        data: {
          ...createTrailDto,
          location_id: locationId,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create trail: ' + error.message,
      );
    }
  }

  findAll() {
    return `This action returns all trail`;
  }

  async findByLocation(id: string) {
    const trail = await this.prisma.trails.findMany({
      where: { location_id: id },
    });
    return trail;
  }

  async update(trailId: string, dto: UpdateTrailDto) {
    try {
      const trail = await this.prisma.trails.findUnique({
        where: { id: trailId },
      });

      if (!trail) {
        throw new NotFoundException('Trail marker not found');
      }

      if (dto.trail_number && dto.trail_number !== trail.trail_number) {
        const existingTrail = await this.prisma.trails.findUnique({
          where: {
            location_id_trail_number: {
              location_id: trail.location_id,
              trail_number: dto.trail_number,
            },
          },
        });

        if (existingTrail) {
          throw new ConflictException(
            `Trail number ${dto.trail_number} already exists`,
          );
        }
      }

      return await this.prisma.trails.update({
        where: { id: trailId },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to update trail: ' + error.message,
      );
    }
  }

  async delete(trailId: string) {
    try {
      const gamesUsingTrail = await this.prisma.checkpoints.count({
        where: { trail_id: trailId },
      });

      if (gamesUsingTrail > 0) {
        throw new BadRequestException(
          `Cannot delete trail marker. It is used in ${gamesUsingTrail} game(s)`,
        );
      }

      return await this.prisma.trails.delete({
        where: { id: trailId },
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to delete trail');
    }
  }
  async bulkCreate(locationId: string, trails: CreateTrailDto[]) {
    try {
      const trailNumbers = trails.map((t) => t.trail_number);
      const uniqueNumbers = new Set(trailNumbers);

      if (uniqueNumbers.size !== trailNumbers.length) {
        throw new BadRequestException('Duplicate trail numbers detected');
      }

      const existingTrails = await this.prisma.trails.findMany({
        where: {
          location_id: locationId,
          trail_number: { in: trailNumbers },
        },
      });

      if (existingTrails.length > 0) {
        throw new ConflictException(
          `Trail numbers ${existingTrails.map((t) => t.trail_number).join(', ')} already exist`,
        );
      }

      return await this.prisma.$transaction(
        trails.map((trail) =>
          this.prisma.trails.create({
            data: {
              ...trail,
              location_id: locationId,
            },
          }),
        ),
      );
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create trails: ' + error.message,
      );
    }
  }

  // Get distance between two trails
  // async getDistanceBetweenTrails(trail1Id: string, trail2Id: string) {
  //   const [trail1, trail2] = await Promise.all([
  //     this.prisma.trails.findUnique({ where: { id: trail1Id } }),
  //     this.prisma.trails.findUnique({ where: { id: trail2Id } }),
  //   ]);

  //   if (!trail1 || !trail2) {
  //     throw new NotFoundException('Trail not found');
  //   }

  //   const distance = calculateDistance(
  //     trail1.latitude,
  //     trail1.longitude,
  //     trail2.latitude,
  //     trail2.longitude,
  //   );

  //   const estimatedTime = estimateWalkingTime(
  //     distance,
  //     Math.max(trail1.difficulty_rating, trail2.difficulty_rating),
  //   );

  //   return {
  //     distance, // km
  //     estimatedTime, // minutes
  //     trail1: {
  //       number: trail1.trail_number,
  //       name: trail1.name,
  //       difficulty: trail1.difficulty_rating,
  //     },
  //     trail2: {
  //       number: trail2.trail_number,
  //       name: trail2.name,
  //       difficulty: trail2.difficulty_rating,
  //     },
  //   };
  // }

  // Calculate total distance for a game route
  // async calculateGameRouteDistance(checkpoints: string[]) {
  //   // checkpoints is array of trail IDs in order
  //   const trails = await this.prisma.trails.findMany({
  //     where: { id: { in: checkpoints } },
  //   });

  //   // Sort trails by checkpoint order
  //   const sortedTrails = checkpoints.map((id) =>
  //     trails.find((t) => t.id === id),
  //   );

  //   const coordinates = sortedTrails.map((t) => ({
  //     latitude: Number(tv.latitude),
  //     longitude: Number(t.longitude),
  //   }));

  //   const totalDistance = calculateRouteDistance(coordinates);

  //   // Calculate average difficulty
  //   const avgDifficulty = Math.round(
  //     sortedTrails.reduce((sum, t) => sum + t.difficulty_rating, 0) /
  //       sortedTrails.length,
  //   );

  //   const estimatedTime = estimateWalkingTime(totalDistance, avgDifficulty);

  //   return {
  //     totalDistance, // km
  //     estimatedTime, // minutes
  //     checkpointCount: checkpoints.length,
  //     averageDifficulty: avgDifficulty,
  //     trails: sortedTrails.map((t) => ({
  //       number: t.trail_number,
  //       name: t.name,
  //       difficulty: t.difficulty_rating,
  //     })),
  //   };
  // }
}
