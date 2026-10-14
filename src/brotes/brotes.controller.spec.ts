import { Test, TestingModule } from '@nestjs/testing';
import { BrotesController } from './brotes.controller.js';
import { BrotesService } from './brotes.service.js';

describe('BrotesController', () => {
  let controller: BrotesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrotesController],
      providers: [BrotesService],
    }).compile();

    controller = module.get<BrotesController>(BrotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
