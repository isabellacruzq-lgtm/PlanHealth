import { ApiProperty } from '@nestjs/swagger';

export class CreateSusceptibilidadDto {
  @ApiProperty({ example: 1 })
  plantaId!: number;

  @ApiProperty({ example: 2 })
  enfermedadId!: number;

  @ApiProperty({ enum: ['baja', 'media', 'alta'] })
  nivel!: string;
}
