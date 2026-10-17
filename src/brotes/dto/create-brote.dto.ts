import { ApiProperty } from '@nestjs/swagger';

export class CreateBroteDto {
  @ApiProperty({ example: 1, description: 'ID de una planta existente' })
  plantaId!: number;

  @ApiProperty({ example: 2, description: 'ID de una enfermedad existente' })
  enfermedadId!: number;

  @ApiProperty({ example: '2026-05-12', description: 'Formato YYYY-MM-DD; no puede ser futura' })
  fecha!: string;

  @ApiProperty({ example: 'Caldas' })
  region!: string;

  @ApiProperty({ example: 2.5, description: 'Número mayor que cero' })
  hectareasAfectadas!: number;
}
