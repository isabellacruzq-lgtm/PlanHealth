import { ApiProperty } from '@nestjs/swagger';

export class CreatePlantaDto {
  @ApiProperty({ example: 'Tomate' })
  nombreComun!: string;

  @ApiProperty({ example: 'Solanum lycopersicum' })
  nombreCientifico!: string;

  @ApiProperty({ example: 'Solanaceae' })
  familiaBotanica!: string;

  @ApiProperty({ enum: ['hortaliza', 'frutal', 'cereal', 'ornamental', 'otro'] })
  tipoCultivo!: string;

  @ApiProperty({ example: 'ACGTACGT' })
  secuenciaGenetica!: string;
}
