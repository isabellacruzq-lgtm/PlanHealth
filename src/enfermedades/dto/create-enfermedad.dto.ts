import {
  IsEnum,
  IsInt,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

import { EpocaRiesgo } from '../enfermedad.entity.js';

export class CreateEnfermedadDto {
  @IsString({
    message: 'El nombre debe ser un texto',
  })
  @Matches(/\S/, {
    message: 'El nombre no puede estar vacío',
  })
  @MaxLength(150, {
    message: 'El nombre no puede superar los 150 caracteres',
  })
  nombre!: string;

  @IsString({
    message: 'La descripción de síntomas debe ser un texto',
  })
  @Matches(/\S/, {
    message: 'La descripción de síntomas no puede estar vacía',
  })
  descripcionSintomas!: string;

  @IsEnum(EpocaRiesgo, {
    message:
      'epocaRiesgo debe ser primavera, verano, otoño, invierno o todo_el_año',
  })
  epocaRiesgo!: EpocaRiesgo;

  @IsInt({
    message: 'patogenoId debe ser un número entero',
  })
  @Min(1, {
    message: 'patogenoId debe ser mayor o igual a 1',
  })
  patogenoId!: number;
}