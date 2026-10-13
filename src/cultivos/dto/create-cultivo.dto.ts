import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCultivoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  plantaId!: number;

  @ApiProperty({ example: 'LOTE-A-01' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lote!: string;

  @ApiProperty({ example: 'Caldas' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  region!: string;

  @ApiProperty({
    example: '2026-08-15',
    description: 'Fecha en formato YYYY-MM-DD, no futura',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fechaSiembra debe tener formato YYYY-MM-DD',
  })
  fechaSiembra!: string;

  @ApiProperty({ example: 'ACGTACGT' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[ACGT]+$/, {
    message:
      'codigoGeneticoSemilla debe contener únicamente A, C, G y T en mayúsculas',
  })
  codigoGeneticoSemilla!: string;
}