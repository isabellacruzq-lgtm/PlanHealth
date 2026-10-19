import { ApiProperty } from '@nestjs/swagger';
import { TipoPatogeno } from '../patogeno.entity.js';

export class CreatePatogenoDto {
  @ApiProperty({ example: 'Virus del mosaico' })
  nombre!: string;

  @ApiProperty({ example: 'Tobamovirus tomato mosaic' , description: 'Debe ser único entre patógenos' })
  nombreCientifico!: string;

  @ApiProperty({ enum: TipoPatogeno, example: TipoPatogeno.VIRUS })
  tipo!: TipoPatogeno;

  @ApiProperty({ example: 'Contacto y herramientas contaminadas' })
  transmision!: string;

  @ApiProperty({ example: 'ACGTACGT', description: 'Solo A, C, G y T mayúsculas' })
  secuenciaGenetica!: string;
}
