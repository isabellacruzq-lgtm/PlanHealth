import { PartialType } from '@nestjs/swagger';
import { CreateBroteDto } from './create-brote.dto.js';

export class UpdateBroteDto extends PartialType(CreateBroteDto) {}
