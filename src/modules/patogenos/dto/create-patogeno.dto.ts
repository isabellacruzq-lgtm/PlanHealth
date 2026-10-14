import { TipoPatogeno } from '../patogeno.entity.js';
export class CreatePatogenoDto {
  nombre!: string;
  nombreCientifico!: string;
  tipo!: TipoPatogeno;
  transmision!: string;
  secuenciaGenetica!: string;
}
