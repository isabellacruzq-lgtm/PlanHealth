import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticasController } from './estadisticas.controller.js';
import { EstadisticasService } from './estadisticas.service.js';
import { Brote } from '../brotes/entities/brote.entity.js';
import { Planta } from '../plantas/planta.entity.js';
import { Enfermedad } from '../enfermedades/enfermedad.entity.js';
import { Patogeno } from '../patogenos/patogeno.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brote,
      Planta,
      Enfermedad,
      Patogeno,
    ]),
  ],
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
})
export class EstadisticasModule {}
