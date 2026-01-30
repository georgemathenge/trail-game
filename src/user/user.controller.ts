import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
  InternalServerErrorException,
} from '@nestjs/common';

import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../shared/upload/upload.service.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/role.decorator.js';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMyProfile(@Request() req: any) {
    return this.userService.fetchUserProfile(req.user.id);
  }

  @Patch('profile')
  @Roles('admin', 'creator', 'player  ')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Body() body: any, @Request() req: any) {
    return this.userService.updateProfile(req.user.id, body);
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/^(image\/jpeg|image\/png|image\/jpg)$/)) {
          return callback(
            new InternalServerErrorException(
              'Only JPEG, PNG, and JPG files are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    const { url } = await this.uploadService.uploadImage(file);
    return this.userService.updateAvatar(req.user.id, url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
