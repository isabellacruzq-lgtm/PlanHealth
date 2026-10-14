import { TipoTratamiento } from '../tratamiento.entity.js';
export class CreateTratamientoDto {
  nombre!: string;
  descripcionAplicacion!: string;
  tipo!: TipoTratamiento;
  enfermedadId!: number;
}
