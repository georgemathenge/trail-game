import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { GameService } from './game.service.js';
import { CreateGameDto } from './dto/create-game.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import * as currentUserDto from '../auth/dto/current-user.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('/publish')
  @UseGuards(JwtAuthGuard)
  createGame(
    @Body() createGameDto: CreateGameDto,
    @CurrentUser() user: currentUserDto.RequestUser,
  ) {
    console.log(createGameDto);
    return this.gameService.createGame(createGameDto, user.id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  fetchGames(@CurrentUser() user: currentUserDto.RequestUser) {
    return this.gameService.fetchGames(user.id);
  }
  // @Post('/image-upload')
  // @UseGuards(JwtAuthGuard)
  // uploadImage(
  //   @Body() createGameDto: CreateGameDto,
  //   @CurrentUser() user: currentUserDto.RequestUser,
  // ) {
  //   return this.gameService.createGame(createGameDto, user.id);
  // }
}
