import { Test, TestingModule } from '@nestjs/testing';
import { GameTemplatesService } from './game-templates.service';

describe('GameTemplatesService', () => {
  let service: GameTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameTemplatesService],
    }).compile();

    service = module.get<GameTemplatesService>(GameTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
