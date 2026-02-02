import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../services/cloudinary/cloudinary.service.js';
import { User } from './entities/user.entity.js';
import { UserRole } from '../auth/dto/register.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async fetchUserProfile(id: string) {
    const user_profile = await this.prisma.users.findUnique({
      where: { id },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        avatar_url: true,
        created_at: true,
        email_verified: true,
        updated_at: true,
      },
    });
    return { user_profile };
  }

  async updateAvatar(id: string, url: string) {
    try {
      await this.prisma.users.update({
        where: { id },
        data: { avatar_url: url },
      });
      return { status: 200, message: 'Avatar updated successfully' };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to update user avatar: ' + error,
      );
    }
  }
  async updateProfile(id: string, body: any) {
    try {
      await this.prisma.users.update({
        where: { id },
        data: body,
      });
      return { status: 200, message: 'Profile updated successfully' };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to update user profile: ' + error,
      );
    }
  }

  async upgradeToCreator(id: string) {
    try {
      await this.prisma.users.update({
        where: { id },
        data: { role: UserRole.CREATOR, creator_verified: false },
      });
      return { status: 200, message: 'Successfully upgraded to creator' };
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to update user profile: ' + error,
      );
    }
  }

  async getCreators(options: {
    search?: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    userId: string;
  }) {
    const { search, page, limit, sortBy, sortOrder, userId } = options;
    // Calculate offset for pagination
    const skip = (page - 1) * limit;
    // Determine sort field with fallback
    const orderBy =
      sortBy === 'popular'
        ? { total_games_created: sortOrder }
        : sortBy === 'highest-rated'
          ? { creator_rating: sortOrder }
          : { created_at: sortOrder };

    const where = search
      ? {
          role: UserRole.CREATOR,
          OR: [
            {
              first_name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              last_name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : { role: UserRole.CREATOR };

    try {
      const creators: User[] = await this.prisma.users.findMany({
        where,
        select: {
          id: true,
          first_name: true,
          last_name: true,
          avatar_url: true,
          creator_rating: true,
          total_games_created: true,
        },
        skip,
        take: limit,
        orderBy,
      });
      return { creators };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch creators: ' + error,
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
