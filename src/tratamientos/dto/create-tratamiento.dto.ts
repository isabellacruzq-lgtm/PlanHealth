import { ApiProperty } from '@nestjs/swagger';
import { TipoTratamiento } from '../tratamiento.entity.js';

export class CreateTratamientoDto {
  @ApiProperty({ example: 'Control biológico' })
  nombre!: string;

  @ApiProperty({ example: 'Aplicar según las indicaciones técnicas del producto.' })
  descripcionAplicacion!: string;

  @ApiProperty({ enum: TipoTratamiento, example: TipoTratamiento.BIOLOGICO })
  tipo!: TipoTratamiento;

  @ApiProperty({ example: 1, description: 'ID de una enfermedad existente' })
  enfermedadId!: number;
}
