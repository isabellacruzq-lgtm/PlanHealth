import { PartialType } from '@nestjs/swagger';
import { CreateTratamientoDto } from './create-tratamiento.dto.js';

export class UpdateTratamientoDto extends PartialType(CreateTratamientoDto) {}
