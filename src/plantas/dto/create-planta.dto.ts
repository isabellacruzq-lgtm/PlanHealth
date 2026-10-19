import { ApiProperty } from '@nestjs/swagger';
import { TipoCultivo } from '../planta.entity.js';

export class CreatePlantaDto {
  @ApiProperty({ example: 'Tomate', description: 'Nombre común de la planta' })
  nombreComun!: string;

  @ApiProperty({ example: 'Solanum lycopersicum', description: 'Debe ser único' })
  nombreCientifico!: string;

  @ApiProperty({ example: 'Solanaceae' })
  familiaBotanica!: string;

  @ApiProperty({ enum: TipoCultivo, example: TipoCultivo.HORTALIZA })
  tipoCultivo!: TipoCultivo;

  @ApiProperty({ example: 'ACGTACGT', description: 'Solo A, C, G y T mayúsculas' })
  secuenciaGenetica!: string;
}
