import { PartialType } from '@nestjs/mapped-types';

import { CreateEnfermedadDto } from './create-enfermedad.dto.js';

export class UpdateEnfermedadDto extends PartialType(
  CreateEnfermedadDto,
  {
    skipNullProperties: false,
  },
) {}