import { PartialType } from '@nestjs/swagger';
import { CreateCultivoDto } from './create-cultivo.dto.js';

export class UpdateCultivoDto extends PartialType(CreateCultivoDto) {}
