import { Type } from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';

import { EpocaRiesgo } from '../enfermedad.entity.js';

export class FiltrarEnfermedadesDto {
  @IsOptional()
  @IsString({
    message: 'El filtro nombre debe ser un texto',
  })
  @Matches(/\S/, {
    message: 'El filtro nombre no puede estar vacío',
  })
  nombre?: string;

  @IsOptional()
  @IsEnum(EpocaRiesgo, {
    message:
      'epocaRiesgo debe ser primavera, verano, otoño, invierno o todo_el_año',
  })
  epocaRiesgo?: EpocaRiesgo;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'patogenoId debe ser un número entero',
  })
  @Min(1, {
    message: 'patogenoId debe ser mayor o igual a 1',
  })
  patogenoId?: number;
}