import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticasService } from './estadisticas.service.js';

describe('EstadisticasService', () => {
  let service: EstadisticasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadisticasService],
    }).compile();

    service = module.get<EstadisticasService>(EstadisticasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
