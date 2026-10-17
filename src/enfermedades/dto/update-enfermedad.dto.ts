import { PartialType } from '@nestjs/swagger';
import { CreateEnfermedadDto } from './create-enfermedad.dto.js';

export class UpdateEnfermedadDto extends PartialType(CreateEnfermedadDto) {}
