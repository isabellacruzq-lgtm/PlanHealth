import { TipoPatogeno } from '../patogeno.entity.js';
export class UpdatePatogenoDto {
  nombre?: string;
  nombreCientifico?: string;
  tipo?: TipoPatogeno;
  transmision?: string;
  secuenciaGenetica?: string;
}
