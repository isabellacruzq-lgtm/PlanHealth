import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { TipoCultivo } from '../planta.entity.js';

export class CreatePlantaDto {
  @ApiProperty({ example: 'Tomate' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreComun!: string;

  @ApiProperty({ example: 'Solanum lycopersicum' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCientifico!: string;

  @ApiProperty({ example: 'Solanaceae' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  familiaBotanica!: string;

  @ApiProperty({
    enum: ['hortaliza', 'frutal', 'cereal', 'ornamental', 'otro'],
  })
  @IsEnum(TipoCultivo)
  tipoCultivo!: TipoCultivo;

  @ApiProperty({ example: 'ACGTACGT' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[ACGT]+$/, {
    message:
      'secuenciaGenetica debe contener únicamente A, C, G y T en mayúsculas',
  })
  secuenciaGenetica!: string;
}