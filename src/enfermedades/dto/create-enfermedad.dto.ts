import { ApiProperty } from '@nestjs/swagger';
import { EpocaRiesgo } from '../enfermedad.entity.js';

export class CreateEnfermedadDto {
  @ApiProperty({ example: 'Mosaico del tomate' })
  nombre!: string;

  @ApiProperty({ example: 'Manchas y deformación de hojas' })
  descripcionSintomas!: string;

  @ApiProperty({ enum: EpocaRiesgo, example: EpocaRiesgo.TODO_EL_ANO })
  epocaRiesgo!: EpocaRiesgo;

  @ApiProperty({ example: 1, description: 'ID de un patógeno existente' })
  patogenoId!: number;
}
