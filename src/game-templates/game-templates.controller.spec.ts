import { Test, TestingModule } from '@nestjs/testing';
import { GameTemplatesController } from './game-templates.controller';

describe('GameTemplatesController', () => {
  let controller: GameTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameTemplatesController],
    }).compile();

    controller = module.get<GameTemplatesController>(GameTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
