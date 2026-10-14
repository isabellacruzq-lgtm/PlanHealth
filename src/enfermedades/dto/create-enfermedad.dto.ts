import { EpocaRiesgo } from '../enfermedad.entity.js';
export class CreateEnfermedadDto {
  nombre!: string;
  descripcionSintomas!: string;
  epocaRiesgo!: EpocaRiesgo;
  patogenoId!: number;
}
