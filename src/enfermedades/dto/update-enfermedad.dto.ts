import { EpocaRiesgo } from '../enfermedad.entity.js';
export class UpdateEnfermedadDto {
  nombre?: string;
  descripcionSintomas?: string;
  epocaRiesgo?: EpocaRiesgo;
  patogenoId?: number;
}
