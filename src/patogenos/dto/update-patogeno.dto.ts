import { PartialType } from '@nestjs/swagger';
import { CreatePatogenoDto } from './create-patogeno.dto.js';

export class UpdatePatogenoDto extends PartialType(CreatePatogenoDto) {}
