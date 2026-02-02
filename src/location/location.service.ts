import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto.js';
import { UpdateLocationDto } from './dto/update-location.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { Location } from './entities/location.entity.js';
import { stat } from 'fs';

@Injectable()
export class LocationService {
  constructor(private readonly prisma: PrismaService) {}
  async createLocation(createLocationDto: CreateLocationDto) {
    try {
      const location = await this.prisma.locations.create({
        data: {
          ...createLocationDto,
        },
      });
      return location;
    } catch (error) {
      if (error.code === 'P2000' || error.code === 'P2002') {
        throw new BadRequestException('Invalid input data');
      }
      throw new InternalServerErrorException(
        'Failed to create location: ' + error,
      );
    }
  }

  async findAllLocations(options: {
    search?: string;
    page: number;
    limit: number;
  }) {
    const { search, page, limit } = options;
    const skip = (page - 1) * limit;
    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              city: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};
    try {
      const locations: Location[] = await this.prisma.locations.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          created_at: true,
          updated_at: true,
        },
        skip,
        take: limit,
      });
      return locations;
    } catch (error) {
      if (error.code === 'P2000' || error.code === 'P2002') {
        throw new BadRequestException('Invalid input data');
      }
      throw new InternalServerErrorException(
        'Failed to Fetch location: ' + error,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  async updateLocation(id: string, updateLocationDto: UpdateLocationDto) {
    try {
      const location = await this.prisma.locations.update({
        where: { id },
        data: {
          ...updateLocationDto,
        },
      });
      return location;
    } catch (error) {
      if (error.code === 'P2000' || error.code === 'P2002') {
        throw new BadRequestException('Invalid input data');
      }
      throw new InternalServerErrorException(
        'Failed to create location: ' + error,
      );
    }
  }

  async deleteLocation(id: string) {
    try {
      await this.prisma.locations.delete({
        where: { id },
      });
      return {
        status: 200,
        message: 'Location deleted successfully',
      };
    } catch (error) {
      if (error.code === 'P2000' || error.code === 'P2002') {
        throw new BadRequestException('Invalid input data');
      }
      throw new InternalServerErrorException(
        'Failed to remove location: ' + error,
      );
    }
  }
}
