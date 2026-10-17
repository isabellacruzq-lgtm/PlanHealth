import { ApiProperty } from '@nestjs/swagger';

export class CreateCultivoDto {
  @ApiProperty({ example: 1 })
  plantaId!: number;

  @ApiProperty({ example: 'LOTE-A-01' })
  lote!: string;

  @ApiProperty({ example: 'Caldas' })
  region!: string;

  @ApiProperty({ example: '2026-08-15', description: 'Fecha en formato YYYY-MM-DD, no futura' })
  fechaSiembra!: string;

  @ApiProperty({ example: 'ACGTACGT' })
  codigoGeneticoSemilla!: string;
}
