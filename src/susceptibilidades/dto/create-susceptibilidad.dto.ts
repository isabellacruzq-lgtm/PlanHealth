import { ApiProperty } from '@nestjs/swagger';
import { NivelSusceptibilidad } from '../susceptibilidad.entity.js';

export class CreateSusceptibilidadDto {
  @ApiProperty({ example: 1, description: 'ID de una planta existente' })
  plantaId!: number;

  @ApiProperty({ example: 2, description: 'ID de una enfermedad existente' })
  enfermedadId!: number;

  @ApiProperty({ enum: NivelSusceptibilidad, example: NivelSusceptibilidad.MEDIA })
  nivel!: NivelSusceptibilidad;
}
