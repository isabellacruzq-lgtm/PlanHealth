import { PartialType } from '@nestjs/swagger';
import { CreatePlantaDto } from './create-planta.dto.js';

export class UpdatePlantaDto extends PartialType(CreatePlantaDto) {}
