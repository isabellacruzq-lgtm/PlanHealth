import { PartialType } from '@nestjs/swagger';
import { CreateSusceptibilidadDto } from './create-susceptibilidad.dto.js';

export class UpdateSusceptibilidadDto extends PartialType(CreateSusceptibilidadDto) {}
