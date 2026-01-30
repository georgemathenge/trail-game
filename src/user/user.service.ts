import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService } from '../services/cloudinary/cloudinary.service.js';

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
