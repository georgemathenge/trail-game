import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGameDto } from './dto/create-game.dto.js';
import { create } from 'lodash';

@Injectable()
export class GameService {
  constructor(private readonly prisma: PrismaService) {}

  async createGame(createGameDto: CreateGameDto, userId: string) {
    console.log(createGameDto);
    const { checkpoints, ...gameData } = createGameDto;
    const combineDateAndTime = (dateStr: string, timeStr: string) => {
      return new Date(`${dateStr}T${timeStr}:00`);
    };

    try {
      const game = await this.prisma.games.create({
        data: {
          ...gameData,
          creator_id: userId,
          // Convert strings to Date objects safely
          scheduled_date: gameData.scheduled_date
            ? new Date(gameData.scheduled_date)
            : new Date(),
          scheduled_time: combineDateAndTime(
            gameData.scheduled_date,
            gameData.scheduled_time,
          ),

          registration_deadline: gameData.registration_deadline
            ? new Date(gameData.registration_deadline)
            : null,

          can_cancel_until: gameData.can_cancel_until
            ? new Date(gameData.can_cancel_until)
            : null,

          // 2. THIS IS HOW YOU SAVE THE ARRAY TO PRISMA
          checkpoints: {
            create: checkpoints.map((cp, index) => ({
              name: cp.title,
              content: {
                clue: cp.clue,
                task: cp.task,
                hint: cp.hint,
              },

              points: cp.points,
              latitude: cp.latitude,
              longitude: cp.longitude,
              checkpoint_number: index + 1,

              // Use a default or map it from verificationType if they are related
              checkpoint_type: cp.verificationType || 'standard',
              trail_id: cp.trail_marker_id || null,
            })),
          },
        },
        // Include checkpoints in the returned object so you can see them
        include: {
          checkpoints: true,
        },
      });

      return { message: 'Success', game };
    } catch (error) {
      console.error('Prisma Error:', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'A game with this unique field already exists',
        );
      }
      throw new InternalServerErrorException(
        'Failed to create Game: ' + error.message,
      );
    }
  }
  async fetchGames(creatorId: string) {
    try {
      const games = await this.prisma.games.findMany({
        where: {
          creator_id: creatorId,
        },
        include: {
          locations: true,
          checkpoints: true,
        },
      });

      return games;
    } catch (error) {
      return new InternalServerErrorException(error.message);
    }
  }
}
