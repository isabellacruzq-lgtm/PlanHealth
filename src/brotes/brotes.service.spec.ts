import { Test, TestingModule } from '@nestjs/testing';
import { BrotesService } from './brotes.service.js';

describe('BrotesService', () => {
  let service: BrotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BrotesService],
    }).compile();

    service = module.get<BrotesService>(BrotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
