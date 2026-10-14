import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Patogeno } from '../patogenos/patogeno.entity.js';
import { Tratamiento } from '../tratamientos/tratamiento.entity.js';

import { Enfermedad } from '../enfermedades/enfermedad.entity.js';
import { EnfermedadesController } from '../enfermedades/enfermedades.controller.js';
import { EnfermedadesService } from '../enfermedades/enfermedades.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Enfermedad,
      Patogeno,
      Tratamiento,
    ]),
  ],
  controllers: [EnfermedadesController],
  providers: [EnfermedadesService],
})
export class EnfermedadesModule {}