import { TipoTratamiento } from '../tratamiento.entity.js';
export class UpdateTratamientoDto {
  nombre?: string;
  descripcionAplicacion?: string;
  tipo?: TipoTratamiento;
  enfermedadId?: number;
}
